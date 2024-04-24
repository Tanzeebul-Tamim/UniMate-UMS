import { z } from 'zod';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string({
      invalid_type_error: 'Academic semester must be a string',
    }),
    startDay: z.number().optional(),
    endDay: z.number().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

const updateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    startDay: z.number().optional(),
    endDay: z.number().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
