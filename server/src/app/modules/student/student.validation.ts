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

//! For creating student

//* Define Zod schemas for TIndividualGuardian types
const createIndividualGuardianValidationSchema = z.object({
  name: createNameValidationSchema,
  occupation: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
  email: z.string().email(),
});

//* Define Zod schemas for TLocalGuardian types
const createLocalGuardianValidationSchema =
  createIndividualGuardianValidationSchema.merge(
    z.object({
      address: z.string().min(1).trim(),
      relationship: z.string().min(1).trim(),
    }),
  );

//* Define the Zod schema for the TGuardian type
const createGuardianValidationSchema = z.object({
  father: createIndividualGuardianValidationSchema,
  mother: createIndividualGuardianValidationSchema,
});

//* Define the Zod schema for the TStudent type
export const createStudentValidationSchema = z.object({
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
    student: z.object({
      name: createNameValidationSchema,
      gender: z.enum([...Genders] as [string, ...string[]]),
      dateOfBirth: z.string().refine(
        (dob) => {
          const yearOfBirth = parseInt(dob.split('-')[0], 10);
          return (
            yearOfBirth >= currentYear - 30 && yearOfBirth <= currentYear - 20
          );
        },
        {
          message: `Birth year must be between ${currentYear - 30} and ${currentYear - 20}`,
          path: ['body', 'student', 'dateOfBirth'],
        },
      ),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum([...BloodGroups] as [string, ...string[]]),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      profileImage: z.string(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      nationality: z.enum([...Nationalities] as [string, ...string[]]),
      religion: z.enum([...Religions] as [string, ...string[]]),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

//! For updating student

//* Define Zod schemas for Partial<TIndividualGuardian> types
const updateIndividualGuardianValidationSchema = z.object({
  name: updateNameValidationSchema.optional(),
  occupation: z.string().min(1).trim().optional(),
  contactNo: z.string().min(1).trim().optional(),
});

//* Define the Zod schema for Partial<TLocalGuardian> type
const updateLocalGuardianValidationSchema =
  updateIndividualGuardianValidationSchema.merge(
    z.object({
      address: z.string().min(1).trim().optional(),
      relationship: z.string().min(1).trim().optional(),
    }),
  );

//* Define the Zod schema for the Partial<TGuardian> type
const updateGuardianValidationSchema = z.object({
  father: updateIndividualGuardianValidationSchema.optional(),
  mother: updateIndividualGuardianValidationSchema.optional(),
});

//* Define the Zod schema for the Partial<TStudent> type
export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      contactNo: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
    }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
