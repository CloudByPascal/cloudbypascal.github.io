import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
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
