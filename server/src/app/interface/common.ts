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
