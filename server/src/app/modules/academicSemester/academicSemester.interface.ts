export type TMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

export type TAcademicSemesterName = 'Autumn' | 'Summer' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: string;
  startMonth: TMonths;
  endMonth: TMonths;
};

export type TAcademicSemesterNameCodeMapper = {
  // eslint-disable-next-line no-unused-vars
  [key in TAcademicSemesterName]: TAcademicSemesterCode;
};

export type TAcademicSemesterNameMonthMapper = {
  Autumn: ['January', 'April'];
  Summer: ['May', 'August'];
  Fall: ['September', 'December'];
};

export type TAcademicSemesterCodeMonthMapper = {
  '01': ['January', 'April'];
  '02': ['May', 'August'];
  '03': ['September', 'December'];
};
