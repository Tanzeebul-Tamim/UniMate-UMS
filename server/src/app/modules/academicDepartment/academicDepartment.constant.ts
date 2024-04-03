import { AcademicFacultyNames } from '../academicFaculty/academicFaculty.constant';
import {
  TAcademicDepartmentName,
  TAcademicDepartmentNameFacultyMapper,
} from './academicDepartment.interface';

export const AcademicDepartmentNames: TAcademicDepartmentName[] = [
  'Department of Computer Science & Engineering',
  'Department of Electrical Engineering',
  'Department of Mechanical Engineering',
  'Department of Civil Engineering',
  'Department of Biology',
  'Department of Chemistry',
  'Department of Physics',
  'Department of Mathematics',
  'Department of Business Administration',
  'Department of Economics',
  'Department of Finance',
  'Department of Accounting',
  'Department of Psychology',
  'Department of Sociology',
  'Department of Political Science',
  'Department of Anthropology',
  'Department of English Literature',
  'Department of History',
  'Department of Fine Arts',
  'Department of Linguistics',
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

export const AcademicDepartmentSearchableFields = ['name'];

export const AcademicDepartmentUpdatableFields = ['name'];
