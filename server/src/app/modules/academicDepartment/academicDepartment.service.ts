import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findOne({ _id: id });
  return result;
};

const updateAnAcademicDepartmentIntoDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );

  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getAnAcademicDepartmentFromDB,
  updateAnAcademicDepartmentIntoDB,
};
