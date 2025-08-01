import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { TCourseFaculty } from '../course/course.interface';
import { Course, CourseFaculty } from '../course/course.model';
import AppError from '../../errors/AppError';

//* Get the assigned courses of a faculty
export const getFacultyAssignedCourses = async (facultyID: Types.ObjectId) => {
  const facultyId = facultyID.toString();
  const courseFacultyInfo: TCourseFaculty[] = await CourseFaculty.find();

  if (courseFacultyInfo.length !== 0) {
    const assignedCourseFaculties: TCourseFaculty[] = courseFacultyInfo.filter(
      (elem) => {
        const facultyIDs = elem.faculties.map((id) => String(id));
        return facultyIDs.includes(facultyId);
      },
    );

    if (assignedCourseFaculties.length > 0) {
      const courseInfo = await Promise.all(
        assignedCourseFaculties.map(async (elem) => {
          const course = await Course.findById(elem.course);
          return course;
        }),
      );
      return courseInfo;
    } else {
      throw new AppError(httpStatus.NOT_FOUND, 'No assigned courses found!');
    }
  } else {
    throw new AppError(httpStatus.NOT_FOUND, 'No documents found!');
  }
};
