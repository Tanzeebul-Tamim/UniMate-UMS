import {
  TAcademicSemesterCode,
  TAcademicSemesterCodeMonthMapper,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TAcademicSemesterNameMonthMapper,
  TMonths,
} from './academicSemester.interface';

export const AcademicSemesterNames: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const AcademicSemesterCodes: TAcademicSemesterCode[] = [
  '01',
  '02',
  '03',
];

export const AcademicSemesterMonths: TMonths[] = [
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

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterNameMonthMapper: TAcademicSemesterNameMonthMapper =
  {
    Autumn: ['January', 'April'],
    Summer: ['May', 'August'],
    Fall: ['September', 'December'],
  };

export const academicSemesterCodeMonthMapper: TAcademicSemesterCodeMonthMapper =
  {
    '01': ['January', 'April'],
    '02': ['May', 'August'],
    '03': ['September', 'December'],
  };
