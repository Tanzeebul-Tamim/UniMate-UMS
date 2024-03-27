import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedStudentID } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

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

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
