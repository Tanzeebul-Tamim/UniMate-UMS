import { Model, Types } from 'mongoose';
import {
  TName,
  TGender,
  TBloodGroup,
  TNationality,
  TReligion,
} from '../../interface/common';

export type TDesignation =
  | 'system administrator'
  | 'database administrator'
  | 'network administrator'
  | 'security administrator'
  | 'IT administrator'
  | 'academic administrator'
  | 'admissions administrator'
  | 'finance administrator'
  | 'registrar';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: TDesignation;
  name: TName;
  gender: TGender;
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  joiningDate: Date;
  nationality: TNationality;
  religion: TReligion;
  isDeleted: boolean;
};

//* For creating static
export interface AdminModel extends Model<TAdmin> {
  // eslint-disable-next-line no-unused-vars
  doesUserExist(id: string): Promise<TAdmin | null>;
}
