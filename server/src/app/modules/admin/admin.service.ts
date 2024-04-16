import mongoose from 'mongoose';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { AdminSearchableFields, AdminUpdatableFields } from './admin.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery.populate({
    path: 'managementDepartment',
    select: 'name',
  });

  return result;
};

const getAnAdminFromDB = async (id: string) => {
  const result = await Admin.findOne({ id }).populate({
    path: 'managementDepartment',
    select: 'name',
  });

  return result;
};

const updateAnAdminFromDB = async (id: string, payload: Partial<TAdmin>) => {
  restrictFieldsValidator(payload, AdminUpdatableFields);
  const { name, ...remainingAdminData } = payload;
  const modifiedPayload: Record<string, unknown> = { ...remainingAdminData };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedPayload[`name.${key}`] = value;
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
