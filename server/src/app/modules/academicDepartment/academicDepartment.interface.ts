import { Types } from 'mongoose';
import { TAcademicFacultyName } from '../academicFaculty/academicFaculty.interface';

export type TAcademicDepartmentName =
  | 'Computer Science & Engineering'
  | 'Electrical Engineering'
  | 'Mechanical Engineering'
  | 'Civil Engineering'
  | 'Biology'
  | 'Chemistry'
  | 'Physics'
  | 'Mathematics'
  | 'Business Administration'
  | 'Economics'
  | 'Finance'
  | 'Accounting'
  | 'Psychology'
  | 'Sociology'
  | 'Political Science'
  | 'Anthropology'
  | 'English Literature'
  | 'History'
  | 'Fine Arts'
  | 'Linguistics';

export type TAcademicDepartment = {
  name: TAcademicDepartmentName;
  academicFaculty: Types.ObjectId;
};

export type TAcademicDepartmentNameFacultyMapper = {
  // eslint-disable-next-line no-unused-vars
  [key in TAcademicFacultyName]: TAcademicDepartmentName[];
};

export type TAlignmentValidationPayload = {
  facultyName: TAcademicFacultyName;
  departmentName: TAcademicDepartmentName;
};
