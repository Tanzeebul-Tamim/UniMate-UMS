import sampleStudent from '../../../../sample/student.json';
import { generateSearchableFields } from '../../utils/generateSearchableFields';

const studentFields = generateSearchableFields(sampleStudent);
const fieldsToRemove = [
  'dateOfBirth',
  'profileImage',
  'admissionSemester',
  'academicDepartment',
];
export const StudentSearchableFields = studentFields.filter(
  (field) => !fieldsToRemove.includes(field),
);
