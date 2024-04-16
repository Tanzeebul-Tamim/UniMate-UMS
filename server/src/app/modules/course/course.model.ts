import { Schema, model } from 'mongoose';
import {
  TCourse,
  TCourseFaculty,
  TPrerequisiteCourses,
} from './course.interface';
import { CourseCodes, CoursePrefixes, CourseTitles } from './course.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//! Main Course Schema
const prerequisiteCoursesSchema = new Schema<TPrerequisiteCourses>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is a required field'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      enum: {
        values: CourseTitles,
        message: 'Invalid course title. Please enter a valid course title',
      },
      unique: true,
      trim: true,
      required: [true, 'Title is a required field'],
    },
    prefix: {
      type: String,
      enum: {
        values: CoursePrefixes,
        message: 'Invalid course prefix. Please enter a valid course prefix',
      },
      trim: true,
      required: [true, 'Prefix is a required field'],
    },
    code: {
      type: Number,
      enum: {
        values: CourseCodes,
        message: 'Invalid course code. Valid code is from 100 to 112',
      },
      required: [true, 'Code is a required field'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits is a required field'],
    },
    prerequisiteCourses: {
      type: [prerequisiteCoursesSchema],
      required: [true, 'Prerequisite courses is a required field'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

//* virtual
courseSchema.virtual('courseCode').get(function () {
  const prefix = this.prefix;
  const code = this.code;

  if (prefix && code) {
    return `${prefix}${code}`;
  }
});

//* Query middleware
courseSchema.pre('save', async function (next) {
  const doesCourseExist = await Course.findOne({
    prefix: this.prefix,
    code: this.code,
  });

  const doesCourseTitleExist = await Course.findOne({
    title: this.title,
  });

  if (doesCourseExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${this.prefix}${this.code} course already exists`,
    );
  }

  if (doesCourseTitleExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${this.title} course already exists`,
    );
  }
  next();
});

courseSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesCourseExistOrNot = await Course.findOne(query);

  if (!doesCourseExistOrNot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const updatedCourse = this.getUpdate() as Partial<TCourse>;
  const { title, prefix, code } = updatedCourse;

  const doesCourseExist = await Course.findOne({
    prefix,
    code,
  });

  const doesCourseTitleExist = await Course.findOne({
    title,
  });

  if (doesCourseExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      `${prefix}${code} course already exists`,
    );
  }

  if (doesCourseTitleExist) {
    throw new AppError(httpStatus.CONFLICT, `${title} course already exists`);
  }

  next();
});

export const Course = model<TCourse>('Course', courseSchema);

//! Assign Faculties Schema
const courseFacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      unique: true,
      ref: 'Course',
      required: [true, 'Course is a required field'],
    },
    faculties: {
      type: [Schema.Types.ObjectId],
      ref: 'Faculty',
      required: [true, 'Faculties is a required field'],
    },
  },
  { timestamps: true },
);

courseFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const doesCourseExistOrNot = await Course.findOne(query);

  if (!doesCourseExistOrNot) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found');
  }

  next();
});

export const CourseFaculty = model<TCourseFaculty>(
  'Course_Faculty',
  courseFacultySchema,
);
