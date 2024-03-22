import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TIndividualGuardian,
  TLocalGuardian,
  TName,
  TStudent,
} from './student.interface';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
} from './student.constant';

const nameSchema = new Schema<TName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'First name cannot be longer than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [20, 'Middle name cannot be longer than 20 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [20, 'Last name cannot be longer than 20 characters'],
  },
});

const individualGuardianSchema = new Schema<TIndividualGuardian>({
  name: { type: nameSchema, required: [true, 'Name is required'] },
  occupation: { type: String, required: [true, 'Occupation is required'] },
  contactNo: { type: String, required: [true, 'Contact no is required'] },
});

const guardianSchema = new Schema<TGuardian>({
  father: {
    type: individualGuardianSchema,
    required: [true, "Father's information is required"],
  },
  mother: {
    type: individualGuardianSchema,
    required: [true, "Mother's information is required"],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: nameSchema, required: [true, 'Name is required'] },
  occupation: { type: String, required: [true, 'Occupation is required'] },
  contactNo: { type: String, required: [true, 'Contact no is required'] },
  address: { type: String, required: [true, 'Address is required'] },
  relationship: { type: String, required: [true, 'Relationship is required'] },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: [true, 'ID is required'], unique: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: nameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: Genders,
        message:
          "{VALUE} is invalid value. The gender field can only be one of the following: 'male', 'female' or 'others'",
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
          "The blood group field can only be one of the following: 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'",
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
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian is required'],
    },
    profileImage: { type: String },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Semester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
    },
    nationality: {
      type: String,
      enum: {
        values: Nationalities,
        message: 'Invalid nationality. Please choose a valid nationality.',
      },
    },
    religion: {
      type: String,
      enum: {
        values: Religions,
        message: 'Invalid religion. Please choose a valid religion.',
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } },
);

//* virtual
studentSchema.virtual('fullName').get(function () {
  const name = this.name;
  if (name.middleName) {
    return name.firstName + ' ' + name?.middleName + ' ' + name.lastName;
  } else if (!name.middleName) {
    return name.firstName + ' ' + name.lastName;
  }
});

//* Query middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $eq: false } });
  next();
});

studentSchema.pre('findOneAndUpdate', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

studentSchema.pre('updateOne', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

//* creating a custom static method
studentSchema.statics.doesUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
