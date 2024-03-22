import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (__, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic departments retrieved successfully',
    data: result,
  });
});

const getAnAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const result =
    await AcademicDepartmentServices.getAnAcademicDepartmentFromDB(
      departmentId,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department is retrieved successfully',
    data: result,
  });
});

const updateAnAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const payload = req.body;
  const result =
    await AcademicDepartmentServices.updateAnAcademicDepartmentIntoDB(
      departmentId,
      payload,
    );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic department has been updated successfully',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getAnAcademicDepartment,
  updateAnAcademicDepartment,
};
