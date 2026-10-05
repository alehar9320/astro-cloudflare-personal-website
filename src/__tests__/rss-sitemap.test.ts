import { describe, expect, it, vi, beforeEach } from 'vitest';
import { getCollection } from 'astro:content';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

describe('RSS and Sitemap endpoints', () => {
  const mockWorkItems = [
    {
      id: 'test-project-1',
      data: {
        title: 'Project & "Design" <One>',
        description: "A 'great' & <awesome> project",
        publishDate: new Date('2025-06-15T12:00:00Z'),
      },
    },
    {
      id: 'test-project-2',
      data: {
        title: 'Project Two',
        description: 'Second project description',
        publishDate: new Date('2026-01-01T12:00:00Z'),
      },
    },
    {
      id: 'lidkoping-stenhuggeri',
      data: {
        title: 'Ignored Project',
        description: 'Should be filtered out',
        publishDate: new Date('2024-01-01T12:00:00Z'),
      },
    },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rss.xml GET returns formatted RSS feed filtering ignored items and escaping XML', async () => {
    vi.mocked(getCollection).mockResolvedValue(mockWorkItems as never);

    const response = await getRss({} as Parameters<typeof getRss>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<title>Project Two</title>');
    expect(xml).toContain('Project &amp; &quot;Design&quot; &lt;One&gt;');
    expect(xml).toContain('A &apos;great&apos; &amp; &lt;awesome&gt; project');
    expect(xml).not.toContain('Ignored Project');
    expect(xml.indexOf('Project Two')).toBeLessThan(xml.indexOf('Project &amp;'));
  });

  it('sitemap.xml GET returns valid XML sitemap with static and dynamic paths', async () => {
    vi.mocked(getCollection).mockResolvedValue(mockWorkItems as never);

    const response = await getSitemap({} as Parameters<typeof getSitemap>[0]);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/test-project-1/</loc>');
    expect(xml).toContain('<lastmod>2025-06-15</lastmod>');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
