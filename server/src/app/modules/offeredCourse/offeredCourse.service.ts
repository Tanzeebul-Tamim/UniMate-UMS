import QueryBuilder from '../../builder/QueryBuilder';
import {
  TOfferedCourse,
  TUpdateOfferedCourse,
} from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  OfferedCoursePermittedFields,
  OfferedCourseUpdatableFields,
  TimeSlots,
} from './offeredCourse.constant';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Types } from 'mongoose';
import { TAcademicFaculty } from '../academicFaculty/academicFaculty.interface';
import {
  validateCapacity,
  validateCourseFaculty,
  validateDays,
  validateTimeSlot,
} from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (
  payload: TOfferedCourse & {
    timeSlot: number;
  },
) => {
  restrictFieldsValidator(payload, OfferedCoursePermittedFields);

  const {
    semesterRegistration,
    academicDepartment,
    course,
    faculty,
    maxCapacity,
    remainingCapacity,
    timeSlot,
    days,
  } = payload;

  //* Check if the semester registration exists or not
  const getSemesterRegistrationInfo =
    await SemesterRegistration.findById(semesterRegistration).populate(
      'academicSemester',
    );

  if (!getSemesterRegistrationInfo) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  //* Ensure that the semester registration status is 'upcoming'
  if (getSemesterRegistrationInfo.status === 'ended') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This semester has already been ended',
    );
  } else if (getSemesterRegistrationInfo.status === 'ongoing') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This semester is already ongoing',
    );
  }

  //* Check if the academic department exists or not
  const getAcademicDepartmentInfo =
    await AcademicDepartment.findById(academicDepartment).populate(
      'academicFaculty',
    );

  if (!getAcademicDepartmentInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found!');
  }

  //* Check if the course exists or not
  const getCourseInfo = await Course.findById(course);

  if (!getCourseInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  //* Validate section student capacity
  validateCapacity(maxCapacity, remainingCapacity);

  //* Ensure that same day hasn't been put twice
  validateDays(days);

  //* Validate time slot
  const { startTime, endTime } = validateTimeSlot(timeSlot);

  //* Set start time and end time
  payload.startTime = startTime;
  payload.endTime = endTime;

  //* Check if the faculty exists or not
  const getFacultyInfo = await Faculty.findById(faculty);

  if (!getFacultyInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  //* Check if the faculty is assigned to the particular provided course or not
  await validateCourseFaculty(getFacultyInfo, getCourseInfo, faculty, course);

  //* Ensure that the faculty don't have other section assigned on the time slot
  const getConflictCourses = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    startTime,
    endTime,
  }).select('days');

  if (getConflictCourses.length > 0) {
    getConflictCourses.forEach((conflictCourse) => {
      const existingDays = conflictCourse.days;

      existingDays.forEach((existingDay) => {
        if (days.includes(existingDay)) {
          throw new AppError(
            httpStatus.CONFLICT,
            `The faculty already has an assigned course from ${startTime} to ${endTime} on ${existingDay}! Choose a different time or day`,
          );
        }
      });
    });
  }

  //* Set the populated fields into the payload
  const academicSemester =
    getSemesterRegistrationInfo.academicSemester as unknown as TAcademicSemester & {
      _id: Types.ObjectId;
    };

  payload.academicSemester = academicSemester._id;

  const academicFaculty =
    getAcademicDepartmentInfo.academicFaculty as unknown as TAcademicFaculty & {
      _id: Types.ObjectId;
    };

  payload.academicFaculty = academicFaculty._id;

  const result = (
    await (
      await (
        await (
          await (
            await (
              await OfferedCourse.create(payload)
            ).populate('semesterRegistration')
          ).populate('academicSemester')
        ).populate('academicFaculty')
      ).populate('academicDepartment')
    ).populate({
      path: 'course',
      populate: {
        path: 'prerequisiteCourses.course',
        select: ['title', 'code', 'prefix'],
      },
    })
  ).populate('faculty');
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find()
      .populate('semesterRegistration')
      .populate('academicSemester')
      .populate('academicFaculty')
      .populate('academicDepartment')
      .populate({
        path: 'course',
        populate: {
          path: 'prerequisiteCourses.course',
          select: ['title', 'code', 'prefix'],
        },
      })
      .populate('faculty'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;

  return result;
};

const getAnOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id)
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate({
      path: 'course',
      populate: {
        path: 'prerequisiteCourses.course',
        select: ['title', 'code', 'prefix'],
      },
    })
    .populate('faculty');
  return result;
};

const updateAnOfferedCourseIntoDB = async (
  id: string,
  payload: TUpdateOfferedCourse & {
    timeSlot?: number;
  },
) => {
  restrictFieldsValidator(payload, OfferedCourseUpdatableFields);

  const {
    faculty,
    maxCapacity,
    remainingCapacity,
    days: payloadDays,
    timeSlot,
  } = payload;

  //* Check if the offered course exists or not
  const doesOfferedCourseExist = await OfferedCourse.findById(id);

  if (!doesOfferedCourseExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found!');
  }

  //* Check if the semester registration exists or not
  const semesterRegistration = await SemesterRegistration.findById(
    doesOfferedCourseExist.semesterRegistration,
  );

  if (!semesterRegistration) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Semester registration not found!',
    );
  }

  //* Ensure that the semester registration status is not 'ended'
  if (semesterRegistration?.status === 'ended') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'The semester has already been ended',
    );
  }

  //* Ensure that the ongoing courses cannot update student capacity
  if (
    semesterRegistration?.status === 'ongoing' &&
    (payload.maxCapacity || payload.remainingCapacity)
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Cannot update student capacity because the course is ongoing',
    );
  }

  //* Get Course info
  const getCourseInfo = await Course.findById(doesOfferedCourseExist?.course);

  if (!getCourseInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found!');
  }

  //* Validate section student capacity
  validateCapacity(maxCapacity, remainingCapacity);

  if (payloadDays) {
    //* Validate scheduled days
    validateDays(payloadDays);
  }

  if (timeSlot) {
    //* Validate time slot
    const { startTime, endTime } = validateTimeSlot(timeSlot);

    //* Set start time and end time
    payload.startTime = startTime;
    payload.endTime = endTime;
  }

  if (faculty) {
    //* Check if the faculty exists or not
    const getFacultyInfo = await Faculty.findById(faculty);

    if (!getFacultyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    //* Check if the faculty is assigned to the particular provided course or not
    validateCourseFaculty(
      getFacultyInfo,
      getCourseInfo,
      faculty,
      doesOfferedCourseExist.course,
    );

    //* Get all the assigned sections of the faculty
    const getFacultyAssignedCourses = await OfferedCourse.find({ faculty });

    //! Make sure that the faculty don't have any other classes on that particular time slot
    for (const facultyAssignedCourse of getFacultyAssignedCourses) {
      //* 'facultyAssignedCourse' is a particular assigned section/course
      if (facultyAssignedCourse) {
        //* Get the time slot and scheduled days for the particular assigned section of the faculty
        const assignedCourseTimeSlot = [];
        assignedCourseTimeSlot[0] = facultyAssignedCourse.startTime;
        assignedCourseTimeSlot[1] = facultyAssignedCourse.endTime;
        const assignedCourseDays = facultyAssignedCourse.days;

        //* Get the time slot and scheduled days for the current section that is going to be updated
        const currentCourseTimeSlot = [];
        currentCourseTimeSlot[0] = doesOfferedCourseExist.startTime;
        currentCourseTimeSlot[1] = doesOfferedCourseExist.endTime;
        const currentCourseDays = doesOfferedCourseExist.days;

        //* Get the time slot from the client which will be used for update
        const payloadTimeSlot = timeSlot && TimeSlots[timeSlot];

        //* Tracks whether the assigned course conflicts with any scheduled day on the rescheduled day provided by the client in the payload for updating the schedule. If there's a conflict, store the name of the conflicting day. Works when "days" are provided for updating.
        let foundPayloadDayMatch = null;

        //* Tracks whether the assigned course conflicts with any currently scheduled day of the offered course. If there's a conflict, store the name of the conflicting day. Works when "days" are not provided for updating.
        let foundDayMatch = null;

        if (payloadDays) {
          //* Look for conflict days
          for (let i = 0; i < payloadDays.length; i++) {
            const payloadCourseDay = payloadDays[i];
            if (assignedCourseDays.includes(payloadCourseDay)) {
              foundPayloadDayMatch = payloadCourseDay;
              break;
            }
          }

          if (foundPayloadDayMatch) {
            if (timeSlot) {
              if (payloadTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundPayloadDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            } else {
              if (currentCourseTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundPayloadDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            }
          }
        } else {
          //* Look for conflict days
          for (let i = 0; i < currentCourseDays.length; i++) {
            const currentCourseDay = currentCourseDays[i];
            if (assignedCourseDays.includes(currentCourseDay)) {
              foundDayMatch = currentCourseDay;
              break;
            }
          }

          if (foundDayMatch) {
            if (timeSlot) {
              if (payloadTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            } else {
              if (currentCourseTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            }
          }
        }
      } else {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        );
      }
    }
  } else {
    const assignedFaculty = doesOfferedCourseExist.faculty;

    //* Get the assigned faculty for this offered course
    const getFacultyInfo = await Faculty.findById(assignedFaculty);

    if (!getFacultyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    //* Get all the assigned sections of the assigned faculty
    const getFacultyAssignedCourses = await OfferedCourse.find({
      assignedFaculty,
    });

    //! Make sure that the faculty don't have any other classes on that particular time slot
    for (const facultyAssignedCourse of getFacultyAssignedCourses) {
      //* 'facultyAssignedCourse' is a particular assigned section/course
      if (facultyAssignedCourse) {
        //* Get the time slot and scheduled days for the particular assigned section of the faculty
        const assignedCourseTimeSlot = [];
        assignedCourseTimeSlot[0] = facultyAssignedCourse.startTime;
        assignedCourseTimeSlot[1] = facultyAssignedCourse.endTime;
        const assignedCourseDays = facultyAssignedCourse.days;

        //* Get the time slot and scheduled days for the current section that is going to be updated
        const currentCourseTimeSlot = [];
        currentCourseTimeSlot[0] = doesOfferedCourseExist.startTime;
        currentCourseTimeSlot[1] = doesOfferedCourseExist.endTime;
        const currentCourseDays = doesOfferedCourseExist.days;

        //* Get the time slot from the client which will be used for update
        const payloadTimeSlot = timeSlot && TimeSlots[timeSlot];

        //* Tracks whether the assigned course conflicts with any scheduled day on the rescheduled day provided by the client in the payload for updating the schedule. If there's a conflict, store the name of the conflicting day. Works when "days" are provided for updating.
        let foundPayloadDayMatch = null;

        //* Tracks whether the assigned course conflicts with any currently scheduled day of the offered course. If there's a conflict, store the name of the conflicting day. Works when "days" are not provided for updating.
        let foundDayMatch = null;

        if (payloadDays) {
          //* Look for conflict days
          for (let i = 0; i < payloadDays.length; i++) {
            const payloadCourseDay = payloadDays[i];
            if (assignedCourseDays.includes(payloadCourseDay)) {
              foundPayloadDayMatch = payloadCourseDay;
              break;
            }
          }

          if (foundPayloadDayMatch) {
            if (timeSlot) {
              if (payloadTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundPayloadDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            } else {
              if (currentCourseTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundPayloadDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            }
          }
        } else {
          //* Look for conflict days
          for (let i = 0; i < currentCourseDays.length; i++) {
            const currentCourseDay = currentCourseDays[i];
            if (assignedCourseDays.includes(currentCourseDay)) {
              foundDayMatch = currentCourseDay;
              break;
            }
          }

          if (foundDayMatch) {
            if (timeSlot) {
              if (payloadTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            } else {
              if (currentCourseTimeSlot === assignedCourseTimeSlot) {
                throw new AppError(
                  httpStatus.CONFLICT,
                  `The assigned faculty already has a class scheduled during the specified time slot for another section on ${foundDayMatch}. Change the time slot, the scheduled day which is causing the conflict or the faculty to proceed.`,
                );
              }
            }
          }
        }
      } else {
        throw new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        );
      }
    }
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('semesterRegistration')
    .populate('academicSemester')
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('course')
    .populate('faculty');

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getAnOfferedCourseFromDB,
  updateAnOfferedCourseIntoDB,
};
