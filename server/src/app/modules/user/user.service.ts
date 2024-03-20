import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedStudentID } from './user.utils';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  //* Create a user object
  const userData: Partial<TUser> = {};

  //* If the password isn't given, use the default password
  userData.password = password || (config.default_pass as string);

  //* Set student role
  userData.role = 'student';

  //* Find academic semester information
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //* Set auto-generated ID
  userData.id = await generatedStudentID(admissionSemester as TAcademicSemester);

  //* Create a user
  const newUser = await User.create(userData);

  //* Create a student
  if (Object.keys(newUser).length) {
    payload.id = newUser.id;
    payload.user = newUser._id; // reference _id

    const newStudent = await Student.create(payload);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
