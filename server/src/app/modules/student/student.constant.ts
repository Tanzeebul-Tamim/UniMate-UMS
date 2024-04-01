import {
  TBloodGroup,
  TGender,
  TNationality,
  TReligion,
} from './student.interface';
import sampleStudent from '../../../../sample/student.json';
import { generateSearchableFields } from '../../utils/generateSearchableFields';

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

const studentFields = generateSearchableFields(sampleStudent);
const fieldsToRemove = [
  'dateOfBirth',
  'profileImage',
  'admissionSemester',
  'academicDepartment',
];
export const StudentSearchableFields = studentFields.filter(
  (field) => !fieldsToRemove.includes(field),
);
