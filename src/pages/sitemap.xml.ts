import { getCollection } from 'astro:content';

const siteUrl = 'https://entraidfieldnotes.com';

function escapeXml(value: string): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const latestDate = posts
    .map(p => p.data.updatedDate || p.data.date)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  const sitemapPages = [
    { loc: `${siteUrl}/`, lastmod: latestDate, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/impressum/`, changefreq: 'monthly', priority: '0.3' },
    { loc: `${siteUrl}/datenschutz/`, changefreq: 'monthly', priority: '0.3' },
    ...posts.map(p => ({
      loc: `${siteUrl}/${p.id}/`,
      lastmod: p.data.updatedDate || p.data.date,
      changefreq: 'monthly',
      priority: '0.9',
    })),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages
  .map(
    p => `  <url>
    <loc>${escapeXml(p.loc)}</loc>${p.lastmod ? `\n    <lastmod>${escapeXml(p.lastmod)}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
