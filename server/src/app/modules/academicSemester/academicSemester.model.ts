import { Schema, model } from 'mongoose';
import { TAcademicSemester } from './academicSemester.interface';
import {
  AcademicSemesterCodes,
  AcademicSemesterMonths,
  AcademicSemesterNames,
} from './academicSemester.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: {
        values: AcademicSemesterNames,
        message: 'Invalid semester name. Please enter a valid semester name',
      },
      required: [true, 'Name is required'],
    },
    code: {
      type: String,
      enum: {
        values: AcademicSemesterCodes,
        message: 'Invalid semester code. Please enter a valid semester code',
      },
      required: [true, 'Code is required'],
    },
    year: { type: String, required: [true, 'Date is required'] },
    startMonth: {
      type: String,
      enum: {
        values: AcademicSemesterMonths,
        message:
          'Invalid semester start month. Please enter a valid semester start month',
      },
      required: [true, 'Start month is required'],
    },
    endMonth: {
      type: String,
      enum: {
        values: AcademicSemesterMonths,
        message:
          'Invalid semester end month. Please enter a valid semester end month',
      },
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
    throw new AppError(
      httpStatus.CONFLICT,
      `${this.name}-${this.year} academic semester already exists`,
    );
  }
  next();
});

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesSemesterExistOrNot = await AcademicSemester.findOne(query);

  if (!doesSemesterExistOrNot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found');
  }

  const updatedSemester = this.getUpdate() as TAcademicSemester;
  const { year, name } = updatedSemester;
  
  const doesSemesterAlreadyExist = await AcademicSemester.findOne({
    year,
    name,
  });

  if (doesSemesterAlreadyExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${name}-${year} semester already exists`,
    );
  }

  next();
});

export const AcademicSemester = model<TAcademicSemester>(
  'Academic_Semester',
  academicSemesterSchema,
);
