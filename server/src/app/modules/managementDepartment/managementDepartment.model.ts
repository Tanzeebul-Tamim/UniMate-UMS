import { Schema, model } from 'mongoose';
import { TManagementDepartment } from './managementDepartment.interface';
import { ManagementDepartmentNames } from './managementDepartment.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const managementDepartmentSchema = new Schema<TManagementDepartment>(
  {
    name: {
      type: String,
      enum: {
        values: ManagementDepartmentNames,
        message:
          'Invalid department name. Please enter a valid department name.',
      },
      required: [true, 'Name is a required field'],
      unique: true,
    },
  },
  { timestamps: true },
);

managementDepartmentSchema.pre('save', async function (next) {
  try {
    const doesDepartmentExist = await ManagementDepartment.findOne({
      name: this.name,
    });

    if (doesDepartmentExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        `${this.name} management department already exists`,
      );
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
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

managementDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  try {
    const query = this.getQuery();
    const doesDepartmentExist = await ManagementDepartment.findOne(query);

    if (!doesDepartmentExist) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Management department not found!',
      );
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
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

export const ManagementDepartment = model<TManagementDepartment>(
  'Management_Department',
  managementDepartmentSchema,
);
