import { describe, expect, it, vi } from 'vitest';

const mockWorkEntries = [
  {
    id: 'ifs-design-system',
    data: {
      title: 'IFS Design System & Digital Core <v2>',
      description: 'Architected scalable design system components for enterprise web software.',
      publishDate: new Date('2024-03-15T12:00:00Z'),
    },
  },
  {
    id: 'lidkoping-stenhuggeri',
    data: {
      title: 'Lidköping Stenhuggeri',
      description: 'Legacy work item that should be filtered out from public RSS feed & Sitemap.',
      publishDate: new Date('2020-01-01T00:00:00Z'),
    },
  },
  {
    id: 'cloud-architecture',
    data: {
      title: 'Cloud Edge Optimization',
      description: 'Optimized Cloudflare Workers and global routing layer.',
      publishDate: new Date('2025-01-10T08:00:00Z'),
    },
  },
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async (collection: string) => {
    if (collection === 'work') {
      return mockWorkEntries;
    }
    return [];
  }),
}));

import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

describe('RSS XML Endpoint Handler (rss.xml.ts)', () => {
  it('returns HTTP 200 response with correct headers and XML content', async () => {
    const context = {} as Parameters<typeof getRss>[0];
    const response = await getRss(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">');
    expect(xml).toContain('<channel>');
    expect(xml).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );
  });

  it('filters out excluded entries and orders items by publishDate descending', async () => {
    const context = {} as Parameters<typeof getRss>[0];
    const response = await getRss(context);
    const xml = await response.text();

    // 'lidkoping-stenhuggeri' should be excluded
    expect(xml).not.toContain('lidkoping-stenhuggeri');

    // Both valid entries should be present
    expect(xml).toContain('<link>https://me.alehar.workers.dev/work/ifs-design-system/</link>');
    expect(xml).toContain('<link>https://me.alehar.workers.dev/work/cloud-architecture/</link>');

    // Dynamic order check: 'cloud-architecture' (2025) should appear before 'ifs-design-system' (2024)
    const cloudIndex = xml.indexOf('/work/cloud-architecture/');
    const ifsIndex = xml.indexOf('/work/ifs-design-system/');
    expect(cloudIndex).toBeGreaterThan(-1);
    expect(ifsIndex).toBeGreaterThan(-1);
    expect(cloudIndex).toBeLessThan(ifsIndex);
  });

  it('properly escapes XML special characters in title and description', async () => {
    const context = {} as Parameters<typeof getRss>[0];
    const response = await getRss(context);
    const xml = await response.text();

    expect(xml).toContain('IFS Design System &amp; Digital Core &lt;v2&gt;');
    expect(xml).not.toContain('IFS Design System & Digital Core <v2>');
  });
});

describe('Sitemap XML Endpoint Handler (sitemap.xml.ts)', () => {
  it('returns HTTP 200 response with correct headers and XML content', async () => {
    const context = {} as Parameters<typeof getSitemap>[0];
    const response = await getSitemap(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('includes static paths and dynamic work paths with lastmod formatted as YYYY-MM-DD', async () => {
    const context = {} as Parameters<typeof getSitemap>[0];
    const response = await getSitemap(context);
    const xml = await response.text();

    // Static paths
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/contact/</loc>');

    // Dynamic work paths with formatted lastmod
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
    expect(xml).toContain('<lastmod>2024-03-15</lastmod>');

    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/cloud-architecture/</loc>');
    expect(xml).toContain('<lastmod>2025-01-10</lastmod>');

    // Filtered item check
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
