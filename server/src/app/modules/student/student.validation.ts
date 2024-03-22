import { z } from 'zod';

//* Define Zod schemas for individual types
const nameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().min(1).max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
});

const individualGuardianValidationSchema = z.object({
  name: nameValidationSchema,
  occupation: z.string().min(1).trim(),
  contactNo: z.string().min(1).trim(),
});

const localGuardianValidationSchema = individualGuardianValidationSchema.merge(
  z.object({
    address: z.string().min(1).trim(),
    relationship: z.string().min(1).trim(),
  }),
);

//* Define the schema for the TGuardian type
const guardianValidationSchema = z.object({
  father: individualGuardianValidationSchema,
  mother: individualGuardianValidationSchema,
});

//* Define the schema for the TStudent type
export const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).min(6),
    student: z.object({
      name: nameValidationSchema,
      gender: z.enum(['male', 'female', 'others']),
      dateOfBirth: z.string(),
      email: z.string().email(),
      contactNo: z.string().min(1),
      emergencyContactNo: z.string().min(1),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().min(1),
      permanentAddress: z.string().min(1),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      profileImage: z.string().optional(),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      nationality: z.enum([
        'American',
        'British',
        'Canadian',
        'Chinese',
        'French',
        'German',
        'Indian',
        'Italian',
        'Japanese',
        'Russian',
        'Spanish',
        'Swiss',
        'Australian',
        'Brazilian',
        'Mexican',
        'South Korean',
        'Turkish',
        'Bangladeshi',
      ]),
      religion: z.enum([
        'Christianity',
        'Islam',
        'Hinduism',
        'Buddhism',
        'Judaism',
        'Sikhism',
        'Jainism',
        'Shinto',
        'Taoism',
        'Zoroastrianism',
      ]),
      isDeleted: z.boolean().default(false),
    }),
  }),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    name: nameValidationSchema.optional(),
    gender: z.enum(['male', 'female', 'others']).optional(),
    dateOfBirth: z.string().optional(),
    email: z.string().email().optional(),
    contactNo: z.string().min(1).optional(),
    emergencyContactNo: z.string().min(1).optional(),
    bloodGroup: z
      .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .optional(),
    presentAddress: z.string().min(1).optional(),
    permanentAddress: z.string().min(1).optional(),
    guardian: guardianValidationSchema.optional(),
    localGuardian: localGuardianValidationSchema.optional(),
    profileImage: z.string().optional(),
    admissionSemester: z.string().optional(),
    academicDepartment: z.string().optional(),
    nationality: z
      .enum([
        'American',
        'British',
        'Canadian',
        'Chinese',
        'French',
        'German',
        'Indian',
        'Italian',
        'Japanese',
        'Russian',
        'Spanish',
        'Swiss',
        'Australian',
        'Brazilian',
        'Mexican',
        'South Korean',
        'Turkish',
        'Bangladeshi',
      ])
      .optional(),
    religion: z
      .enum([
        'Christianity',
        'Islam',
        'Hinduism',
        'Buddhism',
        'Judaism',
        'Sikhism',
        'Jainism',
        'Shinto',
        'Taoism',
        'Zoroastrianism',
      ])
      .optional(),
  }),
});

export const studentValidation = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
