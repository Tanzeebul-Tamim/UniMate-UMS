import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TSemesterRegistrationClient,
  TSemesterRegistrationDB,
  TUpdateSemesterRegistrationClient,
  TUpdateSemesterRegistrationDB,
} from './semesterRegistration.interface';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import {
  MonthNumber,
  RegistrationStatuses,
} from './semesterRegistration.constant';

//! For creating a semester-registration
export const validateAndModifyPayloadForCreatingSemesterRegistration = (
  payload: TSemesterRegistrationClient,
  academicSemester: TAcademicSemester,
): TSemesterRegistrationDB | never => {
  const startMonthNumber = MonthNumber[academicSemester.startMonth];
  const endMonthNumber = MonthNumber[academicSemester.endMonth];
  const year = academicSemester.year;

  let {
    // eslint-disable-next-line prefer-const
    academicSemester: semesterId,
    startDay,
    endDay,
    startTime,
    endTime,
    minCredit,
    maxCredit,
  } = payload;

  //* Validate start-end day and set a default value
  if (startDay && endDay) {
    if (!(1 <= startDay && startDay <= 31)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start day. Please enter a valid start day.',
      );
    }

    if (!(1 <= endDay && endDay <= 31)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end day. Please enter a valid end day.',
      );
    }
  } else if ((!startDay && endDay) || (startDay && !endDay)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please enter both start and end day',
    );
  } else {
    startDay = 1;
    endDay = 30;
  }

  //* Validate start-end time and set a default value
  if (startTime && endTime) {
    if (startTime.length !== 8) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    if (endTime.length !== 8) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    if (startTime[2] !== ':' || startTime[5] !== ':') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    if (endTime[2] !== ':' || endTime[5] !== ':') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    const [startHour, startMinute, startSecond] = startTime.split(':');
    const [endHour, endMinute, endSecond] = endTime.split(':');

    //* Check if each part is a two-digit string and can be converted to integers
    if (
      !/^\d{2}$/.test(startHour) ||
      !/^\d{2}$/.test(startMinute) ||
      !/^\d{2}$/.test(startSecond)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    if (
      !/^\d{2}$/.test(endHour) ||
      !/^\d{2}$/.test(endMinute) ||
      !/^\d{2}$/.test(endSecond)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    //* Check if the values are within valid ranges (00 to 23 for hours, 00 to 59 for minutes and seconds)
    if (
      parseInt(startHour, 10) < 0 ||
      parseInt(startHour, 10) > 23 ||
      parseInt(startMinute, 10) < 0 ||
      parseInt(startMinute, 10) > 59 ||
      parseInt(startSecond, 10) < 0 ||
      parseInt(startSecond, 10) > 59
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'The entered start time has an invalid time range.',
      );
    }

    if (
      parseInt(endHour, 10) < 0 ||
      parseInt(endHour, 10) > 23 ||
      parseInt(endMinute, 10) < 0 ||
      parseInt(endMinute, 10) > 59 ||
      parseInt(endSecond, 10) < 0 ||
      parseInt(endSecond, 10) > 59
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'The entered end time has an invalid time range.',
      );
    }
  } else if (startTime === '' || endTime === '') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Start time and end time cannot be empty strings',
    );
  } else {
    if ((!startTime && endTime) || (startTime && !endTime)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Please enter both start and end time',
      );
    } else {
      startTime = '08:30:00';
      endTime = '21:00:00';
    }
  }

  //* Validate min-max credit and set a default value
  if (minCredit && maxCredit) {
    if (minCredit % 3 !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid min credit. Min credit must be divisible by 3.',
      );
    }

    if (maxCredit % 3 !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid max credit. Max credit must be divisible by 3.',
      );
    }

    if (minCredit > maxCredit) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Min credit must be less than max credit',
      );
    }
  } else if ((!minCredit && maxCredit) || (minCredit && !maxCredit)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please enter both min and max credit',
    );
  } else {
    minCredit = 3;
    maxCredit = 15;
  }

  //* Construct start and end date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) using string concatenation
  const startDate =
    `${year.toString()}-${startMonthNumber.toString()}-${startDay.toString().padStart(2, '0')}T${startTime}Z` as unknown as Date;
  const endDate =
    `${year.toString()}-${endMonthNumber.toString()}-${endDay.toString().padStart(2, '0')}T${endTime}Z` as unknown as Date;

  const modifiedSemesterRegistration: TSemesterRegistrationDB = {
    academicSemester: semesterId,
    status: RegistrationStatuses.UPCOMING,
    startDate,
    endDate,
    minCredit,
    maxCredit,
  };

  //* Ensure that the start date comes before the end date
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  if (startDateObj.getTime() >= endDateObj.getTime()) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'End date cannot come before start date',
    );
  }

  //* Get semester status based on current date
  const today = new Date();

  if (
    startDateObj.getTime() > today.getTime() &&
    endDateObj.getTime() > today.getTime()
  ) {
    modifiedSemesterRegistration.status = RegistrationStatuses.UPCOMING;
  } else if (
    startDateObj.getTime() < today.getTime() &&
    endDateObj.getTime() > today.getTime()
  ) {
    modifiedSemesterRegistration.status = RegistrationStatuses.ONGOING;
  } else if (
    startDateObj.getTime() < today.getTime() &&
    endDateObj.getTime() < today.getTime()
  ) {
    modifiedSemesterRegistration.status = RegistrationStatuses.ENDED;
  }

  return modifiedSemesterRegistration;
};

//! For updating a semester-registration
export const validateAndModifyPayloadForUpdatingSemesterRegistration = (
  payload: TUpdateSemesterRegistrationClient,
  currentSemesterRegistrationInfo: TSemesterRegistrationDB,
): TUpdateSemesterRegistrationDB | never => {
  const year = currentSemesterRegistrationInfo.startDate
    .getUTCFullYear()
    .toString();

  const startMonthNumber = (
    currentSemesterRegistrationInfo.startDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, '0');
  const endMonthNumber = (
    currentSemesterRegistrationInfo.endDate.getUTCMonth() + 1
  )
    .toString()
    .padStart(2, '0');

  const currentStartDay = currentSemesterRegistrationInfo.startDate
    .getUTCDate()
    .toString()
    .padStart(2, '0');
  const currentEndDay = currentSemesterRegistrationInfo.endDate
    .getUTCDate()
    .toString()
    .padStart(2, '0');

  const currentStartHours = currentSemesterRegistrationInfo.startDate
    .getUTCHours()
    .toString()
    .padStart(2, '0');
  const currentStartMinutes = currentSemesterRegistrationInfo.startDate
    .getUTCMinutes()
    .toString()
    .padStart(2, '0');
  const currentStartSeconds = currentSemesterRegistrationInfo.startDate
    .getUTCSeconds()
    .toString()
    .padStart(2, '0');

  const currentEndHours = currentSemesterRegistrationInfo.endDate
    .getUTCHours()
    .toString()
    .padStart(2, '0');
  const currentEndMinutes = currentSemesterRegistrationInfo.endDate
    .getUTCMinutes()
    .toString()
    .padStart(2, '0');
  const currentEndSeconds = currentSemesterRegistrationInfo.endDate
    .getUTCSeconds()
    .toString()
    .padStart(2, '0');

  const currentStartTime = `${currentStartHours}:${currentStartMinutes}:${currentStartSeconds}`;
  const currentEndTime = `${currentEndHours}:${currentEndMinutes}:${currentEndSeconds}`;

  const currentMinCredit = currentSemesterRegistrationInfo.minCredit;
  const currentMaxCredit = currentSemesterRegistrationInfo.maxCredit;

  // eslint-disable-next-line prefer-const
  let { startDay, endDay, startTime, endTime, minCredit, maxCredit } = payload;

  //* Validate start day
  if (startDay) {
    if (!(1 <= startDay && startDay <= 31)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start day. Please enter a valid start day.',
      );
    }
  } else {
    startDay = parseInt(currentStartDay);
  }

  //* Validate end day
  if (endDay) {
    if (!(1 <= endDay && endDay <= 31)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end day. Please enter a valid end day.',
      );
    }
  } else {
    endDay = parseInt(currentEndDay);
  }

  //* Validate start time
  if (startTime) {
    if (startTime.length !== 8) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    if (startTime[2] !== ':' || startTime[5] !== ':') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    const [startHour, startMinute, startSecond] = startTime.split(':');

    //* Check if each part is a two-digit string and can be converted to integers
    if (
      !/^\d{2}$/.test(startHour) ||
      !/^\d{2}$/.test(startMinute) ||
      !/^\d{2}$/.test(startSecond)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid start time format. Valid time format is hh:mm:ss',
      );
    }

    //* Check if the values are within valid ranges (00 to 23 for hours, 00 to 59 for minutes and seconds)
    if (
      parseInt(startHour, 10) < 0 ||
      parseInt(startHour, 10) > 23 ||
      parseInt(startMinute, 10) < 0 ||
      parseInt(startMinute, 10) > 59 ||
      parseInt(startSecond, 10) < 0 ||
      parseInt(startSecond, 10) > 59
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'The entered start time has an invalid time range.',
      );
    }
  } else {
    startTime = currentStartTime;
  }

  //* Validate end time
  if (endTime) {
    if (endTime.length !== 8) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    if (endTime[2] !== ':' || endTime[5] !== ':') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    const [endHour, endMinute, endSecond] = endTime.split(':');

    //* Check if each part is a two-digit string and can be converted to integers
    if (
      !/^\d{2}$/.test(endHour) ||
      !/^\d{2}$/.test(endMinute) ||
      !/^\d{2}$/.test(endSecond)
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid end time format. Valid time format is hh:mm:ss',
      );
    }

    //* Check if the values are within valid ranges (00 to 23 for hours, 00 to 59 for minutes and seconds)
    if (
      parseInt(endHour, 10) < 0 ||
      parseInt(endHour, 10) > 23 ||
      parseInt(endMinute, 10) < 0 ||
      parseInt(endMinute, 10) > 59 ||
      parseInt(endSecond, 10) < 0 ||
      parseInt(endSecond, 10) > 59
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'The entered end time has an invalid time range.',
      );
    }
  } else {
    endTime = currentEndTime;
  }

  //* Validate min credit
  if (minCredit && maxCredit) {
    if (minCredit % 3 !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid min credit. Min credit must be divisible by 3.',
      );
    }

    if (maxCredit % 3 !== 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Invalid max credit. Max credit must be divisible by 3.',
      );
    }

    if (minCredit > maxCredit) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Min credit must be less than max credit',
      );
    }
  } else if ((!minCredit && maxCredit) || (minCredit && !maxCredit)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please enter both min and max credit',
    );
  } else {
    minCredit = currentMinCredit;
    maxCredit = currentMaxCredit;
  }

  //* Construct start and end date in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ) using string concatenation
  const startDate =
    `${year.toString()}-${startMonthNumber.toString()}-${startDay.toString().padStart(2, '0')}T${startTime}Z` as unknown as Date;
  const endDate =
    `${year.toString()}-${endMonthNumber.toString()}-${endDay.toString().padStart(2, '0')}T${endTime}Z` as unknown as Date;

  const modifiedSemesterRegistration: TUpdateSemesterRegistrationDB = {
    startDate,
    endDate,
    minCredit,
    maxCredit,
  };

  return modifiedSemesterRegistration;
};
