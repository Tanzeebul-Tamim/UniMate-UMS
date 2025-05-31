import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateFacultyValidationSchema } from './faculty.validation';

const router = express.Router();

router.get('/', FacultyControllers.getAllFaculties);

router.get('/:facultyId', FacultyControllers.getAFaculty);

router.get(
  '/courses/:facultyId',
  FacultyControllers.getAssignedCoursesOfAFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateAFaculty,
);

router.delete('/:facultyId', FacultyControllers.deleteAFaculty);

export const FacultyRoutes = router;
