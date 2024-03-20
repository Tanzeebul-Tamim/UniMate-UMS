import {
  academicSemesterCodeMonthMapper,
  academicSemesterNameCodeMapper,
  academicSemesterNameMonthMapper,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';

//! For creating a semester
//* name-code validation
export const createNameCodeValidation = (payload: TAcademicSemester) => {
  const semesterCode = academicSemesterNameCodeMapper[payload.name];
  if (semesterCode !== payload.code) {
    throw new Error(
      `Invalid Semester Code! Semester code for '${payload.name}' is '${semesterCode}'`,
    );
  }
};

//* name-month validation
export const createNameMonthValidation = (payload: TAcademicSemester) => {
  const startEndMonth = academicSemesterNameMonthMapper[payload.name];
  const startMonth = startEndMonth[0];
  const endMonth = startEndMonth[1];
  if (startMonth !== payload.startMonth || endMonth !== payload.endMonth) {
    throw new Error(
      `Invalid start/end month. Valid start-end month for ${payload.name} semester is ${startMonth}-${endMonth}`,
    );
  }
};

//! For updating a semester
//* name-code validation
export const updateNameCodeValidation = (
  payload: Partial<TAcademicSemester>,
) => {
  if (payload.name && payload.code) {
    const semesterCode = academicSemesterNameCodeMapper[payload.name];
    if (semesterCode !== payload.code) {
      throw new Error(
        `Invalid Semester Code! Semester code for '${payload.name}' is '${semesterCode}'`,
      );
    }
  }
};

//* name-month validation
export const updateNameMonthValidation = (
  payload: Partial<TAcademicSemester>,
) => {
  if (payload.name && (payload.startMonth || payload.endMonth)) {
    const startEndMonth = academicSemesterNameMonthMapper[payload.name];
    const startMonth = startEndMonth[0];
    const endMonth = startEndMonth[1];
    if (
      payload.startMonth &&
      !payload.endMonth &&
      startMonth !== payload.startMonth
    ) {
      throw new Error(
        `Invalid start month. Valid start month for ${payload.name} semester is ${startMonth}`,
      );
    } else if (
      !payload.startMonth &&
      payload.endMonth &&
      endMonth !== payload.endMonth
    ) {
      throw new Error(
        `Invalid end month. Valid end month for ${payload.name} semester is ${endMonth}`,
      );
    } else if (
      payload.startMonth &&
      payload.endMonth &&
      (endMonth !== payload.endMonth || startMonth !== payload.startMonth)
    ) {
      throw new Error(
        `Invalid start/end month. Valid start-end month for ${payload.name} semester is ${startMonth}-${endMonth}`,
      );
    }
  }
};

//* code-month validation
export const updateCodeMonthValidation = (
  payload: Partial<TAcademicSemester>,
) => {
  if (payload.code && (payload.startMonth || payload.endMonth)) {
    const startEndMonth = academicSemesterCodeMonthMapper[payload.code];
    const startMonth = startEndMonth[0];
    const endMonth = startEndMonth[1];
    if (
      payload.startMonth &&
      !payload.endMonth &&
      startMonth !== payload.startMonth
    ) {
      throw new Error(
        `Invalid start month. Valid start month for semester code ${payload.code} is ${startMonth}`,
      );
    } else if (
      !payload.startMonth &&
      payload.endMonth &&
      endMonth !== payload.endMonth
    ) {
      throw new Error(
        `Invalid end month. Valid end month for semester code ${payload.code} is ${endMonth}`,
      );
    } else if (
      payload.startMonth &&
      payload.endMonth &&
      (endMonth !== payload.endMonth || startMonth !== payload.startMonth)
    ) {
      throw new Error(
        `Invalid start/end month. Valid start-end month for semester code ${payload.code} is ${startMonth}-${endMonth}`,
      );
    }
  }
};
