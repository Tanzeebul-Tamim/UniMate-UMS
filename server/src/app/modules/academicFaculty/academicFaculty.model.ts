import { Schema, model } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyNames } from './academicFaculty.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      enum: {
        values: AcademicFacultyNames,
        message: 'Invalid faculty name. Please enter a valid faculty name.',
      },
      required: [true, 'Name is a required field'],
      unique: true,
    },
  },
  { timestamps: true },
);

academicFacultySchema.pre('save', async function (next) {
  try {
    const doesFacultyExist = await AcademicFaculty.findOne({ name: this.name });

    if (doesFacultyExist) {
      throw new AppError(httpStatus.CONFLICT, `${this.name} already exists`);
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  try {
    const query = this.getQuery();
    const doesFacultyExist = await AcademicFaculty.findOne(query);

    if (!doesFacultyExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

export const AcademicFaculty = model<TAcademicFaculty>(
  'Academic_Faculty',
  academicFacultySchema,
);
