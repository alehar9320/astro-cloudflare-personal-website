import type { APIContext } from 'astro';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';
import { getCollection } from 'astro:content';

const mockGetCollection = vi.mocked(getCollection);

interface WorkEntry {
  id: string;
  data: {
    title?: string;
    description?: string;
    publishDate?: Date;
  };
}

describe('RSS and Sitemap endpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('rss.xml GET', () => {
    it('returns an XML RSS feed with formatted items and excludes forbidden entries', async () => {
      const mockEntries: WorkEntry[] = [
        {
          id: 'ifs-design-system',
          data: {
            title: 'IFS Design System & <UI>',
            description: 'Design system for IFS & Enterprise Software',
            publishDate: new Date('2025-06-15T00:00:00.000Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            title: 'Lidköping Stenhuggeri',
            description: 'Excluded entry',
            publishDate: new Date('2024-01-01T00:00:00.000Z'),
          },
        },
      ];

      mockGetCollection.mockResolvedValueOnce(
        mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
      );

      const response = await getRss({} as APIContext);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('<title>IFS Design System &amp; &lt;UI&gt;</title>');
      expect(xml).toContain('https://me.alehar.workers.dev/work/ifs-design-system/');
      expect(xml).toContain('<pubDate>Sun, 15 Jun 2025 00:00:00 GMT</pubDate>');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
    });

    it('handles items without publishDate gracefully', async () => {
      const mockEntries: WorkEntry[] = [
        {
          id: 'undated-work',
          data: {
            title: 'Undated Project',
            description: 'No date provided',
            publishDate: undefined,
          },
        },
      ];

      mockGetCollection.mockResolvedValueOnce(
        mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
      );

      const response = await getRss({} as APIContext);
      const xml = await response.text();
      expect(xml).toContain('<title>Undated Project</title>');
      expect(xml).not.toContain('<pubDate>');
    });
  });

  describe('sitemap.xml GET', () => {
    it('returns a valid sitemap urlset with static paths and dynamic work paths', async () => {
      const mockEntries: WorkEntry[] = [
        {
          id: 'ifs-design-system',
          data: {
            publishDate: new Date('2025-06-15T00:00:00.000Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            publishDate: new Date('2024-01-01T00:00:00.000Z'),
          },
        },
      ];

      mockGetCollection.mockResolvedValueOnce(
        mockEntries as unknown as Awaited<ReturnType<typeof getCollection>>
      );

      const response = await getSitemap({} as APIContext);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2025-06-15</lastmod>');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
    });
  });
});
