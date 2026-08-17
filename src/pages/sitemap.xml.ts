import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const liveOrigin = 'https://me.alehar.workers.dev';

const staticPaths = ['/', '/work/', '/biography/', '/contact/'];

function loc(path: string) {
  return `${liveOrigin}${path}`;
}

function lastmod(date: Date) {
  return date.toISOString().slice(0, 10);
}

function urlXml(path: string, date?: Date) {
  const lastmodTag = date ? `\n    <lastmod>${lastmod(date)}</lastmod>` : '';
  return `  <url>\n    <loc>${loc(path)}</loc>${lastmodTag}\n  </url>`;
}

export const GET: APIRoute = async () => {
  // Work loc is /work/<entry.id>/ matching [...slug].astro (e.g. /work/ifs-design-system/).
  const work = await getCollection('work');
  const urls = [
    ...staticPaths.map((path) => urlXml(path)),
    ...work.map((entry) => urlXml(`/work/${entry.id}/`, entry.data.publishDate)),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
