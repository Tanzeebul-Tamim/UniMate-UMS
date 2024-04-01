import QueryBuilder from '../../builder/QueryBuilder';
import {
  createNameCodeValidation,
  createNameMonthValidation,
  updateCodeMonthValidation,
  updateNameCodeValidation,
  updateNameMonthValidation,
} from './academicSemester.alignmentValidation';
import { AcademicSemesterSearchableFields } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  createNameCodeValidation(payload);
  createNameMonthValidation(payload);

  const result = await AcademicSemester.create(payload);

  return result;
};

const getAllAcademicSemestersFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicSemesterQuery.modelQuery;

  return result;
};

const getAnAcademicSemesterFromDB = async (id: string) => {
  const result = await AcademicSemester.findOne({ _id: id });
  return result;
};

const updateAnAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  updateNameCodeValidation(payload);
  updateNameMonthValidation(payload);
  updateCodeMonthValidation(payload);

  const result = await AcademicSemester.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
  updateAnAcademicSemesterIntoDB,
};
