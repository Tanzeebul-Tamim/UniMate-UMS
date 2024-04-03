import { z } from 'zod';
import { AcademicDepartmentNames } from './academicDepartment.constant';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicDepartmentNames] as [string, ...string[]]),
    academicFaculty: z.string({
      invalid_type_error: 'Academic faculty must be a string',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .enum([...AcademicDepartmentNames] as [string, ...string[]])
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
