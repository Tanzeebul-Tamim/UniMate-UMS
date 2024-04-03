import { z } from 'zod';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';
import { currentYear } from '../../constant/common';

const createAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicSemesterNames] as [string, ...string[]]),
    year: z
      .string()
      .length(4, { message: 'Year must contain 4 digits' })
      .refine(
        (year) =>
          parseInt(year, 10) >= 2000 && parseInt(year, 10) <= currentYear,
        {
          message: `Year must be between 2000 and the current year (${currentYear})`,
          path: ['body', 'year'],
        },
      ),
    code: z.enum([...AcademicSemesterCodes] as [string, ...string[]]),
    startMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
    endMonth: z.enum([...AcademicSemesterMonths] as [string, ...string[]]),
  }),
});

const updateAcademicSemesterValidationSchema = z.object({
  body: z.object({
    name: z
      .enum([...AcademicSemesterNames] as [string, ...string[]])
      .optional(),
    year: z
      .string()
      .length(4, { message: 'Year must contain 4 digits' })
      .refine(
        (year) =>
          parseInt(year, 10) >= 2000 && parseInt(year, 10) <= currentYear,
        {
          message: `Year must be between 2000 and the current year (${currentYear})`,
          path: ['body', 'year'],
        },
      )
      .optional(),
  }),
});

export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterValidationSchema,
};
