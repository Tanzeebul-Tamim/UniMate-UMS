import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);

router.get('/:courseId', CourseControllers.getACourse);

router.get('/faculties/:courseId', CourseControllers.getAssignedFacultiesOfACourse);

router.patch(
  '/:courseId',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateACourse,
);

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.facultiesCourseValidationSchema),
  CourseControllers.assignFacultiesIntoCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.facultiesCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

router.delete('/:courseId', CourseControllers.deleteACourse);

export const CourseRoutes = router;
