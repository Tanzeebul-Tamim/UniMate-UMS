import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemesterNames,
      required: [true, 'Name is required'],
    },
    code: {
      type: String,
      enum: AcademicSemesterCodes,
      required: [true, 'Code is required'],
    },
    year: { type: String, required: [true, 'Date is required'] },
    startMonth: {
      type: String,
      enum: AcademicSemesterMonths,
      required: [true, 'Start month is required'],
    },
    endMonth: {
      type: String,
      enum: AcademicSemesterMonths,
      required: [true, 'End month is required'],
    },
  },
  { timestamps: true },
);

academicSemesterSchema.pre('save', async function (next) {
  const doesSemesterExist = await AcademicSemester.findOne({
    year: this.year,
    name: this.name,
  });

  if (doesSemesterExist) {
    throw new Error(`${this.name}-${this.year} semester already exists`);
  }
  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'Academic_Semester',
  academicSemesterSchema,
);
