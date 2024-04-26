import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course has been created successfully',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered courses have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No offered courses found',
      data: result,
    });
  }
});

const getAnOfferedCourse = catchAsync(async (req, res) => {
  const { offeredCourseId } = req.params;
  const result = await OfferedCourseServices.getAnOfferedCourseFromDB(
    offeredCourseId,
  );

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered course has been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Offered course not found!',
      data: result,
    });
  }
});

// const updateAnOfferedCourse = catchAsync(async (req, res) => {
//   const { offeredCourseId } = req.params;
//   const payload = req.body;
//   const result = await OfferedCourseServices.updateAnOfferedCourseIntoDB(
//     offeredCourseId,
//     payload,
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Offered course has been updated successfully',
//     data: result,
//   });
// });

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getAnOfferedCourse,
  // updateAnOfferedCourse,
};
