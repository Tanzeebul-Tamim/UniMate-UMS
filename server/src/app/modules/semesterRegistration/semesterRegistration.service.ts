import QueryBuilder from '../../builder/QueryBuilder';
import {
  RegistrationStatuses,
  SemesterRegistrationUpdatableFields,
} from './semesterRegistration.constant';
import {
  TSemesterRegistrationClient,
  TSemesterRegistrationDB,
  TUpdateSemesterRegistrationClient,
} from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  validateAndModifyPayloadForCreatingSemesterRegistration,
  validateAndModifyPayloadForUpdatingSemesterRegistration,
} from './semesterRegistration.utils';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistrationClient,
) => {
  const checkStatus = await SemesterRegistration.findOne({
    $or: [
      { status: RegistrationStatuses.UPCOMING },
      { status: RegistrationStatuses.ONGOING },
    ],
  });

  //* Check if there's already any upcoming or ongoing semester registered or not
  if (checkStatus) {
    const status = checkStatus.status;

    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot register a semester while there's already an ${status} registered semester!`,
    );
  }

  const academicSemester = (await AcademicSemester.findById(
    payload?.academicSemester,
  )) as TAcademicSemester;

  //* Check if the academic semester exists or not
  if (!academicSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester not found!');
  }

  const validatedPayload =
    validateAndModifyPayloadForCreatingSemesterRegistration(
      payload,
      academicSemester,
    );

  const result = (await SemesterRegistration.create(validatedPayload)).populate(
    'academicSemester',
  );

  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result =
    await semesterRegistrationQuery.modelQuery.populate('academicSemester');

  return result;
};

const getASemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateASemesterRegistrationIntoDB = async (
  id: string,
  payload: TUpdateSemesterRegistrationClient,
) => {
  const currentSemester = await SemesterRegistration.findById(id);
  const currentSemesterStatus = currentSemester?.status;

  //* Ensure that the current status of the requested semester is not "ended"
  if (currentSemesterStatus === RegistrationStatuses.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The semester cannot be updated because it has already been ${currentSemesterStatus}`,
    );
  }

  restrictFieldsValidator(payload, SemesterRegistrationUpdatableFields);
  const currentSemesterRegistrationInfo = (await SemesterRegistration.findById(
    id,
  )) as TSemesterRegistrationDB;

  //* Check if the academic semester registry exists or not
  if (!currentSemesterRegistrationInfo) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registry not found!');
  }

  const validatePayload =
    validateAndModifyPayloadForUpdatingSemesterRegistration(
      payload,
      currentSemesterRegistrationInfo,
    );

  const result = await SemesterRegistration.findByIdAndUpdate(
    id,
    validatePayload,
    {
      new: true,
      runValidators: true,
    },
  ).populate('academicSemester');

  return result;
};

const updateAllSemesterRegistrationsStatusesIntoDB = async () => {
  try {
    const today = new Date();

    const upcomingCriteria = {
      $and: [{ startDate: { $gt: today } }, { endDate: { $gt: today } }],
    };
    const ongoingCriteria = {
      $and: [{ startDate: { $lt: today } }, { endDate: { $gt: today } }],
    };
    const endedCriteria = {
      $and: [{ startDate: { $lt: today } }, { endDate: { $lt: today } }],
    };

    const upcomingUpdate = { $set: { status: RegistrationStatuses.UPCOMING } };
    const ongoingUpdate = { $set: { status: RegistrationStatuses.ONGOING } };
    const endedUpdate = { $set: { status: RegistrationStatuses.ENDED } };

    await SemesterRegistration.updateMany(upcomingCriteria, upcomingUpdate);

    await SemesterRegistration.updateMany(ongoingCriteria, ongoingUpdate);

    await SemesterRegistration.updateMany(endedCriteria, endedUpdate);

    const result =
      await SemesterRegistration.find().populate('academicSemester');

    return result;
  } catch (error) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update semester registrations',
    );
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getASemesterRegistrationFromDB,
  updateASemesterRegistrationIntoDB,
  updateAllSemesterRegistrationsStatusesIntoDB,
};
