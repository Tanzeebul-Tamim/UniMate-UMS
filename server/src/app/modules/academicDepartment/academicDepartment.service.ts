import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { createDepartmentFacultyValidation } from './academicDepartment.utils';
import { AcademicDepartmentSearchableFields } from './academicDepartment.constant';
import { TAcademicDepartment, TUpdateAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const academicFaculty = await AcademicFaculty.findById(
    payload?.academicFaculty,
  );

  //* Check if the academic-faculty exists or not
  if (!academicFaculty) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Faculty not found!');
  }

  const departmentFacultyValidation = createDepartmentFacultyValidation({
    facultyName: academicFaculty?.name,
    departmentName: payload.name,
  });

  if (departmentFacultyValidation) {
    const result = (await AcademicDepartment.create(payload)).populate(
      'academicFaculty',
    );

    return result;
  }
};

const getAllAcademicDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find(),
    query,
  )
    .search(AcademicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicDepartmentQuery.modelQuery.populate({
    path: 'academicFaculty',
    select: 'name',
  });
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id).populate({
    path: 'academicFaculty',
    select: 'name',
  });
  return result;
};

const updateAnAcademicDepartmentIntoDB = async (
  id: string,
  payload: TUpdateAcademicDepartment,
) => {
  restrictFieldsValidator(payload, AcademicDepartmentSearchableFields);
  const result = await AcademicDepartment.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate({
    path: 'academicFaculty',
    select: 'name',
  });
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getAnAcademicDepartmentFromDB,
  updateAnAcademicDepartmentIntoDB,
};
