import QueryBuilder from '../../builder/QueryBuilder';
import {
  createNameCodeValidator,
  createNameMonthValidator,
  updateAcademicSemesterWithValidInfo,
} from './academicSemester.utils';
import {
  AcademicSemesterSearchableFields,
  AcademicSemesterUpdatableFields,
} from './academicSemester.constant';
import {
  TAcademicSemester,
  TUpdateAcademicSemester,
} from './academicSemester.interface';
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
  payload: TUpdateAcademicSemester,
) => {
  restrictFieldsValidator(payload, AcademicSemesterUpdatableFields);
  
  const getSemesterInfo = (await AcademicSemester.findById(
    id,
  )) as TAcademicSemester;

  const updatedSemester = updateAcademicSemesterWithValidInfo(
    payload,
    getSemesterInfo,
  );

  const result = await AcademicSemester.findByIdAndUpdate(id, updatedSemester, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getAnAcademicSemesterFromDB,
  updateAnAcademicSemesterIntoDB,
};
