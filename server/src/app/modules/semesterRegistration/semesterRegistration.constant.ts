import { TSemesterRegistrationStatus } from './semesterRegistration.interface';

export const SemesterRegistrationStatuses: TSemesterRegistrationStatus[] = [
  'upcoming',
  'ongoing',
  'ended',
];

export const RegistrationStatuses = {
  UPCOMING: SemesterRegistrationStatuses[0],
  ONGOING: SemesterRegistrationStatuses[1],
  ENDED: SemesterRegistrationStatuses[2],
} as const;

export const SemesterRegistrationUpdatableFields: string[] = [
  'startDay',
  'endDay',
  'startTime',
  'endTime',
  'minCredit',
  'maxCredit',
];

export const MonthNumber = {
  January: '01',
  February: '02',
  March: '03',
  April: '04',
  May: '05',
  June: '06',
  July: '07',
  August: '08',
  September: '09',
  October: '10',
  November: '11',
  December: '12',
};
