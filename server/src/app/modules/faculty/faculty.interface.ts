import { Model, Types } from 'mongoose';
import {
  TName,
  TGender,
  TBloodGroup,
  TNationality,
  TReligion,
} from '../../interface/common';

export type TDesignation =
  | 'professor'
  | 'associate professor'
  | 'assistant professor'
  | 'lecturer'
  | 'research professor'
  | 'adjunct professor'
  | 'visiting professor'
  | 'dean'
  | 'department chair'
  | 'instructor'
  | 'research associate'
  | 'postdoctoral researcher'
  | 'graduate assistant'
  | 'teaching assistant'
  | 'lab manager';

export type TFaculty = {
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
  academicDepartment: Types.ObjectId;
  joiningDate: Date;
  nationality: TNationality;
  religion: TReligion;
  isDeleted: boolean;
};

type TExcludeProperties =
  | 'id'
  | 'user'
  | 'designation'
  | 'gender'
  | 'dateOfBirth'
  | 'email'
  | 'bloodGroup'
  | 'nationality'
  | 'religion'
  | 'joiningDate'
  | 'academicDepartment'
  | 'isDeleted';

export type TUpdateFaculty = Omit<TFaculty, TExcludeProperties>;

//* For creating static
export interface FacultyModel extends Model<TFaculty> {
  // eslint-disable-next-line no-unused-vars
  doesUserExist(id: string): Promise<TFaculty | null>;
}
