import mongoose from 'mongoose';
import { TUpdateAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { AdminSearchableFields, AdminUpdatableFields } from './admin.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import { validateId } from '../../utils/idValidator';
import { NextFunction } from 'express';
import { removeMiddleName } from '../../utils/middleNameRemover';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find().populate({
      path: 'managementDepartment',
      select: 'name',
    }),
    query,
  )
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;

  return result;
};

const getAnAdminFromDB = async (id: string) => {
  validateId(id, 'A', id[0]);

  const result = await Admin.findOne({ id }).populate({
    path: 'managementDepartment',
    select: 'name',
  });

  return result;
};

const updateAnAdminFromDB = async (
  id: string,
  payload: TUpdateAdmin,
  next: NextFunction,
) => {
  validateId(id, 'A', id[0]);
  restrictFieldsValidator(payload, AdminUpdatableFields);

  const { name, ...remainingAdminData } = payload;
  const modifiedPayload: Record<string, unknown> = { ...remainingAdminData };

  if (name && Object.keys(name).length) {
    if (name.middleName === null) {
      try {
        const modifiedName = await removeMiddleName(name, id, 'A');
        modifiedPayload.name = modifiedName;
      } catch (error) {
        if (error instanceof AppError) {
          next(error);
        } else {
          next(
            new AppError(
              httpStatus.INTERNAL_SERVER_ERROR,
              'An unexpected error occurred!',
            ),
          );
        }
      }
    } else {
      for (const [key, value] of Object.entries(name)) {
        modifiedPayload[`name.${key}`] = value;
      }
    }
  }

  const result = await Admin.findOneAndUpdate({ id }, modifiedPayload, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'managementDepartment',
    select: 'name',
  });

  return result;
};

const deleteAnAdminFromDB = async (id: string) => {
  validateId(id, 'A', id[0]);

  //* Start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    //* Delete an admin (transaction-1)
    const deletedAdmin = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    ).populate({
      path: 'managementDepartment',
      select: 'name',
    });

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin');
    }

    //* Delete the corresponding user (transaction-2)
    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin');
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete admin');
    }
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getAnAdminFromDB,
  updateAnAdminFromDB,
  deleteAnAdminFromDB,
};
