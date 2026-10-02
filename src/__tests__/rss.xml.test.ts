import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GET, prerender } from '../pages/rss.xml';
import { getCollection, type CollectionEntry } from 'astro:content';

type GetContext = Parameters<typeof GET>[0];

function createContext(request = new Request('https://me.alehar.workers.dev/rss.xml')) {
  return {
    request,
    locals: {},
  } as unknown as GetContext;
}

describe('rss.xml route handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('exports prerender as true', () => {
    expect(prerender).toBe(true);
  });

  it('returns valid RSS feed with work collection items', async () => {
    const mockWorkItems = [
      {
        id: 'ifs-design-system',
        data: {
          title: 'IFS & Design System <Test>',
          description: 'A "great" description & summary',
          publishDate: new Date('2025-06-01T00:00:00Z'),
        },
      },
      {
        id: 'older-project',
        data: {
          title: 'Older Project',
          description: 'An older project description',
          publishDate: new Date('2024-01-01T00:00:00Z'),
        },
      },
      {
        id: 'lidkoping-stenhuggeri',
        data: {
          title: 'Lidköping Stenhuggeri',
          description: 'Filter this item out',
          publishDate: new Date('2023-01-01T00:00:00Z'),
        },
      },
    ] as unknown as CollectionEntry<'work'>[];

    vi.mocked(getCollection).mockResolvedValue(mockWorkItems);

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');

    const xml = await response.text();
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<title>IFS &amp; Design System &lt;Test&gt;</title>');
    expect(xml).toContain(
      '<description>A &quot;great&quot; description &amp; summary</description>'
    );
    expect(xml).toContain('https://me.alehar.workers.dev/work/ifs-design-system/</link>');
    expect(xml).toContain('https://me.alehar.workers.dev/work/older-project/</link>');
    expect(xml).not.toContain('lidkoping-stenhuggeri');

    // Verify publish dates are ordered descending
    const ifsIndex = xml.indexOf('ifs-design-system');
    const olderIndex = xml.indexOf('older-project');
    expect(ifsIndex).toBeLessThan(olderIndex);
  });

  it('handles items with optional or missing publishDate gracefully', async () => {
    const mockWorkItems = [
      {
        id: 'no-date-project',
        data: {
          title: 'No Date Project',
          description: 'No date provided',
          publishDate: undefined,
        },
      },
    ] as unknown as CollectionEntry<'work'>[];

    vi.mocked(getCollection).mockResolvedValue(mockWorkItems);

    const response = await GET(createContext());
    expect(response.status).toBe(200);
    const xml = await response.text();
    expect(xml).toContain('<title>No Date Project</title>');
    expect(xml).not.toContain('<pubDate>');
  });
});
