import { FacultyServices } from './faculty.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getAllFaculties = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await FacultyServices.getAllFacultiesFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculties have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No faculty found',
      data: null,
    });
  }
});

const getAFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getAFacultyFromDB(facultyId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty has been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Faculty not found!',
      data: result,
    });
  }
});

const getAssignedCoursesOfAFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result =
    await FacultyServices.getAssignedCoursesOfAFacultyFromDB(facultyId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Assigned courses for faculty ${facultyId} has been retrieved successfully`,
    data: result,
  });
});

const updateAFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateAFacultyFromDB(facultyId, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty has been updated successfully',
    data: result,
  });
});

const deleteAFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteAFacultyFromDB(facultyId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Faculty has been deleted successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Faculty not found!',
      data: result,
    });
  }
});

export const FacultyControllers = {
  getAllFaculties,
  getAFaculty,
  getAssignedCoursesOfAFaculty,
  updateAFaculty,
  deleteAFaculty,
};
