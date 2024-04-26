import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z.object({
    semesterRegistration: z.string(),
    academicDepartment: z.string(),
    course: z.string(),
    faculty: z.string(),
    maxCapacity: z.number().optional(),
    remainingCapacity: z.number().optional(),
    section: z.number(),
    days: z.array(z.enum([...Days] as [string, ...string[]])),
    timeSlot: z.number(),
  }),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().optional(),
    remainingCapacity: z.number().optional(),
    days: z.array(z.string()).optional(),
    timeSlot: z.number().optional(),
  }),
});

export const OfferedCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
