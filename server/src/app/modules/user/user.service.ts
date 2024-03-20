import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  //* Create a user object
  const userData: Partial<TUser> = {};

  //* If the password isn't given, use the default password
  userData.password = password || (config.default_pass as string);

  //* Set student role
  userData.role = 'student';

  //* Set manually generated ID
  userData.id = '2030100002';

  //* Create a user
  const newUser = await User.create(userData);

  //* Create a student
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference _id

    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};

export const UserServices = {
  createStudentIntoDB,
};
