export type TManagementDepartmentName =
  | 'Administrative Department'
  | 'Financial Department'
  | 'Facilities Management Department'
  | 'Information Technology Department'
  | 'Research Management Department'
  | 'Marketing and Communications Department';

export type TManagementDepartment = {
  name: TManagementDepartmentName;
};
