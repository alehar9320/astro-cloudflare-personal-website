import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';
import { getCollection } from 'astro:content';

type GetContext = Parameters<typeof getRss>[0];

function createContext(): GetContext {
  return {} as GetContext;
}

interface MockWorkEntry {
  id: string;
  data: {
    title: string;
    description: string;
    publishDate?: Date;
  };
}

describe('rss.xml route handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns formatted RSS feed XML with filtered, sorted items and escaping', async () => {
    const mockEntries: MockWorkEntry[] = [
      {
        id: 'older-item',
        data: {
          title: 'Older <Title> & "More"',
          description: "An 'older' item",
          publishDate: new Date('2025-01-01T00:00:00Z'),
        },
      },
      {
        id: 'newer-item',
        data: {
          title: 'Newer Title',
          description: 'A newer item',
          publishDate: new Date('2026-01-01T00:00:00Z'),
        },
      },
      {
        id: 'lidkoping-stenhuggeri',
        data: {
          title: 'Filtered Item',
          description: 'Should be excluded',
          publishDate: new Date('2026-02-01T00:00:00Z'),
        },
      },
    ];

    vi.mocked(getCollection).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
    );

    const response = await getRss(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
    expect(xml).toContain('Older &lt;Title&gt; &amp; &quot;More&quot;');
    expect(xml).toContain('An &apos;older&apos; item');

    const newerIndex = xml.indexOf('newer-item');
    const olderIndex = xml.indexOf('older-item');
    expect(newerIndex).toBeLessThan(olderIndex);
  });

  it('handles entries with missing or empty publishDate', async () => {
    const mockEntries: MockWorkEntry[] = [
      {
        id: 'no-date-item',
        data: {
          title: 'No Date Item',
          description: 'Item without publish date',
        },
      },
    ];

    vi.mocked(getCollection).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
    );

    const response = await getRss(createContext());
    const xml = await response.text();
    expect(xml).toContain('<title>No Date Item</title>');
    expect(xml).not.toContain('<pubDate>');
  });
});

describe('sitemap.xml route handler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns valid sitemap XML with static routes and work entries', async () => {
    const mockEntries: MockWorkEntry[] = [
      {
        id: 'ifs-design-system',
        data: {
          title: 'IFS Design System',
          description: 'Design system work',
          publishDate: new Date('2026-03-15T00:00:00Z'),
        },
      },
      {
        id: 'lidkoping-stenhuggeri',
        data: {
          title: 'Lidköping Stenhuggeri',
          description: 'Filtered work',
          publishDate: new Date('2026-03-15T00:00:00Z'),
        },
      },
    ];

    vi.mocked(getCollection).mockResolvedValue(
      mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
    );

    const response = await getSitemap(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
    expect(xml).toContain('<lastmod>2026-03-15</lastmod>');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
