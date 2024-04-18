import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ManagementDepartmentValidations } from './managementDepartment.validation';
import { ManagementDepartmentControllers } from './managementDepartment.controller';

const router = express.Router();

router.post(
  '/create-management-department',
  validateRequest(
    ManagementDepartmentValidations.createUpdateManagementDepartmentValidationSchema,
  ),
  ManagementDepartmentControllers.createManagementDepartment,
);

router.get('/', ManagementDepartmentControllers.getAllManagementDepartments);

router.get(
  '/:departmentId',
  ManagementDepartmentControllers.getAManagementDepartment,
);

router.patch(
  '/:departmentId',
  validateRequest(
    ManagementDepartmentValidations.createUpdateManagementDepartmentValidationSchema,
  ),
  ManagementDepartmentControllers.updateAManagementDepartment,
);

export const ManagementDepartmentRoutes = router;
