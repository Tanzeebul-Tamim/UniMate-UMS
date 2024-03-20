import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

//* Find the Student ID of the last enrolled student
const findLastEnrolledStudentID = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

//* Generate student ID which consists of year, semester code & 4 digit serial number
export const generatedStudentID = async (
  payload: TAcademicSemester,
): Promise<string> => {
  const currentID =
    (await findLastEnrolledStudentID()) || (0).toString().padStart(4, '0');
  let incrementedID = (parseInt(currentID) + 1).toString().padStart(4, '0');
  incrementedID = `${payload.year}${payload.code}${incrementedID}`;
  return incrementedID;
};
