import { PostHog } from 'posthog-node';
import { z } from 'zod';

let posthogClient: PostHog | null = null;

const PostHogConfigSchema = z.object({
  key: z.string().min(1),
  host: z.string().url().optional(),
});

export function getPostHogClient(): PostHog | null {
  const env = {
    key: import.meta.env.PUBLIC_POSTHOG_KEY,
    host: import.meta.env.PUBLIC_POSTHOG_HOST,
  };

  const result = PostHogConfigSchema.safeParse(env);

  if (!result.success) {
    // Only log if the key is present but invalid (e.g. empty string)
    if (env.key) {
      console.error('Invalid PostHog configuration:', result.error.format());
    }
    return null;
  }

  const { key, host } = result.data;

  if (!posthogClient) {
    posthogClient = new PostHog(key, {
      host,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}
