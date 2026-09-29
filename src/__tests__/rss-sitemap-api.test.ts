import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';
import { getCollection } from 'astro:content';

type WorkItem = {
  id: string;
  data: {
    title: string;
    description: string;
    publishDate?: Date;
  };
};

describe('rss.xml and sitemap.xml endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const sampleWorkEntries: WorkItem[] = [
    {
      id: 'ifs-design-system',
      data: {
        title: 'IFS Design System & <More>',
        description: 'From "v1" to IFS Cloud & beyond.',
        publishDate: new Date('2022-04-01T00:00:00.000Z'),
      },
    },
    {
      id: 'lidkoping-stenhuggeri',
      data: {
        title: 'Lidköping Stenhuggeri',
        description: 'Early Android work',
        publishDate: new Date('2013-09-01T00:00:00.000Z'),
      },
    },
    {
      id: 'ai-coding-copilots',
      data: {
        title: 'Internal AI coding copilots',
        description: "Copilots 'for' IFS engineering",
        publishDate: new Date('2025-02-01T00:00:00.000Z'),
      },
    },
  ];

  describe('rss.xml GET', () => {
    it('generates valid RSS 2.0 XML with escaped characters and excludes lidkoping-stenhuggeri', async () => {
      vi.mocked(getCollection).mockResolvedValue(sampleWorkEntries as never);

      const response = await getRss({} as never);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');

      // Escaped characters in title and description
      expect(xml).toContain('IFS Design System &amp; &lt;More&gt;');
      expect(xml).toContain('From &quot;v1&quot; to IFS Cloud &amp; beyond.');
      expect(xml).toContain('Copilots &apos;for&apos; IFS engineering');

      // Exclude lidkoping-stenhuggeri
      expect(xml).not.toContain('Lidköping Stenhuggeri');
      expect(xml).not.toContain('/work/lidkoping-stenhuggeri/');

      // Check item order (sorted descending by publishDate: 2025-02-01 before 2022-04-01)
      const aiIndex = xml.indexOf('Internal AI coding copilots');
      const ifsIndex = xml.indexOf('IFS Design System');
      expect(aiIndex).toBeLessThan(ifsIndex);
    });

    it('handles items without publishDate gracefully', async () => {
      const workWithoutDate: WorkItem[] = [
        {
          id: 'no-date-work',
          data: {
            title: 'Undated Project',
            description: 'No date assigned',
          },
        },
      ];
      vi.mocked(getCollection).mockResolvedValue(workWithoutDate as never);

      const response = await getRss({} as never);
      const xml = await response.text();
      expect(xml).toContain('<title>Undated Project</title>');
      expect(xml).not.toContain('<pubDate>');
    });
  });

  describe('sitemap.xml GET', () => {
    it('generates valid sitemap XML with static and work URLs, excluding lidkoping-stenhuggeri', async () => {
      vi.mocked(getCollection).mockResolvedValue(sampleWorkEntries as never);

      const response = await getSitemap({} as never);
      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

      // Static routes
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');

      // Work routes with formatted lastmod date (YYYY-MM-DD)
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2022-04-01</lastmod>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ai-coding-copilots/</loc>');
      expect(xml).toContain('<lastmod>2025-02-01</lastmod>');

      // Exclude lidkoping-stenhuggeri
      expect(xml).not.toContain('/work/lidkoping-stenhuggeri/');
    });

    it('handles work entries without publishDate in sitemap', async () => {
      const workWithoutDate: WorkItem[] = [
        {
          id: 'no-date-work',
          data: {
            title: 'Undated Project',
            description: 'No date assigned',
          },
        },
      ];
      vi.mocked(getCollection).mockResolvedValue(workWithoutDate as never);

      const response = await getSitemap({} as never);
      const xml = await response.text();
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/no-date-work/</loc>');
      // Since date is undefined, urlXml does not render lastmodTag for this entry
      const urlBlocks = xml.split('<url>');
      const noDateBlock = urlBlocks.find((b) => b.includes('/work/no-date-work/'));
      expect(noDateBlock).toBeDefined();
      expect(noDateBlock).not.toContain('<lastmod>');
    });
  });
});
