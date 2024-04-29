import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ManagementDepartmentServices } from './managementDepartment.service';
import AppError from '../../errors/AppError';

const createManagementDepartment = catchAsync(async (req, res) => {
  const result =
    await ManagementDepartmentServices.createManagementDepartmentIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department has been created successfully',
    data: result,
  });
});

const getAllManagementDepartments = catchAsync(async (req, res) => {
  const query = req.query;
  const result =
    await ManagementDepartmentServices.getAllManagementDepartmentsFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Management departments have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No management departments found!',
      data: null,
    });
  }
});

const getAManagementDepartment = catchAsync(async (req, res, next) => {
  try {
    const { departmentId } = req.params;
    const result =
      await ManagementDepartmentServices.getAManagementDepartmentFromDB(
        departmentId,
      );

    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Management department has been retrieved successfully',
        data: result,
      });
    } else {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Management department not found!',
      );
    }
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          error.message || 'An unexpected error occurred!',
        ),
      );
    }
  }
});

const updateAManagementDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const payload = req.body;
  const result =
    await ManagementDepartmentServices.updateAManagementDepartmentIntoDB(
      departmentId,
      payload,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department has been updated successfully',
    data: result,
  });
});

export const ManagementDepartmentControllers = {
  createManagementDepartment,
  getAllManagementDepartments,
  getAManagementDepartment,
  updateAManagementDepartment,
};
