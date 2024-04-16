import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { academicDepartmentNameFacultyMapper } from './academicDepartment.constant';
import { TAlignmentValidationPayload } from './academicDepartment.interface';

//! For creating a department
//* department-faculty validation
export const createDepartmentFacultyValidation = (
  payload: TAlignmentValidationPayload,
) => {
  const correspondingDepartments =
    academicDepartmentNameFacultyMapper[payload.facultyName];
  if (correspondingDepartments?.includes(payload.departmentName)) {
    return true;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Invalid faculty name '${payload.facultyName}'`,
    );
  }
};
