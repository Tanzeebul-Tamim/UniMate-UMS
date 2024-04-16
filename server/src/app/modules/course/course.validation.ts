import { z } from 'zod';
import { CoursePrefixes, CourseTitles } from './course.constant';

const prerequisiteCoursesValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().default(false),
});

export const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.enum([...CourseTitles] as [string, ...string[]]),
    prefix: z.enum([...CoursePrefixes] as [string, ...string[]]),
    code: z.number(),
    credits: z.number(),
    prerequisiteCourse: z.array(prerequisiteCoursesValidationSchema).optional(),
    isDeleted: z.boolean().default(false),
  }),
});

export const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.enum([...CourseTitles] as [string, ...string[]]).optional(),
    prefix: z.enum([...CoursePrefixes] as [string, ...string[]]).optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    prerequisiteCourse: z.array(prerequisiteCoursesValidationSchema).optional(),
  }),
});

export const facultiesCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidations = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
  facultiesCourseValidationSchema,
};
