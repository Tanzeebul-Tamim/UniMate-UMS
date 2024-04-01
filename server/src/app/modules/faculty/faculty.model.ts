import { Schema, model } from 'mongoose';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { FacultyModel, TFaculty } from './faculty.interface';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
  nameSchema,
} from '../../constant/common';
import { Designations } from './faculty.constant';

const facultySchema = new Schema<TFaculty, FacultyModel>(
  {
    id: { type: String, required: [true, 'ID is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    designation: {
      type: String,
      enum: {
        values: Designations,
        message:
          '{VALUE} is an invalid designation. Please choose a valid designation',
      },
    },
    name: { type: nameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: Genders,
        message:
          "{VALUE} is an invalid gender. The gender field can only be one of the following: 'male', 'female' or 'others'",
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact no is required'],
      unique: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact no is required'],
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroups,
        message:
          "{VALUE} is an invalid blood group. The blood group field can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'",
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImage: { type: String },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
    },
    joiningDate: { type: Date, required: [true, 'Joining date is required'] },
    nationality: {
      type: String,
      enum: {
        values: Nationalities,
        message:
          '{VALUE} is an invalid nationality. Please choose a valid nationality.',
      },
    },
    religion: {
      type: String,
      enum: {
        values: Religions,
        message:
          '{VALUE} is an invalid religion. Please choose a valid religion.',
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

//* virtual
facultySchema.virtual('fullName').get(function () {
  const name = this.name;
  if (name && name?.middleName) {
    return name.firstName + ' ' + name?.middleName + ' ' + name.lastName;
  } else if (name && !name?.middleName) {
    return name.firstName + ' ' + name.lastName;
  }
});

//* Query middleware
facultySchema.pre('save', async function (next) {
  const isDepartmentValid = await AcademicDepartment.findOne({
    _id: this.academicDepartment,
  });

  if (!isDepartmentValid) {
    throw new AppError(httpStatus.CONFLICT, 'Invalid academic department');
  } 

  next();
});

facultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('findOne', async function (next) {
  this.findOne({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('findOneAndUpdate', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('updateOne', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

facultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesFacultyExist = await Faculty.findOne(query);

  if (!doesFacultyExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found');
  }

  next();
});

//* creating a custom static method
facultySchema.statics.doesUserExist = async function (id: string) {
  const existingUser = await Faculty.findOne({ id });
  return existingUser;
};

export const Faculty = model<TFaculty, FacultyModel>('Faculty', facultySchema);
