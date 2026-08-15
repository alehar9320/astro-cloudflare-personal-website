import { beforeEach, describe, expect, it, vi } from 'vitest';
import { env as workerEnv } from 'cloudflare:workers';
import { GET, HOGQL } from '../pages/api/visits';

type VisitEnv = {
  POSTHOG_PERSONAL_API_KEY?: string;
  POSTHOG_PROJECT_ID?: string;
  POSTHOG_QUERY_HOST?: string;
};

describe('visits API', () => {
  beforeEach(() => {
    const bindings = workerEnv as VisitEnv;
    delete bindings.POSTHOG_PERSONAL_API_KEY;
    delete bindings.POSTHOG_PROJECT_ID;
    delete bindings.POSTHOG_QUERY_HOST;
  });

  it('uses one HogQL query for pageviews, uniques, first seen, and 7d splits', () => {
    expect(HOGQL.match(/SELECT/g)?.length).toBe(1);
    expect(HOGQL).toContain("event = '$pageview'");
    expect(HOGQL).toContain('unique_visitors');
    expect(HOGQL).toContain('first_seen');
    expect(HOGQL).toContain('pageviews_7d');
    expect(HOGQL).toContain('INTERVAL 7 DAY');
  });

  it('returns 204 when the PostHog key is missing', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const response = await GET({} as Parameters<typeof GET>[0]);
    expect(response.status).toBe(204);
  });
});
