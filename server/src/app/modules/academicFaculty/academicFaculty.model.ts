import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyNames } from './academicFaculty.constant';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      enum: {
        values: AcademicFacultyNames,
        message: 'Invalid faculty name. Please choose a valid faculty name.',
      },
      required: [true, 'Name is a required field'],
      unique: true,
    },
  },
  { timestamps: true },
);

export const AcademicFaculty = model<TAcademicFaculty>(
  'Academic_Faculty',
  academicFacultySchema,
);
