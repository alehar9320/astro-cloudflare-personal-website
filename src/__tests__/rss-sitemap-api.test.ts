import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCollection } from 'astro:content';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

describe('RSS and Sitemap Route Endpoints', () => {
  const mockWorkEntries = [
    {
      id: 'ifs-design-system',
      data: {
        title: 'IFS Design System & UX',
        description: 'Design system <designing> "scale" & \'efficiency\'',
        publishDate: new Date('2024-03-15T00:00:00Z'),
      },
    },
    {
      id: 'lidkoping-stenhuggeri',
      data: {
        title: 'Lidköping Stenhuggeri',
        description: 'E-commerce platform',
        publishDate: new Date('2020-01-01T00:00:00Z'),
      },
    },
    {
      id: 'developer-experience',
      data: {
        title: 'Developer Experience Platform',
        description: 'Internal developer platform tools',
        publishDate: new Date('2025-02-10T00:00:00Z'),
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rss.xml.ts GET handler', () => {
    it('returns a valid RSS XML response with correctly formatted and escaped entries', async () => {
      vi.mocked(getCollection).mockResolvedValue(mockWorkEntries as never);

      const response = await getRss({} as never);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');

      // Escaping check: & -> &amp;, < -> &lt;, > -> &gt;, " -> &quot;, ' -> &apos;
      expect(xml).toContain(
        'Design system &lt;designing&gt; &quot;scale&quot; &amp; &apos;efficiency&apos;'
      );

      // Excluded entry check
      expect(xml).not.toContain('lidkoping-stenhuggeri');

      // Order check: developer-experience (2025-02-10) should precede ifs-design-system (2024-03-15)
      const devExpIndex = xml.indexOf('Developer Experience Platform');
      const ifsIndex = xml.indexOf('IFS Design System &amp; UX');
      expect(devExpIndex).toBeGreaterThan(-1);
      expect(ifsIndex).toBeGreaterThan(-1);
      expect(devExpIndex).toBeLessThan(ifsIndex);
    });
  });

  describe('sitemap.xml.ts GET handler', () => {
    it('returns a valid Sitemap XML response with static and dynamic work paths', async () => {
      vi.mocked(getCollection).mockResolvedValue(mockWorkEntries as never);

      const response = await getSitemap({} as never);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

      // Static paths
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/contact/</loc>');

      // Dynamic work paths & ISO lastmod formatting
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2024-03-15</lastmod>');

      // Excluded entry check
      expect(xml).not.toContain('lidkoping-stenhuggeri');
    });
  });
});
