import { Model, Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGender = 'male' | 'female' | 'others';

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
  | 'Jainism'
  | 'Shinto'
  | 'Taoism'
  | 'Zoroastrianism';

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TName;
  gender: TGender;
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
  academicDepartment: Types.ObjectId;
  nationality: TNationality;
  religion: TReligion;
  isDeleted: boolean;
};

//* For creating static
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  doesUserExist(id: string): Promise<TStudent | null>;
}
