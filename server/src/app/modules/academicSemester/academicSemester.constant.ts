import {
  TAcademicSemesterCode,
  TAcademicSemesterCodeMonthMapper,
  TAcademicSemesterName,
  TAcademicSemesterNameCodeMapper,
  TAcademicSemesterNameMonthMapper,
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

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Spring: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterNameMonthMapper: TAcademicSemesterNameMonthMapper =
  {
    Spring: ['January', 'April'],
    Summer: ['May', 'August'],
    Fall: ['September', 'December'],
  };

export const academicSemesterCodeMonthMapper: TAcademicSemesterCodeMonthMapper =
  {
    '01': ['January', 'April'],
    '02': ['May', 'August'],
    '03': ['September', 'December'],
  };
