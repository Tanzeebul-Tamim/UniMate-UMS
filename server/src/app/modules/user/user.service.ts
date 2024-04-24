import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import config from '../../config';
import httpStatus from 'http-status';
import { TUser } from './user.interface';
import { TStudent } from '../student/student.interface';
import { TFaculty } from '../faculty/faculty.interface';
import { TAdmin } from '../admin/admin.interface';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';
import { Student } from '../student/student.model';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import {
  generatedAdminID,
  generatedFacultyID,
  generatedStudentID,
} from './user.utils';

//! Create a student user

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //* Create a user object
  const userData: Partial<TUser> = {};

  //* If the password isn't given, use the default password
  userData.password = password || (config.default_pass as string);

  //* Set student role
  userData.role = 'student';

  //* Find academic semester information
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Set auto-generated ID
    userData.id = await generatedStudentID(
      admissionSemester as TAcademicSemester,
    );

    //* Create an user (transaction-1)
    // We'll get the newly created user as an array
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //* Set id and _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    //* Create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    //* Populate the "admission semester" field in the newStudent object
    await newStudent[0].populate('admissionSemester');

    //* Populate the "academic department" field in the newStudent object
    await newStudent[0].populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    });

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
  }
};

//! Create a faculty user

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  //* Create a user object
  const userData: Partial<TUser> = {};

  //* If the password isn't given, use the default password
  userData.password = password || (config.default_pass as string);

  //* Set faculty role
  userData.role = 'faculty';

  //* Find joining-date information
  const joiningDate: Date = payload.joiningDate;

  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Set auto-generated ID
    userData.id = await generatedFacultyID(joiningDate);

    //* Create an user (transaction-1)
    // We'll get the newly created user as an array
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //* Set id and _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    //* Create a faculty (transaction-2)
    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    //* Populate the "academic department" field in the newFaculty object
    await newFaculty[0].populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    });

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
  }
};

//! Create an admin user

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  //* Create a user object
  const userData: Partial<TUser> = {};

  //* If the password isn't given, use the default password
  userData.password = password || (config.default_pass as string);

  //* Set admin role
  userData.role = 'admin';

  //* Find joining-date information
  const joiningDate: Date = payload.joiningDate;

  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Set auto-generated ID
    userData.id = await generatedAdminID(joiningDate);

    //* Create an user (transaction-1)
    // We'll get the newly created user as an array
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    //* Set id and _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    //* Create an admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    //* Populate the "management department" field in the newAdmin object
    await newAdmin[0].populate({
      path: 'managementDepartment',
      select: 'name',
    });

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
  }
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
};
