import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

//! For student ID generation

//* Find the Student ID of the last enrolled student
const findLastEnrolledStudentID = async () => {
  const lastStudent = await User.findOne({ role: 'student' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

//* Generate student ID which consists of admission year, semester code & 4 digit serial number
export const generatedStudentID = async (
  payload: TAcademicSemester,
): Promise<string> => {
  let currentID = (0).toString().padStart(4, '0');

  const lastStudentId = await findLastEnrolledStudentID();
  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const currentSemesterCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentID = lastStudentId.substring(6);
  }

  let incrementedID = (parseInt(currentID) + 1).toString().padStart(4, '0');
  incrementedID = `${payload.year}${payload.code}${incrementedID}`;

  return incrementedID;
};

//! For faculty ID generation

//* Find the Faculty ID of the last joined faculty
const findLastJoinedFacultyID = async () => {
  const lastFaculty = await User.findOne({ role: 'faculty' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

//* Generate faculty ID which consists of the letter "F" along with joining year, month & 4 digit serial number
export const generatedFacultyID = async (payload: Date): Promise<string> => {
  let currentID = (0).toString().padStart(4, '0');

  const lastFacultyId = await findLastJoinedFacultyID();
  const currentYear = payload.toString().substring(0, 4);
  const currentMonth = payload.toString().substring(5, 7);

  if (lastFacultyId) {
    currentID = lastFacultyId.substring(8);
  }

  let incrementedID = (parseInt(currentID) + 1).toString().padStart(4, '0');
  incrementedID = `F-${currentYear}${currentMonth}${incrementedID}`;

  return incrementedID;
};

//! For admin ID generation

//* Find the Admin ID of the last joined admin
const findLastJoinedAdminID = async () => {
  const lastAdmin = await User.findOne({ role: 'admin' }, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};

//* Generate faculty ID which consists of the letter "F" along with joining year, month & 4 digit serial number
export const generatedAdminID = async (payload: Date): Promise<string> => {
  let currentID = (0).toString().padStart(4, '0');

  const lastAdminId = await findLastJoinedAdminID();
  const currentYear = payload.toString().substring(0, 4);
  const currentMonth = payload.toString().substring(5, 7);

  if (lastAdminId) {
    currentID = lastAdminId.substring(8);
  }

  let incrementedID = (parseInt(currentID) + 1).toString().padStart(4, '0');
  incrementedID = `A-${currentYear}${currentMonth}${incrementedID}`;

  return incrementedID;
};
