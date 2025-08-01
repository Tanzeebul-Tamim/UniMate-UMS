import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentNames } from './academicDepartment.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      enum: {
        values: AcademicDepartmentNames,
        message:
          'Invalid department name. Please enter a valid department name.',
      },
      required: [true, 'Name is a required field'],
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic faculty is a required field'],
      ref: 'Academic_Faculty',
    },
  },
  { timestamps: true },
);

academicDepartmentSchema.pre('save', async function (next) {
  try {
    const doesDepartmentExist = await AcademicDepartment.findOne({
      name: this.name,
    });

    if (doesDepartmentExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        `${this.name} academic department already exists`,
      );
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

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const query = this.getQuery();
    const doesDepartmentExist = await AcademicDepartment.findOne(query);

    if (!doesDepartmentExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Academic department not found!',
      );
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

export const AcademicDepartment = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
