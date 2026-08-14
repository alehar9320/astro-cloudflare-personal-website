import { z } from 'zod';

/**
 * Hire-path conversion objects.
 *
 * `email` and `cvHref` are intentionally centralized so they can be swapped
 * when Alexander provides final copy or a PDF. No other file should hardcode
 * these values.
 */
export const hireSchema = z.object({
  status: z.literal('Available'),
  availability: z.string().min(1),
  email: z.string().email(),
  cvHref: z.string().min(1),
  cvLabel: z.string().min(1),
  linkedinHref: z.string().url(),
});

export const hire = hireSchema.parse({
  status: 'Available',
  availability: 'Open to product leadership conversations',
  email: 'hello@harenstam.com',
  cvHref: '/cv/',
  cvLabel: 'Download CV',
  linkedinHref: 'https://www.linkedin.com/in/alehar/',
});

export const hireMailto = `mailto:${hire.email}`;
