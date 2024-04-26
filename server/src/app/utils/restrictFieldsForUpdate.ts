import {
  TOfferedCourse,
  TUpdateOfferedCourse,
} from './../modules/offeredCourse/offeredCourse.interface';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUpdateStudent } from '../modules/student/student.interface';
import { TUpdateFaculty } from '../modules/faculty/faculty.interface';
import { TUpdateAdmin } from '../modules/admin/admin.interface';
import { TUpdateSemesterRegistrationDB } from '../modules/semesterRegistration/semesterRegistration.interface';
import { TUpdateAcademicSemester } from '../modules/academicSemester/academicSemester.interface';
import { TUpdateAcademicDepartment } from '../modules/academicDepartment/academicDepartment.interface';
import { TAcademicFaculty } from '../modules/academicFaculty/academicFaculty.interface';
import { TManagementDepartment } from '../modules/managementDepartment/managementDepartment.interface';

export const restrictFieldsValidator = (
  payload:
    | TUpdateStudent
    | TUpdateFaculty
    | TUpdateAdmin
    | TUpdateSemesterRegistrationDB
    | TUpdateAcademicSemester
    | TUpdateAcademicDepartment
    | TAcademicFaculty
    | TManagementDepartment
    | Partial<TOfferedCourse>
    | TUpdateOfferedCourse,
  allowedFields: string[],
) => {
  const payloadFields: string[] = Object.keys(payload);

  if (payloadFields.length <= allowedFields.length) {
    payloadFields.map((property) => {
      if (!allowedFields.includes(property)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `Invalid field '${property}'. ${allowedFields.length > 1 ? 'Expected fields are' : 'Expected field is'} ${[...allowedFields]}`,
        );
      }
    });
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Expected ${allowedFields.length} ${allowedFields.length > 1 ? 'fields' : 'field'} (${[...allowedFields]}), received ${payloadFields.length} ${payloadFields.length > 1 ? 'fields' : 'field'} (${payloadFields}).`,
    );
  }
};
