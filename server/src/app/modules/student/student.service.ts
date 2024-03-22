import { TStudent } from './student.interface';
import { Student } from './student.model';

const getAllStudentFromDB = async () => {
  const result = await Student.find();
  return result;
};

const getAStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ _id: id });
  return result;
};

const updateAStudentFromDB = async (id: string, payload: Partial<TStudent>) => {
  const result = await Student.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return result;
};

const deleteAStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ _id: id }, { isDeleted: true });
  return result;
};

export const StudentServices = {
  getAllStudentFromDB,
  getAStudentFromDB,
  updateAStudentFromDB,
  deleteAStudentFromDB,
};
