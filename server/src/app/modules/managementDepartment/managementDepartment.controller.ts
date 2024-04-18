import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ManagementDepartmentServices } from './managementDepartment.service';

const createManagementDepartment = catchAsync(async (req, res) => {
  const result =
    await ManagementDepartmentServices.createManagementDepartmentIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Management department is created successfully',
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
      message: 'No management departments found',
      data: result,
    });
  }
});

const getAManagementDepartment = catchAsync(async (req, res) => {
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
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Management department not found!',
      data: result,
    });
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
