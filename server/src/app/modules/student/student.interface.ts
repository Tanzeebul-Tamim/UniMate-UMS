import { Model, Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TIndividualGuardian = {
  name: TName;
  occupation: string;
  contactNo: string;
};

export type TGuardian = {
  father: TIndividualGuardian;
  mother: TIndividualGuardian;
};

export type TLocalGuardian = TIndividualGuardian & {
  address: string;
  relationship: string;
};

// export type TAcademicDepartment =
//   | 'Computer Science'
//   | 'Electrical Engineering'
//   | 'Mechanical Engineering'
//   | 'Civil Engineering'
//   | 'Biology'
//   | 'Chemistry'
//   | 'Physics'
//   | 'Mathematics'
//   | 'Business Administration'
//   | 'Economics'
//   | 'Psychology'
//   | 'Sociology'
//   | 'English Literature'
//   | 'History'
//   | 'Political Science'
//   | 'Environmental Science'
//   | 'Fine Arts'
//   | 'Music'
//   | 'Health Sciences'
//   | 'Linguistics';

export type TNationality =
  | 'American'
  | 'British'
  | 'Canadian'
  | 'Chinese'
  | 'French'
  | 'German'
  | 'Indian'
  | 'Italian'
  | 'Japanese'
  | 'Russian'
  | 'Spanish'
  | 'Swiss'
  | 'Australian'
  | 'Brazilian'
  | 'Mexican'
  | 'South Korean'
  | 'Turkish'
  | 'Bangladeshi';

export type TReligion =
  | 'Christianity'
  | 'Islam'
  | 'Hinduism'
  | 'Buddhism'
  | 'Judaism'
  | 'Sikhism'
  | "Bahá'í Faith"
  | 'Jainism'
  | 'Shinto'
  | 'Taoism'
  | 'Zoroastrianism';

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TName;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage?: string;
  admissionSemester: Types.ObjectId;
  // academicDepartment: Types.ObjectId;
  academicDepartment: string;
  nationality: TNationality;
  religion: TReligion;
};

//* For creating static
export interface StudentModel extends Model<TStudent> {
  doesUserExist(id: string): Promise<TStudent | null>;
}
