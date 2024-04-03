import { Schema, model } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TIndividualGuardian,
  TLocalGuardian,
  TStudent,
} from './student.interface';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import {
  BloodGroups,
  Genders,
  Nationalities,
  Religions,
  nameSchema,
} from '../../constant/common';

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
      required: [true, 'User is required'],
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
      required: [true, 'Blood group is required'],
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
    profileImage: {
      type: String,
      required: [true, 'Profile image is required'],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Semester',
      required: [true, 'Admission semester is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
      required: [true, 'Academic department is required'],
    },
    nationality: {
      type: String,
      enum: {
        values: Nationalities,
        message:
          '{VALUE} is an invalid nationality. Please choose a valid nationality.',
      },
      required: [true, 'Nationality is required'],
    },
    religion: {
      type: String,
      enum: {
        values: Religions,
        message:
          '{VALUE} is an invalid religion. Please choose a valid religion.',
      },
      required: [true, 'Religion is required'],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

//* virtual
studentSchema.virtual('fullName').get(function () {
  const name = this.name;
  if (name && name?.middleName) {
    return name.firstName + ' ' + name?.middleName + ' ' + name.lastName;
  } else if (name && !name?.middleName) {
    return name.firstName + ' ' + name.lastName;
  }
});

//* Query middleware
studentSchema.pre('save', async function (next) {
  const isDepartmentValid = await AcademicDepartment.findById(
    this.academicDepartment,
  );

  const isSemesterValid = await AcademicSemester.findById(
    this.academicDepartment,
  );

  if (!isDepartmentValid) {
    throw new AppError(httpStatus.CONFLICT, 'Invalid academic department');
  } else if (!isSemesterValid) {
    throw new AppError(httpStatus.CONFLICT, 'Invalid academic semester');
  }

  next();
});

studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});

studentSchema.pre('findOne', async function (next) {
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

studentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesStudentExistOrNot = await Student.findOne(query);

  if (!doesStudentExistOrNot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const updatedStudent = this.getUpdate() as Partial<TStudent>;
  const { contactNo, emergencyContactNo } = updatedStudent;

  if (contactNo || emergencyContactNo) {
    const doesContactNoAlreadyExist = await Student.findOne({
      $or: [
        { contactNo },
        { emergencyContactNo },
        { contactNo: emergencyContactNo },
        { emergencyContactNo: contactNo },
      ],
    });

    if (doesContactNoAlreadyExist) {
      throw new AppError(
        httpStatus.CONFLICT,
        contactNo && !emergencyContactNo
          ? `This contact no ${contactNo} is already in use. Provide a different one`
          : !contactNo && emergencyContactNo
            ? `This emergency contact no ${emergencyContactNo} is already in use. Provide a different one`
            : contactNo && emergencyContactNo
              ? `This contact no ${contactNo} or this emergency contact no ${emergencyContactNo} is already in use. Provide a different one`
              : '',
      );
    }
  }

  next();
});

//* creating a custom static method
studentSchema.statics.doesUserExist = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>('Student', studentSchema);
