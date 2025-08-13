import { TDay } from './offeredCourse.interface';

export const Days: TDay[] = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

export const OfferedCoursePermittedFields: string[] = [
  'semesterRegistration',
  'academicDepartment',
  'course',
  'faculty',
  'maxCapacity',
  'remainingCapacity',
  'section',
  'days',
  'timeSlot',
];

export const OfferedCourseUpdatableFields: string[] = [
  'faculty',
  'maxCapacity',
  'remainingCapacity',
  'days',
  'timeSlot',
];

export const TimeSlots: Record<number, string[]> = {
  1: ['08:00:00', '09:20:00'],
  2: ['09:30:00', '10:50:00'],
  3: ['11:00:00', '12:20:00'],
  4: ['12:30:00', '13:50:00'],
  5: ['14:00:00', '15:20:00'],
  6: ['15:30:00', '16:50:00'],
  7: ['17:00:00', '18:20:00'],
};
