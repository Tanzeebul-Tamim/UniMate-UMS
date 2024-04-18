import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course, CourseFaculty } from './course.model';
import mongoose, { Types } from 'mongoose';
import {
  createTitlePrefixValidator,
  updateTitlePrefixValidator,
} from './course.utils';
import { Faculty } from '../faculty/faculty.model';

const createCourseIntoDB = async (payload: TCourse) => {
  createTitlePrefixValidator(payload);
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(Course.find(), query)
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery.populate({
    path: 'prerequisiteCourses.course',
    select: ['title', 'prefix', 'code', 'credits'],
  });

  return result;
};

const getACourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate({
    path: 'prerequisiteCourses.course',
    select: ['title', 'prefix', 'code', 'credits'],
  });
  return result;
};

const getAssignedFacultiesOfACourseFromDB = async (id: string) => {
  const result = await CourseFaculty.findOne({ course: id }).populate({
    path: 'faculties',
  });

  if (result) {
    if (result.faculties.length > 0) {
      return result;
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'No assigned faculties found');
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'No documents found');
  }
};

const updateACourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  //* start a session
  const session = await mongoose.startSession();

  try {
    //* Start a transaction
    session.startTransaction();

    const { prerequisiteCourses, ...courseRemainingData } = payload;

    //! Update regular course-info
    const validateCourseInfo = updateTitlePrefixValidator(payload);

    if (validateCourseInfo) {
      courseRemainingData.prefix = validateCourseInfo;
    }

    //! (transaction-1)
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateBasicCourseInfo) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to update basic course info',
      );
    }

    //! Check if there's any prerequisite courses to update or not
    if (prerequisiteCourses && prerequisiteCourses.length > 0) {
      //! Delete prerequisites
      //* Get all existing prerequisite course IDs for the current document
      const courseInfoForDeletion = await Course.findById(id);
      const existingPrerequisiteIDs =
        courseInfoForDeletion &&
        courseInfoForDeletion.prerequisiteCourses &&
        courseInfoForDeletion.prerequisiteCourses.map((elem) =>
          elem.course.toString(),
        );

      //* Filter out the deleted prerequisite courses
      const toBeDeleted = prerequisiteCourses
        ?.filter((elem) => elem.course && elem.isDeleted)
        ?.map((elem) => elem.course.toString());

      //* Check if the provided prerequisite courses for deletion exist in the main document or not
      toBeDeleted.forEach((elem) => {
        try {
          new mongoose.Types.ObjectId(elem);
        } catch (error) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `${elem} Invalid ID format`,
          );
        }

        if (!existingPrerequisiteIDs?.includes(elem)) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `${elem} Course not found in the document`,
          );
        }
      });

      const deleteQuery = {
        $pull: { prerequisiteCourses: { course: { $in: toBeDeleted } } },
      };

      //! (transaction-2)
      const deletePrerequisiteCourses = await Course.findByIdAndUpdate(
        id,
        deleteQuery,
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletePrerequisiteCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to delete prerequisite courses info',
        );
      }

      //! Add prerequisites
      //* Get all the existing course IDs from the database
      const courseInfoForAddition = await Course.find();
      const existingCourseIDs =
        courseInfoForAddition &&
        courseInfoForAddition.map((elem) => elem?._id.toString());

      //* Filter out the newly added prerequisite courses
      const toBeAdded = prerequisiteCourses?.filter(
        (elem) => elem.course && !elem.isDeleted,
      );

      //* Check if the provided prerequisite courses for addition exist in the database or not
      toBeAdded.forEach((elem) => {
        try {
          new mongoose.Types.ObjectId(elem.course);
        } catch (error) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `${elem.course} Invalid ID format`,
          );
        }

        if (!existingCourseIDs?.includes(elem.course.toString())) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            `${elem.course} Course not found`,
          );
        }

        if (existingPrerequisiteIDs?.includes(elem.course.toString())) {
          throw new AppError(
            httpStatus.CONFLICT,
            `${elem.course} Course already exists in the document`,
          );
        }
      });

      const toBeAddedIDs = toBeAdded.map((elem) => elem.course.toString());

      if (toBeAddedIDs?.includes(id)) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `A course (${id}) itself cannot be it's own prerequisite.`,
        );
      }

      const addQuery = {
        $addToSet: { prerequisiteCourses: { $each: toBeAdded } },
      };

      //! (transaction-3)
      const addPrerequisiteCourses = await Course.findByIdAndUpdate(
        id,
        addQuery,
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!addPrerequisiteCourses) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to add prerequisite courses info',
        );
      }
    }

    //* Commit and end session after successful transactions
    await session.commitTransaction();
    await session.endSession();

    //* Get the updated data if nothing goes wrong
    const result = await Course.findById(id).populate({
      path: 'prerequisiteCourses.course',
      select: ['title', 'prefix', 'code', 'credits'],
    });

    return result;
  } catch (err: unknown) {
    //* Abort and end session if transaction fails
    await session.abortTransaction();
    await session.endSession();

    if (err instanceof Error) {
      throw new AppError(httpStatus.BAD_REQUEST, err?.message);
    } else {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
    }
  }
};

const assignFacultiesIntoCourseIntoDB = async (
  id: string,
  payload: [Types.ObjectId],
) => {
  //* Get all the existing faculty IDs from the database
  const facultyInfoForAssigningIntoCourse = await Faculty.find();

  if (facultyInfoForAssigningIntoCourse.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, 'No faculty documents found');
  }

  const existingFacultyIDs =
    facultyInfoForAssigningIntoCourse &&
    facultyInfoForAssigningIntoCourse.map((elem) => elem?._id.toString());

  //* Check if the provided faculties for being assigned to the particular course exist in the database or not
  payload.forEach((elem) => {
    try {
      new mongoose.Types.ObjectId(elem);
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ID format');
    }

    if (!existingFacultyIDs?.includes(elem.toString())) {
      throw new AppError(httpStatus.NOT_FOUND, `${elem} Faculty not found`);
    }
  });

  const assignFacultiesIntoCourseUpdatedDocument = {
    course: id,
    $addToSet: { faculties: { $each: payload } },
  };

  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    assignFacultiesIntoCourseUpdatedDocument,
    { upsert: true, new: true },
  )
    .populate({
      path: 'course',
      populate: {
        path: 'prerequisiteCourses.course',
        select: ['title', 'prefix', 'code', 'credits'],
      },
    })
    .populate({
      path: 'faculties',
      populate: {
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      },
    });

  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: [Types.ObjectId],
) => {
  //* Get all the existing assigned faculty IDs for a particular course, from the database
  const facultyInfoForAssigningIntoCourse = await CourseFaculty.findOne({
    course: id,
  });

  if (!facultyInfoForAssigningIntoCourse) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const existingFacultyIDs =
    facultyInfoForAssigningIntoCourse &&
    facultyInfoForAssigningIntoCourse?.faculties?.toString();

  //* Check if the provided faculties for being assigned to the particular course exist in the database or not
  payload.forEach((elem) => {
    try {
      new mongoose.Types.ObjectId(elem);
    } catch (error) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid ID format');
    }

    if (!existingFacultyIDs?.includes(elem.toString())) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `${elem} Faculty not found in the document`,
      );
    }
  });

  const removeFacultiesFromCourseQuery = {
    $pull: { faculties: { $in: payload } },
  };

  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    removeFacultiesFromCourseQuery,
  )
    .populate({
      path: 'course',
      populate: {
        path: 'prerequisiteCourses.course',
        select: ['title', 'prefix', 'code', 'credits'],
      },
    })
    .populate({
      path: 'faculties',
      populate: {
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      },
    });

  return result;
};

const deleteACourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).populate({
    path: 'prerequisiteCourses.course',
    select: ['title', 'prefix', 'code', 'credits'],
  });

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getACourseFromDB,
  getAssignedFacultiesOfACourseFromDB,
  updateACourseIntoDB,
  assignFacultiesIntoCourseIntoDB,
  removeFacultiesFromCourseFromDB,
  deleteACourseFromDB,
};
