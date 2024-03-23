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

academicDepartmentSchema.pre('save', async function (next) {
  const doesDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (doesDepartmentExist) {
    throw new Error(`${this.name} department already exists`);
  }
  next();
});

// academicDepartmentSchema.pre('findOne', async function (next) {
//   const query = this.getQuery();
//   const doesDepartmentExist = await AcademicDepartment.findOne(query);

//   if (!doesDepartmentExist) {
//     throw new Error('Department not found');
//   }
//   next();
// });

// academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
//   const query = this.getQuery();
//   const doesDepartmentExist = await AcademicDepartment.findOne(query);

//   if (!doesDepartmentExist) {
//     throw new Error('Department not found');
//   }
//   next();
// });

export const AcademicDepartment = model<TAcademicDepartment>(
  'Academic_Department',
  academicDepartmentSchema,
);
