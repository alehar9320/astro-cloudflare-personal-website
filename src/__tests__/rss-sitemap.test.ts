import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET as getRSS } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';
import { getCollection } from 'astro:content';

type GetContext = Parameters<typeof getRSS>[0];

function createContext(url = 'https://me.alehar.workers.dev/rss.xml') {
  return {
    request: new Request(url),
    locals: {},
  } as unknown as GetContext;
}

const mockWorkCollection = [
  {
    id: 'ifs-design-system',
    data: {
      title: 'IFS & Design System <Demo>',
      description: 'A system for enterprise UX & components.',
      publishDate: new Date('2024-06-01T10:00:00Z'),
    },
  },
  {
    id: 'lidkoping-stenhuggeri',
    data: {
      title: 'Lidköping Stenhuggeri',
      description: 'Local stone craftsmanship website.',
      publishDate: new Date('2023-01-01T10:00:00Z'),
    },
  },
];

describe('rss.xml and sitemap.xml route endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('rss.xml GET', () => {
    it('generates valid RSS XML feed, escaping characters and filtering excluded items', async () => {
      vi.mocked(getCollection).mockResolvedValue(
        mockWorkCollection as unknown as Awaited<ReturnType<typeof getCollection>>
      );

      const response = await getRSS(createContext());
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');
      expect(xml).toContain('IFS &amp; Design System &lt;Demo&gt;');
      expect(xml).toContain('https://me.alehar.workers.dev/work/ifs-design-system/');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
      expect(xml).toContain('<pubDate>Sat, 01 Jun 2024 10:00:00 GMT</pubDate>');
    });
  });

  describe('sitemap.xml GET', () => {
    it('generates valid sitemap XML including static paths and work collection items', async () => {
      vi.mocked(getCollection).mockResolvedValue(
        mockWorkCollection as unknown as Awaited<ReturnType<typeof getCollection>>
      );

      const response = await getSitemap(createContext('https://me.alehar.workers.dev/sitemap.xml'));
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2024-06-01</lastmod>');
      expect(xml).not.toContain('lidkoping-stenhuggeri');
    });
  });
});
