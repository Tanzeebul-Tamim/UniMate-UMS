import { Model, Types } from 'mongoose';
import {
  TBloodGroup,
  TGender,
  TName,
  TNationality,
  TReligion,
} from '../../interface/common';

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
  name: TName;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImage: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  nationality: TNationality;
  religion: TReligion;
  isDeleted: boolean;
};

type TExcludeProperties =
  | 'id'
  | 'user'
  | 'gender'
  | 'dateOfBirth'
  | 'email'
  | 'bloodGroup'
  | 'nationality'
  | 'religion'
  | 'admissionSemester'
  | 'academicDepartment'
  | 'isDeleted';

export type TUpdateStudent = Partial<Omit<TStudent, TExcludeProperties>>;

//* For creating static
export interface StudentModel extends Model<TStudent> {
  // eslint-disable-next-line no-unused-vars
  doesUserExist(id: string): Promise<TStudent | null>;
}
