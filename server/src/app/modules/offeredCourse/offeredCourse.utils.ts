import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TimeSlots } from './offeredCourse.constant';
import { TDay } from './offeredCourse.interface';
import { CourseFaculty } from '../course/course.model';
import { TFaculty } from '../faculty/faculty.interface';
import { TCourse } from '../course/course.interface';
import { Types } from 'mongoose';

//! Validate time slot
interface TValidateTimeSlotReturn {
  startTime: string;
  endTime: string;
}

export const validateTimeSlot = (timeSlot: number): TValidateTimeSlotReturn => {
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

  return { startTime, endTime };
};

//! Validate Days
export const validateDays = (days: TDay[]): void => {
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
};

//! Validate student capacity
export const validateCapacity = (
  maxCapacity: number | undefined,
  remainingCapacity: number | undefined,
): void => {
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
};

//! Validate if the faculty is assigned to the particular course or not
export const validateCourseFaculty = async (
  getFacultyInfo: TFaculty,
  getCourseInfo: TCourse,
  faculty: Types.ObjectId,
  course: Types.ObjectId,
) => {
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
};
