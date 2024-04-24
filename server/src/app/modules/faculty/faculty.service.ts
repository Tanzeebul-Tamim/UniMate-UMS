import mongoose from 'mongoose';
import { TUpdateFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import {
  FacultySearchableFields,
  FacultyUpdatableFields,
} from './faculty.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import { getFacultyAssignedCourses } from './faculty.utils';

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery.populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      select: 'name',
    },
  });

  return result;
};

const getAFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      select: 'name',
    },
  });

  return result;
};

const getAssignedCoursesOfAFacultyFromDB = async (id: string) => {
  const facultyInfo = await Faculty.findOne({ id });

  if (facultyInfo) {
    const result = getFacultyAssignedCourses(facultyInfo._id);
    return result;
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found!');
  }
};

const updateAFacultyFromDB = async (id: string, payload: TUpdateFaculty) => {
  restrictFieldsValidator(payload, FacultyUpdatableFields);
  const { name, ...remainingFacultyData } = payload;
  const modifiedPayload: Record<string, unknown> = { ...remainingFacultyData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedPayload[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findOneAndUpdate({ id }, modifiedPayload, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
      select: 'name',
    },
  });

  return result;
};

const deleteAFacultyFromDB = async (id: string) => {
  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Delete a faculty (transaction-1)
    const deletedFaculty = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    ).populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    });

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    //* Delete the corresponding user (transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getAFacultyFromDB,
  getAssignedCoursesOfAFacultyFromDB,
  updateAFacultyFromDB,
  deleteAFacultyFromDB,
};
