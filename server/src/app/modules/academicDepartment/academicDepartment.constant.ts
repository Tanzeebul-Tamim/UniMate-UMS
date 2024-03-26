import { AcademicFacultyNames } from '../academicFaculty/academicFaculty.constant';
import {
  TAcademicDepartmentName,
  TAcademicDepartmentNameFacultyMapper,
} from './academicDepartment.interface';

export const AcademicDepartmentNames: TAcademicDepartmentName[] = [
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biology',
  'Chemistry',
  'Physics',
  'Mathematics',
  'Business Administration',
  'Economics',
  'Finance',
  'Accounting',
  'Psychology',
  'Sociology',
  'Political Science',
  'Anthropology',
  'English Literature',
  'History',
  'Fine Arts',
  'Linguistics',
];

let startIndex = 0;
let endIndex = 4;
let correspondingDepartments: TAcademicDepartmentName[] = [];
export const academicDepartmentNameFacultyMapper: Partial<TAcademicDepartmentNameFacultyMapper> =
  {};
for (let i = 0; i < AcademicFacultyNames.length; i++) {
  const facultyName = AcademicFacultyNames[i];
  for (let j = startIndex; j < endIndex; j++) {
    const departmentName = AcademicDepartmentNames[j];
    correspondingDepartments.push(departmentName);
  }
  academicDepartmentNameFacultyMapper[facultyName] = correspondingDepartments;
  correspondingDepartments = [];
  startIndex += 4;
  endIndex += 4;
}