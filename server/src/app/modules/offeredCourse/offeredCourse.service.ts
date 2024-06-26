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
import { Course, CourseFaculty } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Types } from 'mongoose';
import { TAcademicFaculty } from '../academicFaculty/academicFaculty.interface';

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
  if (getSemesterRegistrationInfo.status !== 'upcoming') {
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
  if (maxCapacity && remainingCapacity) {
    if (maxCapacity < remainingCapacity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Remaining capacity cannot be greater than max capacity',
      );
    }
  } else if (
    (!maxCapacity && remainingCapacity) ||
    (maxCapacity && !remainingCapacity)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please enter both max capacity and remaining capacity',
    );
  }

  //* Validate time slot
  if (timeSlot < 1 || timeSlot > 7) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Invalid time slot number. Valid time slot number range is from 1 to 7',
    );
  }

  //* Get start and end time from time slot
  const startEndTime = TimeSlots[timeSlot];
  const startTime = startEndTime[0];
  const endTime = startEndTime[1];

  //* Ensure that the start time comes before the end time
  const startTimeObj = new Date(`1970-01-01T${startTime}Z`);
  const endTimeObj = new Date(`1970-01-01T${endTime}Z`);

  if (startTimeObj.getTime() >= endTimeObj.getTime()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'End time cannot come before start time',
    );
  }

  //* Set start time and end time
  payload.startTime = startTime;
  payload.endTime = endTime;

  //* Ensure that same day hasn't been put twice
  const seen = new Set();
  for (const day of days) {
    if (seen.has(day)) {
      throw new AppError(
        httpStatus.UNPROCESSABLE_ENTITY,
        'Duplicate days are not allowed',
      );
    }
    seen.add(day);
  }

  //* Check if the faculty exists or not
  const getFacultyInfo = await Faculty.findById(faculty);

  if (!getFacultyInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }

  //* Construct faculty name
  const facultyName = !getFacultyInfo.name.middleName
    ? `${getFacultyInfo.name.firstName} ${getFacultyInfo.name.lastName}`
    : `${getFacultyInfo.name.firstName} ${getFacultyInfo.name.middleName} ${getFacultyInfo.name.lastName}`;

  //* Check if the faculty is assigned to the particular provided course or not
  const getCourseFaculties = await CourseFaculty.findOne({ course });

  if (!getCourseFaculties) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This course does not have any assigned faculties!',
    );
  }

  if (!getCourseFaculties.faculties.includes(faculty)) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Faculty ${facultyName} isn't assigned to course ${getCourseInfo.prefix}${getCourseInfo.code}`,
    );
  }

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

  const { faculty, maxCapacity, remainingCapacity, days, timeSlot } = payload;

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
  if (maxCapacity && remainingCapacity) {
    if (maxCapacity < remainingCapacity) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Remaining capacity cannot be greater than max capacity',
      );
    }
  } else if (
    (!maxCapacity && remainingCapacity) ||
    (maxCapacity && !remainingCapacity)
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please enter both max capacity and remaining capacity',
    );
  }

  if (timeSlot) {
    //* Validate time slot
    if (timeSlot < 1 || timeSlot > 7) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid time slot number. Valid time slot number range is from 1 to 7',
      );
    }

    //* Get start and end time from time slot
    const startEndTime = TimeSlots[timeSlot];
    const startTime = startEndTime[0];
    const endTime = startEndTime[1];

    //* Ensure that the start time comes before the end time
    const startTimeObj = new Date(`1970-01-01T${startTime}Z`);
    const endTimeObj = new Date(`1970-01-01T${endTime}Z`);

    if (startTimeObj.getTime() >= endTimeObj.getTime()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'End time cannot come before start time',
      );
    }

    //* Set start time and end time
    payload.startTime = startTime;
    payload.endTime = endTime;
  }

  if (days) {
    //* Ensure that same day hasn't been put twice
    const seen = new Set();
    for (const day of days) {
      if (seen.has(day)) {
        throw new AppError(
          httpStatus.UNPROCESSABLE_ENTITY,
          'Duplicate days are not allowed',
        );
      }
      seen.add(day);
    }
  }

  if (faculty) {
    //* Check if the faculty exists or not
    const getFacultyInfo = await Faculty.findById(faculty);

    if (!getFacultyInfo) {
      throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
    }

    //* Construct faculty name
    const facultyName = !getFacultyInfo.name.middleName
      ? `${getFacultyInfo.name.firstName} ${getFacultyInfo.name.lastName}`
      : `${getFacultyInfo.name.firstName} ${getFacultyInfo.name.middleName} ${getFacultyInfo.name.lastName}`;

    //* Check if the faculty is assigned to the particular provided course or not
    const getCourseFaculties = await CourseFaculty.findOne({
      course: doesOfferedCourseExist?.course,
    });

    if (!getCourseFaculties) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'This course does not have any assigned faculties!',
      );
    }

    if (!getCourseFaculties.faculties.includes(faculty)) {
      throw new AppError(
        httpStatus.CONFLICT,
        `Faculty ${facultyName} isn't assigned to course ${getCourseInfo?.prefix}${getCourseInfo?.code}`,
      );
    }
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, validatePayload, {
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
