import { z } from 'zod';

/**
 * Hire-path conversion objects.
 *
 * Placeholders: swap `email` when a final address is ready. CV lives at
 * `/alexander-harenstam-cv.pdf` (placeholder PDF until a real file is supplied).
 * Email, CV, and availability copy are shown on `/contact` only.
 */
export const hireSchema = z.object({
  availability: z.string().min(1),
  email: z.string().email(),
  cvHref: z.string().min(1),
  cvLabel: z.string().min(1),
  linkedinHref: z.string().url(),
});

export const hire = hireSchema.parse({
  availability: 'Open to conversations about product leadership, DevEx, and Industrial AI.',
  email: 'hello@harenstam.com',
  cvHref: '/alexander-harenstam-cv.pdf',
  cvLabel: 'Download CV',
  linkedinHref: 'https://www.linkedin.com/in/alehar/',
});

export const hireMailto = `mailto:${hire.email}`;
