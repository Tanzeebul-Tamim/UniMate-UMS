import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  TCourse,
  TCoursePrefix,
  TCourseTitle,
  TCourseTitlePrefixMapper,
} from './course.interface';

//* Mappers
const courseTitlePrefixMapper: TCourseTitlePrefixMapper = {
  BASIC: ['Basic Computer Skill'],
  HTML: ['Hyper Text Markup Language'],
  CSS: ['Cascading Style Sheet', 'Bootstrap', 'Tailwind CSS', 'Daisy UI'],
  JS: ['Basic JavaScript', 'Problem Solving with JS', 'DOM Manipulation'],
  REACT: ['Basic React', 'React Router DOM'],
  FIREBASE: ['Firebase Authentication'],
  EXPRESS: ['Basic Express'],
};

//! For creating a course
//* title-prefix validation
export const createTitlePrefixValidator = (payload: TCourse) => {
  const titles: TCourseTitle[] =
    courseTitlePrefixMapper[payload.prefix as TCoursePrefix];

  if (!titles.includes(payload.title)) {
    let prefix: TCoursePrefix | null = null;

    for (const key in courseTitlePrefixMapper) {
      const titles: TCourseTitle[] =
        courseTitlePrefixMapper[key as TCoursePrefix];
      if (titles.includes(payload.title)) {
        prefix = key as TCoursePrefix;
        break;
      }
    }

    if (prefix === null) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        `Invalid course prefix. Valid course prefix for ${payload.title} is not found`,
      );
    }

    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `Invalid course prefix. Valid course prefix for ${payload.title} is ${prefix}`,
    );
  }
};

//! For updating a course
//* return valid prefix according to the course-title
export const updateTitlePrefixValidator = (payload: Partial<TCourse>) => {
  if (payload.title && !payload.prefix) {
    let prefix: TCoursePrefix | null = null;

    for (const key in courseTitlePrefixMapper) {
      const titles: TCourseTitle[] =
        courseTitlePrefixMapper[key as TCoursePrefix];
      if (titles.includes(payload.title)) {
        prefix = key as TCoursePrefix;
        break;
      }
    }

    if (prefix === null) {
      throw new AppError(
        httpStatus.BAD_GATEWAY,
        `Valid course prefix for ${payload.title} is not found`,
      );
    }

    return prefix;
  } else if (!payload.title && payload.prefix) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Please enter the valid title and prefix combination`,
    );
  } else if (payload.title && payload.prefix) {
    createTitlePrefixValidator(payload as TCourse);
  }
};
