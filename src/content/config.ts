import { defineCollection, z } from 'astro:content';

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

const isRealCalendarDate = (value: string) => {
  if (!dateFormatRegex.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string()
      .regex(dateFormatRegex, 'Date must use YYYY-MM-DD format')
      .refine(isRealCalendarDate, 'Date must be a valid calendar date'),
    author: z.string().default('Pascal Riester'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(),
    canonical: z.string().optional(),
    mediumUrl: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
