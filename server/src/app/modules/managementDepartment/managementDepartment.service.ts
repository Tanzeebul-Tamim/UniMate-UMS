import QueryBuilder from '../../builder/QueryBuilder';
import { ManagementDepartmentSearchableFields } from './managementDepartment.constant';
import { TManagementDepartment } from './managementDepartment.interface';
import { ManagementDepartment } from './managementDepartment.model';

const createManagementDepartmentIntoDB = async (
  payload: TManagementDepartment,
) => {
  const result = await ManagementDepartment.create(payload);
  return result;
};

const getAllManagementDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  const managementDepartmentQuery = new QueryBuilder(
    ManagementDepartment.find(),
    query,
  )
    .search(ManagementDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await managementDepartmentQuery.modelQuery;
  return result;
};

const getAManagementDepartmentFromDB = async (id: string) => {
  const result = await ManagementDepartment.findById(id);
  return result;
};

const updateAManagementDepartmentIntoDB = async (
  id: string,
  payload: TManagementDepartment,
) => {
  const result = await ManagementDepartment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const ManagementDepartmentServices = {
  createManagementDepartmentIntoDB,
  getAllManagementDepartmentsFromDB,
  getAManagementDepartmentFromDB,
  updateAManagementDepartmentIntoDB,
};
