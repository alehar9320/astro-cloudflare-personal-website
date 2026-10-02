import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET, prerender } from '../pages/sitemap.xml';
import { getCollection, type CollectionEntry } from 'astro:content';

type GetContext = Parameters<typeof GET>[0];

function createContext(request = new Request('https://me.alehar.workers.dev/sitemap.xml')) {
  return {
    request,
    locals: {},
  } as unknown as GetContext;
}

describe('sitemap.xml route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports prerender as true', () => {
    expect(prerender).toBe(true);
  });

  it('returns valid Sitemap XML with static paths and work collection items', async () => {
    const mockWorkItems = [
      {
        id: 'ifs-design-system',
        data: {
          publishDate: new Date('2025-06-01T12:34:56Z'),
        },
      },
      {
        id: 'lidkoping-stenhuggeri',
        data: {
          publishDate: new Date('2023-01-01T00:00:00Z'),
        },
      },
    ] as unknown as CollectionEntry<'work'>[];

    vi.mocked(getCollection).mockResolvedValue(mockWorkItems);

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    // Static paths
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/contact/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/this-site/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/roadmap/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/okr/</loc>');

    // Work paths & lastmod formatting (YYYY-MM-DD)
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
    expect(xml).toContain('<lastmod>2025-06-01</lastmod>');

    // Filtered item
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
