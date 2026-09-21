import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';
import { getCollection } from 'astro:content';

describe('RSS and Sitemap API Route Handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rss.xml.ts GET handler', () => {
    it('returns an RSS feed Response with correct content-type and structure', async () => {
      const mockWork = [
        {
          id: 'ifs-design-system',
          data: {
            title: 'IFS Design & System <v1>',
            description: 'Design "System" & experience',
            publishDate: new Date('2024-01-01T00:00:00Z'),
          },
        },
        {
          id: 'ai-coding-copilots',
          data: {
            title: "AI 'Coding' Copilots",
            description: 'Internal AI tools',
            publishDate: new Date('2025-02-01T00:00:00Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            title: 'Lidköping Stenhuggeri',
            description: 'Early mobile work',
            publishDate: new Date('2013-09-01T00:00:00Z'),
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(mockWork as never);

      const response = await getRss({} as never);
      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<rss version="2.0"');

      // Check filtering: lidkoping-stenhuggeri should be excluded
      expect(xml).not.toContain('/work/lidkoping-stenhuggeri/');

      // Check sorting: AI Copilots (2025) before IFS Design System (2024)
      const aiIndex = xml.indexOf('/work/ai-coding-copilots/');
      const ifsIndex = xml.indexOf('/work/ifs-design-system/');
      expect(aiIndex).toBeGreaterThan(-1);
      expect(ifsIndex).toBeGreaterThan(-1);
      expect(aiIndex).toBeLessThan(ifsIndex);

      // Check XML escaping
      expect(xml).toContain('IFS Design &amp; System &lt;v1&gt;');
      expect(xml).toContain('Design &quot;System&quot; &amp; experience');
      expect(xml).toContain('AI &apos;Coding&apos; Copilots');
    });

    it('handles work entry without publishDate gracefully', async () => {
      const mockWork = [
        {
          id: 'undated-work',
          data: {
            title: 'Undated Project',
            description: 'Project without publication date',
            publishDate: null as unknown as Date,
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(mockWork as never);

      const response = await getRss({} as never);
      const xml = await response.text();
      expect(xml).toContain('<title>Undated Project</title>');
      expect(xml).not.toContain('<pubDate>');
    });
  });

  describe('sitemap.xml.ts GET handler', () => {
    it('returns a Sitemap Response with correct content-type, static paths, and dynamic work entries', async () => {
      const mockWork = [
        {
          id: 'ifs-design-system',
          data: {
            publishDate: new Date('2022-04-01T00:00:00Z'),
          },
        },
        {
          id: 'lidkoping-stenhuggeri',
          data: {
            publishDate: new Date('2013-09-01T00:00:00Z'),
          },
        },
      ];

      vi.mocked(getCollection).mockResolvedValueOnce(mockWork as never);

      const response = await getSitemap({} as never);
      expect(response).toBeInstanceOf(Response);
      expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

      const xml = await response.text();
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

      // Check static paths
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');

      // Check dynamic work path and lastmod
      expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
      expect(xml).toContain('<lastmod>2022-04-01</lastmod>');

      // Check filtering: lidkoping-stenhuggeri should be excluded
      expect(xml).not.toContain('/work/lidkoping-stenhuggeri/');
    });
  });
});
