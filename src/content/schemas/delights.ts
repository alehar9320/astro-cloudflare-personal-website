import { z } from 'zod';
export const DelightSchema = z.object({ shimmer: z.boolean().default(false) });
