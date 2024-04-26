import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { createDepartmentFacultyValidation } from './academicDepartment.utils';
import {
  AcademicDepartmentSearchableFields,
  AcademicDepartmentUpdatableFields,
  academicDepartmentNameFacultyMapper,
} from './academicDepartment.constant';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TAcademicFacultyName } from '../academicFaculty/academicFaculty.interface';

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
    AcademicDepartment.find().populate({
      path: 'academicFaculty',
      select: 'name',
    }),
    query,
  )
    .search(AcademicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicDepartmentQuery.modelQuery;
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
  payload: Partial<TAcademicDepartment>,
) => {
  restrictFieldsValidator(payload, AcademicDepartmentUpdatableFields);

  let facultyName = '';

  //* Iterate through faculties and check if department belongs to any
  for (const faculty in academicDepartmentNameFacultyMapper) {
    if (faculty && payload && payload.name) {
      if (
        academicDepartmentNameFacultyMapper[
          faculty as TAcademicFacultyName
        ]?.includes(payload?.name)
      ) {
        facultyName = faculty;
        break;
      }
    }
  }

  const getAcademicFacultyInfo = await AcademicFaculty.findOne({
    name: facultyName,
  });

  if (getAcademicFacultyInfo) {
    payload.academicFaculty = getAcademicFacultyInfo._id;
  }

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
