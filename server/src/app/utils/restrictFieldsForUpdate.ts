import { TUpdateAcademicDepartment } from '../modules/academicDepartment/academicDepartment.interface';
import { TAcademicFaculty } from '../modules/academicFaculty/academicFaculty.interface';
import { TUpdateAcademicSemester } from '../modules/academicSemester/academicSemester.interface';
import { TUpdateAdmin } from '../modules/admin/admin.interface';
import { TUpdateFaculty } from '../modules/faculty/faculty.interface';
import { TUpdateStudent } from '../modules/student/student.interface';

//* making sure that the payload contains either 'year' or 'name' only
export const restrictFieldsValidator = (
  payload: Partial<
    | TAcademicFaculty
    | TUpdateAcademicDepartment
    | TUpdateAcademicSemester
    | TUpdateStudent
    | TUpdateFaculty
    | TUpdateAdmin
  >,
  allowedFields: string[],
) => {
  const payloadFields: string[] = Object.keys(payload);

  if (payloadFields.length <= allowedFields.length) {
    payloadFields.map((property) => {
      if (!allowedFields.includes(property)) {
        throw new Error(
          `Invalid field '${property}'. ${allowedFields.length > 1 ? 'Expected fields are' : 'Expected field is'} ${[...allowedFields]}`,
        );
      }
    });
  } else {
    throw new Error(
      `Expected ${allowedFields.length} ${allowedFields.length > 1 ? 'fields' : 'field'} (${[...allowedFields]}), received ${payloadFields.length} ${payloadFields.length > 1 ? 'fields' : 'field'} (${payloadFields}).`,
    );
  }
};
