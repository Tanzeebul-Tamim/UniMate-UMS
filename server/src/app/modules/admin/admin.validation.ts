import { z } from 'zod';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
  createNameValidationSchema,
  currentYear,
  updateNameValidationSchema,
} from '../../constant/common';
import { Designations } from './admin.constant';

//! For creating admin

//* Define the schema for the TAdmin type
export const createAdminValidationSchema = z.object({
  body: z.object({
    password: z
      .string()
      .max(20)
      .min(6)
      .refine((value) => /[a-z]/.test(value), {
        message: 'Password must contain at least one lowercase letter',
      })
      .refine((value) => /[A-Z]/.test(value), {
        message: 'Password must contain at least one uppercase letter',
      })
      .refine((value) => /\d/.test(value), {
        message: 'Password must contain at least one digit',
      })
      .refine((value) => /[@$!%*?&]/.test(value), {
        message: 'Password must contain at least one special character',
      })
      .optional(),
    admin: z.object({
      designation: z.enum([...Designations] as [string, ...string[]]),
      name: createNameValidationSchema,
      gender: z.enum([...Genders] as [string, ...string[]]),
      dateOfBirth: z.string().refine(
        (dob) => {
          const yearOfBirth = parseInt(dob.split('-')[0], 10);
          return yearOfBirth <= currentYear - 30;
        },
        {
          message: `Birth year must be earlier than ${currentYear - 30}`,
          path: ['body', 'student', 'dateOfBirth'],
        },
      ),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum([...BloodGroups] as [string, ...string[]]),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      profileImage: z.string(),
      joiningDate: z.string().refine(
        (joiningDate) => {
          const yearOfJoining = parseInt(joiningDate.split('-')[0], 10);
          return yearOfJoining >= 2000 && yearOfJoining <= currentYear;
        },
        {
          message: `Joining year must be between 2000 and ${currentYear}`,
          path: ['body', 'student', 'dateOfBirth'],
        },
      ),
      nationality: z.enum([...Nationalities] as [string, ...string[]]),
      religion: z.enum([...Religions] as [string, ...string[]]),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

//! For updating admin

//* Define the schema for the TAdmin type
export const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      designation: z
        .enum([...Designations] as [string, ...string[]])
        .optional(),
      name: updateNameValidationSchema.optional(),
      gender: z.enum([...Genders] as [string, ...string[]]).optional(),
      dateOfBirth: z
        .string()
        .refine(
          (dob) => {
            const yearOfBirth = parseInt(dob.split('-')[0], 10);
            return yearOfBirth <= currentYear - 30;
          },
          {
            message: `Birth year must be earlier than ${currentYear - 30}`,
            path: ['body', 'student', 'dateOfBirth'],
          },
        )
        .optional(),
      email: z.string().email().optional(),
      contactNo: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      bloodGroup: z.enum([...BloodGroups] as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      profileImage: z.string().optional(),
      joiningDate: z
        .string()
        .refine(
          (joiningDate) => {
            const yearOfJoining = parseInt(joiningDate.split('-')[0], 10);
            return yearOfJoining >= 2000 && yearOfJoining <= currentYear;
          },
          {
            message: `Joining year must be between 2000 and ${currentYear}`,
            path: ['body', 'student', 'dateOfBirth'],
          },
        )
        .optional(),
      nationality: z
        .enum([...Nationalities] as [string, ...string[]])
        .optional(),
      religion: z.enum([...Religions] as [string, ...string[]]).optional(),
    }),
  }),
});

export const adminValidation = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
