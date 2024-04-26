import { Types } from 'mongoose';

export type TSemesterRegistrationStatus = 'upcoming' | 'ongoing' | 'ended';

//! Actual data model
export type TSemesterRegistrationDB = {
  academicSemester: Types.ObjectId;
  status: TSemesterRegistrationStatus;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};

export type TUpdateSemesterRegistrationDB = Partial<
  Omit<TSemesterRegistrationDB, 'academicSemester'>
>;

//! Client data model
export type TSemesterRegistrationClient = {
  academicSemester: Types.ObjectId;
  startDay: number;
  endDay: number;
  startTime: string;
  endTime: string;
  minCredit: number;
  maxCredit: number;
};

export type TUpdateSemesterRegistrationClient = Partial<
  Omit<TSemesterRegistrationClient, 'academicSemester'>
>;
