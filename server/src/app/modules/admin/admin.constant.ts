import sampleAdmin from '../../../../sample/admin.json';
import { generateSearchableFields } from '../../utils/generateSearchableFields';
import { TDesignation } from './admin.interface';

export const Designations: TDesignation[] = [
  'system administrator',
  'database administrator',
  'network administrator',
  'security administrator',
  'IT administrator',
  'academic administrator',
  'admissions administrator',
  'finance administrator',
  'registrar',
];

const fields = generateSearchableFields(sampleAdmin);
const fieldsToRemove = [
  'dateOfBirth',
  'profileImage',
  'managementDepartment',
  'joiningDate',
];
export const AdminSearchableFields = fields.filter(
  (field) => !fieldsToRemove.includes(field),
);

export const AdminUpdatableFields: string[] = [
  'name',
  'contactNo',
  'emergencyContactNo',
  'presentAddress',
  'permanentAddress',
  'profileImage',
];