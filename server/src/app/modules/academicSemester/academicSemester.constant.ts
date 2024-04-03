import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonth,
} from './academicSemester.interface';

export const AcademicSemesterNames: TAcademicSemesterName[] = [
  'Spring',
  'Summer',
  'Fall',
];

export const AcademicSemesterCodes: TAcademicSemesterCode[] = [
  '01',
  '02',
  '03',
];

export const AcademicSemesterMonths: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterSearchableFields = ['name', 'year'];

export const AcademicSemesterUpdatableFields: string[] = ['name', 'year'];
