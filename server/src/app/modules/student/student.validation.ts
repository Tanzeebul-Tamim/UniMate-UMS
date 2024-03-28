import { z } from 'zod';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
} from './student.constant';

//! For creating student

//* Define Zod schemas for individual types
const createNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().min(1).max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
});

const createIndividualGuardianValidationSchema = z.object({
  name: createNameValidationSchema,
  occupation: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
});

const createLocalGuardianValidationSchema =
  createIndividualGuardianValidationSchema.merge(
    z.object({
      address: z.string().min(1).trim(),
      relationship: z.string().min(1).trim(),
    }),
  );

//* Define the schema for the TGuardian type
const createGuardianValidationSchema = z.object({
  father: createIndividualGuardianValidationSchema,
  mother: createIndividualGuardianValidationSchema,
});

//* Define the schema for the TStudent type
export const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).min(6),
    student: z.object({
      name: createNameValidationSchema,
      gender: z.enum([...Genders] as [string, ...string[]]),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z.enum([...BloodGroups] as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: createGuardianValidationSchema,
      localGuardian: createLocalGuardianValidationSchema,
      profileImage: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      nationality: z.enum([...Nationalities] as [string, ...string[]]),
      religion: z.enum([...Religions] as [string, ...string[]]),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

//! For updating student

//* Define Zod schemas for individual types
const updateNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().min(1).max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim().optional(),
});

const updateIndividualGuardianValidationSchema = z.object({
  name: updateNameValidationSchema.optional(),
  occupation: z.string().min(1).trim().optional(),
  contactNo: z.string().min(1).trim().optional(),
});

const updateLocalGuardianValidationSchema =
  updateIndividualGuardianValidationSchema.merge(
    z.object({
      address: z.string().min(1).trim().optional(),
      relationship: z.string().min(1).trim().optional(),
    }),
  );

//* Define the schema for the TGuardian type
const updateGuardianValidationSchema = z.object({
  father: updateIndividualGuardianValidationSchema.optional(),
  mother: updateIndividualGuardianValidationSchema.optional(),
});

//* Define the schema for the TStudent type
export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateNameValidationSchema.optional(),
      gender: z.enum([...Genders] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().min(1).optional(),
      emergencyContactNo: z.string().min(1).optional(),
      bloodGroup: z.enum([...BloodGroups] as [string, ...string[]]).optional(),
      presentAddress: z.string().min(1).optional(),
      permanentAddress: z.string().min(1).optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      profileImage: z.string().optional(),
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      nationality: z
        .enum([...Nationalities] as [string, ...string[]])
        .optional(),
      religion: z.enum([...Religions] as [string, ...string[]]).optional(),
    }),
  }),
});

export const studentValidation = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
