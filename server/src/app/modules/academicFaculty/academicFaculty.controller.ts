import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicFacultyServices } from './academicFaculty.service';
import AppError from '../../errors/AppError';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty has been created successfully',
    data: result,
  });
});

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const { query } = req;
  const result =
    await AcademicFacultyServices.getAllAcademicFacultiesFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic faculties have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No academic faculties found!',
      data: null,
    });
  }
});

const getAnAcademicFaculty = catchAsync(async (req, res, next) => {
  try {
    const { facultyId } = req.params;
    const result =
      await AcademicFacultyServices.getAnAcademicFacultyFromDB(facultyId);

    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic faculty has been retrieved successfully',
        data: result,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found!');
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

const updateAnAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const payload = req.body;
  const result = await AcademicFacultyServices.updateAnAcademicFacultyIntoDB(
    facultyId,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic faculty has been updated successfully',
    data: result,
  });
});

export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getAnAcademicFaculty,
  updateAnAcademicFaculty,
};
