import { TCourseCode, TCoursePrefix, TCourseTitle } from './course.interface';

export const CourseTitles: TCourseTitle[] = [
  'Basic Computer Skill',
  'Hyper Text Markup Language',
  'Cascading Style Sheet',
  'Bootstrap',
  'Tailwind CSS',
  'Daisy UI',
  'Basic JavaScript',
  'Problem Solving with JS',
  'DOM Manipulation',
  'Basic React',
  'React Router DOM',
  'Firebase Authentication',
  'Basic Express',
];

export const CoursePrefixes: TCoursePrefix[] = [
  'BASIC',
  'HTML',
  'CSS',
  'JS',
  'REACT',
  'FIREBASE',
  'EXPRESS',
];

export const CourseCodes: TCourseCode[] = [];

for (let i = 100; i < 113; i++) {
  CourseCodes.push(i as TCourseCode);
}

export const CourseSearchableFields = ['title', 'prefix', 'code'];
