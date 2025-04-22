import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { AcademicSemesterServices } from './academicSemester.service';
import AppError from '../../errors/AppError';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester has been created successfully',
    data: result,
  });
});

const getAllAcademicSemesters = catchAsync(async (req, res) => {
  const { query } = req;
  const result =
    await AcademicSemesterServices.getAllAcademicSemestersFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semesters have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No academic semesters found!',
      data: null,
    });
  }
});

const getAnAcademicSemester = catchAsync(async (req, res, next) => {
  try {
    const { semesterId } = req.params;
    const result =
      await AcademicSemesterServices.getAnAcademicSemesterFromDB(semesterId);

    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic semester has been retrieved successfully',
        data: result,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Academic semester not found!');
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

const updateAnAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params;
  const payload = req.body;
  const result = await AcademicSemesterServices.updateAnAcademicSemesterIntoDB(
    semesterId,
    payload,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic semester has been updated successfully',
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemesters,
  getAnAcademicSemester,
  updateAnAcademicSemester,
};
