import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as astroContent from 'astro:content';
import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

type GetContext = Parameters<typeof getRss>[0];

function createContext(url = 'https://me.alehar.workers.dev/rss.xml') {
  return {
    request: new Request(url),
    locals: {},
  } as unknown as GetContext;
}

const mockWorkEntries = [
  {
    id: 'older-project',
    data: {
      title: 'Older Project & Test <Tag>',
      description: 'An older "project" description',
      publishDate: new Date('2023-01-01T12:00:00Z'),
    },
  },
  {
    id: 'newer-project',
    data: {
      title: "Newer Project 'Rock'",
      description: 'A > newer project',
      publishDate: new Date('2024-06-15T12:00:00Z'),
    },
  },
  {
    id: 'lidkoping-stenhuggeri',
    data: {
      title: 'Lidköping Stenhuggeri',
      description: 'Filtered project',
      publishDate: new Date('2022-01-01T12:00:00Z'),
    },
  },
];

describe('RSS XML endpoint (src/pages/rss.xml.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('generates valid RSS XML feed with properly escaped and sorted items', async () => {
    vi.spyOn(astroContent, 'getCollection').mockResolvedValue(
      mockWorkEntries as unknown as Awaited<ReturnType<typeof astroContent.getCollection>>
    );

    const response = await getRss(createContext());

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );

    // Check character escaping
    expect(xml).toContain('Older Project &amp; Test &lt;Tag&gt;');
    expect(xml).toContain('An older &quot;project&quot; description');
    expect(xml).toContain('Newer Project &apos;Rock&apos;');
    expect(xml).toContain('A &gt; newer project');

    // Check item sorting (newer-project should appear before older-project in the XML output)
    const indexNewer = xml.indexOf('newer-project');
    const indexOlder = xml.indexOf('older-project');
    expect(indexNewer).toBeGreaterThan(-1);
    expect(indexOlder).toBeGreaterThan(-1);
    expect(indexNewer).toBeLessThan(indexOlder);

    // Filtered project shouldn't be included
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});

describe('Sitemap XML endpoint (src/pages/sitemap.xml.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('generates valid Sitemap XML with static paths and work collection items', async () => {
    vi.spyOn(astroContent, 'getCollection').mockResolvedValue(
      mockWorkEntries as unknown as Awaited<ReturnType<typeof astroContent.getCollection>>
    );

    const response = await getSitemap(createContext('https://me.alehar.workers.dev/sitemap.xml'));

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    // Static paths check
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');

    // Dynamic work entry paths check
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/newer-project/</loc>');
    expect(xml).toContain('<lastmod>2024-06-15</lastmod>');

    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/older-project/</loc>');
    expect(xml).toContain('<lastmod>2023-01-01</lastmod>');

    // Filtered project check
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
