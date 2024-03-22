import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';

const router = express.Router();

router.post(
  '/create-academic-department',
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);
router.get('/', AcademicDepartmentControllers.getAllAcademicDepartments);
router.get(
  '/:departmentId',
  AcademicDepartmentControllers.getAnAcademicDepartment,
);
router.patch(
  '/:departmentId',
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAnAcademicDepartment,
);

export const AcademicDepartmentRoutes = router;
