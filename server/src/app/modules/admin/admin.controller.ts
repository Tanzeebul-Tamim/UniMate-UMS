import { AdminServices } from './admin.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';

const getAllAdmins = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await AdminServices.getAllAdminsFromDB(query);

  if (result.length > 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admins have been retrieved successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No admins found!',
      data: null,
    });
  }
});

const getAnAdmin = catchAsync(async (req, res, next) => {
  try {
    const { adminId } = req.params;
    const result = await AdminServices.getAnAdminFromDB(adminId);

    if (result) {
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin has been retrieved successfully',
        data: result,
      });
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'Admin not found!');
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

const updateAnAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAnAdminFromDB(adminId, admin, next);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin has been updated successfully',
    data: result,
  });
});

const deleteAnAdmin = catchAsync(async (req, res) => {
  const { adminId } = req.params;
  const result = await AdminServices.deleteAnAdminFromDB(adminId);

  if (result) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin has been deleted successfully',
      data: result,
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Admin not found!',
      data: result,
    });
  }
});

export const AdminControllers = {
  getAllAdmins,
  getAnAdmin,
  updateAnAdmin,
  deleteAnAdmin,
};
