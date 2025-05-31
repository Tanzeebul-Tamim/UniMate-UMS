import { Schema, model } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TCourse } from '../course/course.interface';
import { TSemesterRegistrationDB } from '../semesterRegistration/semesterRegistration.interface';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'Semester_Registration',
      required: [true, 'Semester registration is required'],
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Semester',
      required: [true, 'Academic semester is required'],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Faculty',
      required: [true, 'Academic faculty is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'Academic_Department',
      required: [true, 'Academic department is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
    maxCapacity: {
      type: Number,
      default: 30,
    },
    remainingCapacity: {
      type: Number,
      default: 30,
    },
    section: {
      type: Number,
      required: [true, 'Section is required'],
    },
    days: {
      type: [String],
      enum: Days,
      required: [true, 'Days is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
  },
  { timestamps: true },
);

offeredCourseSchema.pre('save', async function (next) {
  try {
    const doesSemesterRegistrationExist = await OfferedCourse.findOne({
      section: this.section,
      course: this.course,
      semesterRegistration: this.semesterRegistration,
    })
      .populate({ path: 'course', select: ['prefix', 'code'] })
      .populate({
        path: 'semesterRegistration',
        populate: { path: 'academicSemester', select: ['name', 'year'] },
      });

    if (doesSemesterRegistrationExist) {
      const section = this.section;

      const course = doesSemesterRegistrationExist.course as unknown as TCourse;
      const courseCode = `${course.prefix}${course.code}`;

      const semesterRegistration =
        doesSemesterRegistrationExist.semesterRegistration as unknown as TSemesterRegistrationDB;
      const academicSemester =
        semesterRegistration.academicSemester as unknown as TAcademicSemester;
      const semesterName = `${academicSemester.name}${academicSemester.year}`;

      throw new AppError(
        httpStatus.CONFLICT,
        `Section ${section} has already been offered on ${courseCode} course for ${semesterName} semester`,
      );
    }
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else if (error instanceof Error) {
      next(new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(
        new AppError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'An unexpected error occurred!',
        ),
      );
    }
  }
});

export const OfferedCourse = model<TOfferedCourse>(
  'Offered_Course',
  offeredCourseSchema,
);
