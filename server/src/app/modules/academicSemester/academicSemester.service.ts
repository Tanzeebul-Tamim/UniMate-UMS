import QueryBuilder from '../../builder/QueryBuilder';
import {
  createNameCodeValidator,
  createNameMonthValidator,
  updateWithValidInfo,
} from './academicSemester.utils';
import {
  AcademicSemesterSearchableFields,
  AcademicSemesterUpdatableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';
import { restrictFieldsValidator } from '../../utils/restrictFieldsForUpdate';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  createNameCodeValidator(payload);
  createNameMonthValidator(payload);

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
  const result = await AcademicSemester.findById(id);
  return result;
};

const updateAnAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<TAcademicSemester>,
) => {
  restrictFieldsValidator(payload, AcademicSemesterUpdatableFields);
  const getSemesterInfo = (await AcademicSemester.findById(
    id,
  )) as TAcademicSemester;

  const updatedSemester = updateWithValidInfo(payload, getSemesterInfo);

  const result = await AcademicSemester.findByIdAndUpdate(id, updatedSemester, {
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
