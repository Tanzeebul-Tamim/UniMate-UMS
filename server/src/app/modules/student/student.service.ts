import mongoose from 'mongoose';
import { TUpdateStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import {
  StudentSearchableFields,
  StudentUpdatableFields,
} from './student.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(Student.find(), query)
    .search(StudentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery
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
  const result = await Student.findOne({ id })
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

const updateAStudentFromDB = async (id: string, payload: TUpdateStudent) => {
  restrictFieldsValidator(payload, StudentUpdatableFields);
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  const modifiedPayload: Record<string, unknown> = { ...remainingStudentData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedPayload[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [guardianKey, guardianValue] of Object.entries(guardian)) {
      if (
        guardianValue &&
        typeof guardianValue === 'object' &&
        Object.keys(guardianValue).length
      ) {
        for (const [parentKey, parentValue] of Object.entries(guardianValue)) {
          if (
            parentValue &&
            typeof parentValue === 'object' &&
            Object.keys(parentValue).length
          ) {
            for (const [nameKey, nameValue] of Object.entries(parentValue)) {
              modifiedPayload[
                `guardian.${guardianKey}.${parentKey}.${nameKey}`
              ] = nameValue;
            }
          } else if (parentValue && typeof parentValue === 'string') {
            modifiedPayload[`guardian.${guardianKey}.${parentKey}`] =
              parentValue;
          }
        }
      }
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [localGuardianKey, localGuardianValue] of Object.entries(
      localGuardian,
    )) {
      if (
        localGuardianValue &&
        typeof localGuardianValue === 'object' &&
        Object.keys(localGuardianValue).length
      ) {
        for (const [nameKey, nameValue] of Object.entries(localGuardianValue)) {
          modifiedPayload[`localGuardian.${localGuardianKey}.${nameKey}`] =
            nameValue;
        }
      } else if (localGuardianValue && typeof localGuardianValue === 'string') {
        modifiedPayload[`localGuardian.${localGuardianKey}`] =
          localGuardianValue;
      }
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedPayload, {
    new: true,
    runValidators: true,
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
    )
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
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getAStudentFromDB,
  updateAStudentFromDB,
  deleteAStudentFromDB,
};
