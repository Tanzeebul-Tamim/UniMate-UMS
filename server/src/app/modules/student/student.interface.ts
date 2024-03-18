import { Model, Types } from 'mongoose';

export type TName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

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

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: TName;
  gender: 'male' | 'female' | 'others';
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  isDeleted: boolean;
};

//* For creating static
export interface StudentModel extends Model<TStudent> {
  doesUserExist(id: string): Promise<TStudent | null>;
}
