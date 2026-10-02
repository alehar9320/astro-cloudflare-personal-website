import { describe, expect, it, vi } from 'vitest';
import { getCollection } from 'astro:content';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

describe('RSS and Sitemap endpoints', () => {
  const mockWorkEntries = [
    {
      id: 'ifs-design-system',
      data: {
        title: 'IFS Design System & "Quotes" <Spec>',
        description: 'Design system for IFS & Enterprise Software',
        publishDate: new Date('2023-05-15T00:00:00Z'),
      },
    },
    {
      id: 'lidkoping-stenhuggeri',
      data: {
        title: 'Filtered Out Entry',
        description: 'Should be excluded from RSS and Sitemap',
        publishDate: new Date('2021-01-01T00:00:00Z'),
      },
    },
    {
      id: 'ai-coding-copilots',
      data: {
        title: 'AI Coding Copilots',
        description: 'Internal copilots for engineering teams',
        publishDate: new Date('2024-01-10T00:00:00Z'),
      },
    },
  ];

  it('generates valid RSS feed excluding filtered entries and escaping XML', async () => {
    vi.mocked(getCollection).mockResolvedValueOnce(mockWorkEntries as any);

    const response = await getRss({} as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('IFS Design System &amp; &quot;Quotes&quot; &lt;Spec&gt;');
    expect(xml).toContain('Design system for IFS &amp; Enterprise Software');
    expect(xml).toContain('https://me.alehar.workers.dev/work/ifs-design-system/');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });

  it('generates valid Sitemap feed with correct lastmod formatting', async () => {
    vi.mocked(getCollection).mockResolvedValueOnce(mockWorkEntries as any);

    const response = await getSitemap({} as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ai-coding-copilots/</loc>');
    expect(xml).toContain('<lastmod>2024-01-10</lastmod>');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
