import { z } from 'zod';
import { AcademicFacultyNames } from './academicFaculty.constant';

const createUpdateAcademicFacultyValidationSchema = z.object({
  body: z.object({
    name: z.enum([...AcademicFacultyNames] as [string, ...string[]]),
  }),
});

export const AcademicFacultyValidations = {
  createUpdateAcademicFacultyValidationSchema,
};
