import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentNames } from './academicDepartment.constant';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      enum: {
        values: AcademicDepartmentNames,
        message:
          'Invalid department name. Please choose a valid department name.',
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

export const AcademicDepartment = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
