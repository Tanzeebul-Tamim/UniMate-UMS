import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TAcademicSemester,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TAcademicSemesterNameMonthMapper,
  TUpdateAcademicSemester,
} from './academicSemester.interface';

//* Mappers
const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Spring: '01',
  Summer: '02',
  Fall: '03',
};

const academicSemesterNameMonthMapper: TAcademicSemesterNameMonthMapper = {
  Spring: ['January', 'April'],
  Summer: ['May', 'August'],
  Fall: ['September', 'December'],
};

//! For creating a semester
//* name-code validation
export const createNameCodeValidator = (payload: TAcademicSemester) => {
  const semesterCode = academicSemesterNameCodeMapper[payload.name];
  if (semesterCode !== payload.code) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid Semester Code! Semester code for '${payload.name}' is '${semesterCode}'`,
    );
  }
};

//* name-month validation
export const createNameMonthValidator = (payload: TAcademicSemester) => {
  const startEndMonth = academicSemesterNameMonthMapper[payload.name];
  const startMonth = startEndMonth[0];
  const endMonth = startEndMonth[1];
  if (startMonth !== payload.startMonth || endMonth !== payload.endMonth) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid start/end month. Valid start-end month for ${payload.name} semester is ${startMonth}-${endMonth}`,
    );
  }
};

//! For updating a semester
//* return valid semester-code, startMonth and endMonth according to the semester-name
const alignNameToCodeMonthValidator = (payload: TAcademicSemesterName) => {
  const code = academicSemesterNameCodeMapper[payload];
  const startEndMonth = academicSemesterNameMonthMapper[payload];

  return {
    code,
    startMonth: startEndMonth[0],
    endMonth: startEndMonth[1],
  };
};

//* update semester with valid info
export const updateAcademicSemesterWithValidInfo = (
  payload: Partial<TUpdateAcademicSemester>,
  semesterInfo: TAcademicSemester,
) => {
  const { name, year, code, startMonth, endMonth } = semesterInfo;
  const updatedSemester: Partial<TAcademicSemester> = {};
  const validInfo = payload.name && alignNameToCodeMonthValidator(payload.name);

  if (validInfo && payload.name && !payload.year) {
    updatedSemester.name = payload.name;
    updatedSemester.year = year;
    updatedSemester.code = validInfo.code;
    updatedSemester.startMonth = validInfo.startMonth;
    updatedSemester.endMonth = validInfo.endMonth;
  } else if (!payload.name && payload.year) {
    updatedSemester.name = name;
    updatedSemester.year = payload.year;
    updatedSemester.code = code;
    updatedSemester.startMonth = startMonth;
    updatedSemester.endMonth = endMonth;
  } else if (validInfo && payload.name && payload.year) {
    updatedSemester.name = payload.name;
    updatedSemester.year = payload.year;
    updatedSemester.code = validInfo.code;
    updatedSemester.startMonth = validInfo.startMonth;
    updatedSemester.endMonth = validInfo.endMonth;
  }

  return updatedSemester;
};
