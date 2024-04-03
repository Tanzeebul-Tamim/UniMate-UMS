import { z } from 'zod';
import { ManagementDepartmentNames } from './managementDepartment.constant';

const createUpdateManagementDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.enum([...ManagementDepartmentNames] as [string, ...string[]]),
  }),
});

export const ManagementDepartmentValidations = {
  createUpdateManagementDepartmentValidationSchema,
};
