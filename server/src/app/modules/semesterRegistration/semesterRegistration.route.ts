import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations);

router.get(
  '/:semesterRegistrationId',
  SemesterRegistrationControllers.getASemesterRegistration,
);

router.patch(
  '/:semesterRegistrationId',
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateASemesterRegistration,
);

router.patch(
  '/update/status',
  SemesterRegistrationControllers.updateAllSemesterRegistrationsStatuses,
);

export const SemesterRegistrationRoutes = router;
