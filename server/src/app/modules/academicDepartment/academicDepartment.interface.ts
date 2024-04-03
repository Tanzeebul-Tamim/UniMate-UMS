import { Types } from 'mongoose';
import { TAcademicFacultyName } from '../academicFaculty/academicFaculty.interface';

export type TAcademicDepartmentName =
  | 'Department of Computer Science & Engineering'
  | 'Department of Electrical Engineering'
  | 'Department of Mechanical Engineering'
  | 'Department of Civil Engineering'
  | 'Department of Biology'
  | 'Department of Chemistry'
  | 'Department of Physics'
  | 'Department of Mathematics'
  | 'Department of Business Administration'
  | 'Department of Economics'
  | 'Department of Finance'
  | 'Department of Accounting'
  | 'Department of Psychology'
  | 'Department of Sociology'
  | 'Department of Political Science'
  | 'Department of Anthropology'
  | 'Department of English Literature'
  | 'Department of History'
  | 'Department of Fine Arts'
  | 'Department of Linguistics';

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
