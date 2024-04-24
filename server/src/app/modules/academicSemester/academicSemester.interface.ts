export type TMonth =
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

export type TAcademicSemesterName = 'Spring' | 'Summer' | 'Fall';
export type TAcademicSemesterCode = '01' | '02' | '03';

export type TAcademicSemester = {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: string;
  startMonth: TMonth;
  endMonth: TMonth;
};

export type TUpdateAcademicSemester = Partial<
  Pick<TAcademicSemester, 'name' | 'year'>
>;

export type TAcademicSemesterNameCodeMapper = {
  // eslint-disable-next-line no-unused-vars
  [key in TAcademicSemesterName]: TAcademicSemesterCode;
};

export type TAcademicSemesterNameMonthMapper = {
  Spring: ['January', 'April'];
  Summer: ['May', 'August'];
  Fall: ['September', 'December'];
};
