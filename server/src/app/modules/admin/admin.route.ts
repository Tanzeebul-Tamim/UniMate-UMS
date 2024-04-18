import express from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateAdminValidationSchema } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmins);

router.get('/:adminId', AdminControllers.getAnAdmin);

router.patch(
  '/:adminId',
  validateRequest(updateAdminValidationSchema),
  AdminControllers.updateAnAdmin,
);

router.delete('/:adminId', AdminControllers.deleteAnAdmin);

export const AdminRoutes = router;
