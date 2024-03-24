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

academicFacultySchema.pre('save', async function (next) {
  const doesFacultyExist = await AcademicFaculty.findOne({ name: this.name });

  if (doesFacultyExist) {
    throw new Error(`${this.name} already exists`);
  }
  next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesFacultyExist = await AcademicFaculty.findOne(query);

  if (!doesFacultyExist) {
    throw new Error('Faculty not found');
  }
  next();
});

export const AcademicFaculty = model<TAcademicFaculty>(
  'Academic_Faculty',
  academicFacultySchema,
);
