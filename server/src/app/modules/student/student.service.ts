import mongoose from 'mongoose';
import { TStudent } from './student.interface';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { queryFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query }; //* Make a copy of the query

  let searchTerm = '';

  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string;
  }

  const searchQuery = Student.find({
    $or: queryFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  //* Filter the query parameters
  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((element) => delete queryObj[element]);

  const filterQuery = searchQuery
    .find(queryObj)
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

  let sort = '-createdAt';

  if (query?.sort) {
    sort = query.sort as string;
  }

  const sortQuery = filterQuery.sort(sort);

  let page = 1;
  let limit = 0;
  let skip = 0;

  if (query?.limit) {
    limit = Number(query.limit) as number;
  }

  if (query?.page) {
    page = Number(query.page) as number;
    skip = (page - 1) * limit;
  }

  const paginateQuery = sortQuery.skip(skip);

  const limitQuery = paginateQuery.limit(limit);

  let fields = '-__v';

  if (query?.fields) {
    fields = (query.fields as string).split(',').join(' ');
  }

  const fieldQuery = await limitQuery.select(fields);

  return fieldQuery;
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

const updateAStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  const modifiedPayload: Record<string, unknown> = { remainingStudentData };

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
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentFromDB,
  getAStudentFromDB,
  updateAStudentFromDB,
  deleteAStudentFromDB,
};
