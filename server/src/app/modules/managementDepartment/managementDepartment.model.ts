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
});

managementDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesDepartmentExist = await ManagementDepartment.findOne(query);

  if (!doesDepartmentExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Management department not found');
  }
  next();
});

export const ManagementDepartment = model<TManagementDepartment>(
  'Management_Department',
  managementDepartmentSchema,
);
