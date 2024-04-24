import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester has been registered successfully',
    data: result,
  });
});

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester registries have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No academic semester registries found',
      data: result,
    });
  }
});

const getASemesterRegistration = catchAsync(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const result =
    await SemesterRegistrationServices.getASemesterRegistrationFromDB(
      semesterRegistrationId,
    );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester registry has been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Academic semester registry not found!',
      data: result,
    });
  }
});

const updateASemesterRegistration = catchAsync(async (req, res) => {
  const { semesterRegistrationId } = req.params;
  const payload = req.body;
  const result =
    await SemesterRegistrationServices.updateASemesterRegistrationIntoDB(
      semesterRegistrationId,
      payload,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester registry has been updated successfully',
    data: result,
  });
});

const updateAllSemesterRegistrationsStatuses = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.updateAllSemesterRegistrationsStatusesIntoDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester statuses have been updated successfully',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getASemesterRegistration,
  updateASemesterRegistration,
  updateAllSemesterRegistrationsStatuses,
};
