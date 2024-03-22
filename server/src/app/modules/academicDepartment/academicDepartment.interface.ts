import { Types } from 'mongoose';

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
