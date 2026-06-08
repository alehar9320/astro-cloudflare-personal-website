import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const collections = {
  work: defineCollection({
    // Load Markdown files in the src/content/work directory.
    loader: glob({ base: './src/content/work', pattern: '**/*.md' }),
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishDate: z.coerce.date(),
      tags: z.array(z.string()),
      img: z.string(),
      img_alt: z.string().min(1),
    }),
  }),
  flags: defineCollection({
    loader: glob({ base: './src/content/flags', pattern: '**/*.json' }),
    schema: z.object({
      portfolio_tactile_v1: z.boolean().default(false),
      enable_strategic_pulse: z.boolean().default(false),
      portfolio_shimmer_v1: z.boolean().default(false),
      enable_product_manifesto: z.boolean().default(false),
      enable_skills_pulse_v1: z.boolean().default(false),
      enable_reading_list: z.boolean().default(false),
    }),
  }),
};
