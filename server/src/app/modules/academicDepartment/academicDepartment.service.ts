import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';
import { createDepartmentFacultyValidation } from './academicDepartment.alignmentValidation';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const academicFaculty = await AcademicFaculty.findOne({
    _id: payload.academicFaculty,
  });

  if (academicFaculty) {
    const departmentFacultyValidation = createDepartmentFacultyValidation({
      facultyName: academicFaculty?.name,
      departmentName: payload.name,
    });

    if (departmentFacultyValidation) {
      const result = await AcademicDepartment.create(payload);
      return result;
    }
  } else {
    throw new Error('Academic Faculty not found!');
  }
};

const getAllAcademicDepartmentsFromDB = async () => {
  const result = await AcademicDepartment.find().populate({
    path: 'academicFaculty',
    select: 'name',
  });
  return result;
};

const getAnAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartment.findOne({ _id: id }).populate({
    path: 'academicFaculty',
    select: 'name',
  });
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
  ).populate({
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
