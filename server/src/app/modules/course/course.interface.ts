import { Types } from 'mongoose';

export type TCourseTitle =
  | 'Basic Computer Skill'
  | 'Hyper Text Markup Language'
  | 'Cascading Style Sheet'
  | 'Bootstrap'
  | 'Tailwind CSS'
  | 'Daisy UI'
  | 'Basic JavaScript'
  | 'Problem Solving with JS'
  | 'DOM Manipulation'
  | 'Basic React'
  | 'React Router DOM'
  | 'Firebase Authentication'
  | 'Basic Express';

export type TCoursePrefix =
  | 'BASIC'
  | 'HTML'
  | 'CSS'
  | 'JS'
  | 'REACT'
  | 'FIREBASE'
  | 'EXPRESS';

export type TCourseCode =
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112;

export type TPrerequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  title: TCourseTitle;
  prefix: TCoursePrefix;
  code: TCourseCode;
  credits: number;
  prerequisiteCourses?: [TPrerequisiteCourses];
  isDeleted: boolean;
};

export type TUpdateCourse = Partial<Omit<TCourse, 'isDeleted'>>;

export type TCourseTitlePrefixMapper = {
  BASIC: ['Basic Computer Skill'];
  HTML: ['Hyper Text Markup Language'];
  CSS: ['Cascading Style Sheet', 'Bootstrap', 'Tailwind CSS', 'Daisy UI'];
  JS: ['Basic JavaScript', 'Problem Solving with JS', 'DOM Manipulation'];
  REACT: ['Basic React', 'React Router DOM'];
  FIREBASE: ['Firebase Authentication'];
  EXPRESS: ['Basic Express'];
};

export type TCourseFaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
