import { Schema } from 'mongoose';
import {
  TBloodGroup,
  TGender,
  TName,
  TNationality,
  TReligion,
} from '../interface/common';
import { z } from 'zod';

export const Genders: TGender[] = ['male', 'female', 'others'];

export const BloodGroups: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const Nationalities: TNationality[] = [
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
];

export const Religions: TReligion[] = [
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
];

export const nameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name cannot be longer than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [20, 'Middle name cannot be longer than 20 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [20, 'Last name cannot be longer than 20 characters'],
  },
});

export const createNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim(),
  middleName: z.string().min(1).max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim(),
});


export const updateNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).trim().optional(),
  middleName: z.string().min(1).max(20).trim().optional(),
  lastName: z.string().min(1).max(20).trim().optional(),
});
