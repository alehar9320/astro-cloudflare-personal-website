import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as astroContent from 'astro:content';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

type GetContext = Parameters<typeof getRss>[0];

function createContext() {
  return {
    request: new Request('https://me.alehar.workers.dev/'),
    locals: {},
  } as unknown as GetContext;
}

describe('RSS and Sitemap XML endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('rss.xml GET route', () => {
    it('returns a valid RSS XML document with items and escaping', async () => {
      const mockWorkEntries = [
        {
          id: 'ifs-design-system',
          data: {
            title: 'IFS Design System & "Atlas"',
            description: 'Scaling design system <components> & patterns.',
            publishDate: new Date('2024-05-15T00:00:00.000Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            title: 'Filtered Entry',
            description: 'Should be excluded',
            publishDate: new Date('2020-01-01T00:00:00.000Z'),
          },
        },
      ];

      vi.spyOn(astroContent, 'getCollection').mockResolvedValue(mockWorkEntries as never);

      const response = await getRss(createContext());
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain(
        '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
      );
      expect(xml).toContain('IFS Design System &amp; &quot;Atlas&quot;');
      expect(xml).toContain('Scaling design system &lt;components&gt; &amp; patterns.');
      expect(xml).toContain('<link>https://me.alehar.workers.dev/work/ifs-design-system/</link>');
      expect(xml).toContain('<pubDate>Wed, 15 May 2024 00:00:00 GMT</pubDate>');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
      expect(xml).not.toContain('Filtered Entry');
    });

    it('handles empty collection gracefully', async () => {
      vi.spyOn(astroContent, 'getCollection').mockResolvedValue([] as never);

      const response = await getRss(createContext());
      expect(response.status).toBe(200);
      const xml = await response.text();
      expect(xml).toContain('<channel>');
      expect(xml).toContain('</channel>');
      expect(xml).not.toContain('<item>');
    });
  });

  describe('sitemap.xml GET route', () => {
    it('returns a valid Sitemap XML document with static and work URLs', async () => {
      const mockWorkEntries = [
        {
          id: 'ifs-design-system',
          data: {
            publishDate: new Date('2024-05-15T00:00:00.000Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            publishDate: new Date('2020-01-01T00:00:00.000Z'),
          },
        },
      ];

      vi.spyOn(astroContent, 'getCollection').mockResolvedValue(mockWorkEntries as never);

      const response = await getSitemap(createContext());
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2024-05-15</lastmod>');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
    });
  });
});
