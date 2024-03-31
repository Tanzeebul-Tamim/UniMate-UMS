import {
  TBloodGroup,
  TGender,
  TNationality,
  TReligion,
} from './student.interface';

export const Genders: TGender[] = ['male', 'female', 'others'];

export const BloodGroups: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const Nationalities: TNationality[] = [
  'American',
  'British',
  'Canadian',
  'Chinese',
  'French',
  'German',
  'Indian',
  'Italian',
  'Japanese',
  'Russian',
  'Spanish',
  'Swiss',
  'Australian',
  'Brazilian',
  'Mexican',
  'South Korean',
  'Turkish',
  'Bangladeshi',
];

export const Religions: TReligion[] = [
  'Christianity',
  'Islam',
  'Hinduism',
  'Buddhism',
  'Judaism',
  'Sikhism',
  'Jainism',
  'Shinto',
  'Taoism',
  'Zoroastrianism',
];

export const StudentSearchableFields = [
  'name.firstName',
  'name.middleName',
  'name.lastName',
  'gender',
  'email',
  'contactNo',
  'emergencyContactNo',
  'presentAddress',
  'permanentAddress',
  'guardian.father.name.firstName',
  'guardian.father.name.middleName',
  'guardian.father.name.lastName',
  'guardian.father.occupation',
  'guardian.father.contactNo',
  'guardian.mother.name.firstName',
  'guardian.mother.name.middleName',
  'guardian.mother.name.lastName',
  'guardian.mother.occupation',
  'guardian.mother.contactNo',
  'localGuardian.name.firstName',
  'localGuardian.name.middleName',
  'localGuardian.name.lastName',
  'localGuardian.occupation',
  'localGuardian.contactNo',
  'localGuardian.address',
  'localGuardian.relationship',
  'nationality',
  'religion',
];
