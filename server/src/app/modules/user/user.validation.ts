import { z } from 'zod';

const userValidationSchema = z.object({
  password: z
    .string({ invalid_type_error: 'Password must be a string' })
    .max(20, { message: 'Password cannot be longer than 20 characters' })
    .min(6, { message: 'Password must be at least 6 characters long' })
});

export const UserValidations = {
  userValidationSchema,
};
