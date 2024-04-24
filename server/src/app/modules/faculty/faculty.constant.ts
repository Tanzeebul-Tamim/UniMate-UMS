import sampleFaculty from '../../../../sample/faculty.json';
import { generateSearchableFields } from '../../utils/generateSearchableFields';
import { TDesignation } from './faculty.interface';

export const FacultyDesignations: TDesignation[] = [
  'professor',
  'associate professor',
  'assistant professor',
  'lecturer',
  'research professor',
  'adjunct professor',
  'visiting professor',
  'dean',
  'department chair',
  'instructor',
  'research associate',
  'postdoctoral researcher',
  'graduate assistant',
  'teaching assistant',
  'lab manager',
];

const fields = generateSearchableFields(sampleFaculty);
const fieldsToRemove = [
  'dateOfBirth',
  'profileImage',
  'academicDepartment',
  'joiningDate',
];
export const FacultySearchableFields = fields.filter(
  (field) => !fieldsToRemove.includes(field),
);

export const FacultyUpdatableFields: string[] = [
  'name',
  'contactNo',
  'emergencyContactNo',
  'presentAddress',
  'permanentAddress',
  'profileImage',
];
