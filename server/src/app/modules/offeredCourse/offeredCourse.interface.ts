import { Types } from 'mongoose';

export type Day =
  | 'Saturday'
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday';

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  remainingCapacity: number;
  section: number;
  days: Day[];
  startTime: string;
  endTime: string;
};

type TExcludeFields =
  | 'semesterRegistration'
  | 'academicSemester'
  | 'academicFaculty'
  | 'academicDepartment'
  | 'course'
  | 'section';

export type TUpdateOfferedCourse = Partial<
  Omit<TOfferedCourse, TExcludeFields>
>;
