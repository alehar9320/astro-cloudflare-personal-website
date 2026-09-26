import { describe, expect, it, vi } from 'vitest';

vi.mock('astro:content', () => {
  return {
    getCollection: vi.fn(async (collection: string) => {
      if (collection === 'work') {
        return [
          {
            id: 'ifs-design-system',
            data: {
              title: 'IFS Design System & Component Library',
              description:
                'Scaling design consistency & UI quality across enterprise product suites.',
              publishDate: new Date('2024-06-01T00:00:00Z'),
            },
          },
          {
            id: 'lidkoping-stenhuggeri',
            data: {
              title: 'Lidköping Stenhuggeri',
              description: 'Excluded entry from public feed',
              publishDate: new Date('2023-01-01T00:00:00Z'),
            },
          },
          {
            id: 'ai-coding-copilots',
            data: {
              title: 'AI Coding Copilots at Scale',
              description:
                'Empowering software engineering teams with internal AI developer tooling.',
              publishDate: new Date('2025-02-15T00:00:00Z'),
            },
          },
        ];
      }
      return [];
    }),
  };
});

import { GET as getRss } from '../pages/rss.xml';
import { GET as getSitemap } from '../pages/sitemap.xml';

type GetContext = Parameters<typeof getRss>[0];

function createContext() {
  return {
    request: new Request('https://example.com'),
    locals: {},
  } as unknown as GetContext;
}

describe('rss.xml endpoint', () => {
  it('returns valid RSS XML with proper headers and sorted items excluding lidkoping-stenhuggeri', async () => {
    const response = await getRss(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain(
      '<title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>'
    );

    // Check items present & excluded item
    expect(xml).toContain('<title>AI Coding Copilots at Scale</title>');
    expect(xml).toContain('<title>IFS Design System &amp; Component Library</title>');
    expect(xml).not.toContain('Lidköping Stenhuggeri');

    // Check sorting (ai-coding-copilots 2025 comes before ifs-design-system 2024)
    const copilotsIndex = xml.indexOf('AI Coding Copilots at Scale');
    const ifsIndex = xml.indexOf('IFS Design System &amp; Component Library');
    expect(copilotsIndex).toBeLessThan(ifsIndex);
  });
});

describe('sitemap.xml endpoint', () => {
  it('returns valid Sitemap XML with static paths and work entries', async () => {
    const response = await getSitemap(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    // Verify static paths
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/biography/</loc>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/contact/</loc>');

    // Verify work entries and exclusion
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ifs-design-system/</loc>');
    expect(xml).toContain('<lastmod>2024-06-01</lastmod>');
    expect(xml).toContain('<loc>https://me.alehar.workers.dev/work/ai-coding-copilots/</loc>');
    expect(xml).toContain('<lastmod>2025-02-15</lastmod>');
    expect(xml).not.toContain('lidkoping-stenhuggeri');
  });
});
