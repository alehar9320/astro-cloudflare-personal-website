import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

const liveOrigin = 'https://me.alehar.workers.dev';
const hireLinkedIn = 'https://www.linkedin.com/in/alehar/';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function itemXml(entry: {
  id: string;
  data: { title: string; description: string; publishDate: Date };
}) {
  // Work loc is /work/<entry.id>/ matching [...slug].astro (e.g. /work/ifs-design-system/).
  const link = `${liveOrigin}/work/${entry.id}/`;
  const title = escapeXml(entry.data.title.trim());
  const description = escapeXml(entry.data.description.trim());
  const pubDate = entry.data.publishDate
    ? `\n      <pubDate>${entry.data.publishDate.toUTCString()}</pubDate>`
    : '';

  return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${description}</description>${pubDate}
    </item>`;
}

export const GET: APIRoute = async () => {
  const work = await getCollection('work');
  const items = [...work]
    .filter((entry) => entry.id !== 'lidkoping-stenhuggeri')
    .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Alexander Härenstam | Product Manager, Developer Experience at IFS</title>
    <link>${liveOrigin}/</link>
    <description>Product Manager, Developer Experience at IFS. Get in touch on LinkedIn.</description>
    <atom:link href="${liveOrigin}/rss.xml" rel="self" type="application/rss+xml"/>
    <atom:link href="${hireLinkedIn}" rel="related"/>
${items.map(itemXml).join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
