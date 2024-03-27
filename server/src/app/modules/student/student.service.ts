import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';

const getAllStudentFromDB = async () => {
  const result = await Student.find()
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    })
    .populate({
      path: 'admissionSemester',
      select: ['name', 'year', 'startMonth', 'endMonth'],
    });
  return result;
};

const getAStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ _id: id })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    })
    .populate({
      path: 'admissionSemester',
      select: ['name', 'year', 'startMonth', 'endMonth'],
    });
  return result;
};

const updateAStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const result = await Student.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    })
    .populate({
      path: 'admissionSemester',
      select: ['name', 'year', 'startMonth', 'endMonth'],
    });
  return result;
};

const deleteAStudentFromDB = async (id: string) => {
  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Delete a student (transaction-1)
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //* Delete an user (transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;

  } catch {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getAStudentFromDB,
  updateAStudentFromDB,
  deleteAStudentFromDB,
};
