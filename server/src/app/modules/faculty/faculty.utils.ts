import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Course, CourseFaculty } from '../course/course.model';
import { Types } from 'mongoose';

export const getFacultyAssignedCourses = async (facultyID: Types.ObjectId) => {
  const facultyId = facultyID.toString();
  const courseFacultyInfo = await CourseFaculty.find();

  if (courseFacultyInfo.length !== 0) {
    const filteredCourseFaculty = courseFacultyInfo.filter((elem) => {
      const facultyIDs = elem.faculties.map((id) => String(id));
      return facultyIDs.includes(facultyId);
    });

    if (filteredCourseFaculty.length > 0) {
      const courseInfo = await Promise.all(
        filteredCourseFaculty.map(
          async (elem) => await Course.findById(elem.course),
        ),
      );
      return courseInfo;
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'No assigned courses found');
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'No documents found');
  }
};
