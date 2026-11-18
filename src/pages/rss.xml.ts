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

function toCdata(value: string): string {
  return `<![CDATA[${String(value).replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
}

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml('Pascal Riester | Entra ID Field Notes')}</title>
    <description>${escapeXml('Technical blog by Pascal Riester specializing in Microsoft Entra ID, Conditional Access, Privileged Identity Management (PIM), and Microsoft Cloud Security.')}</description>
    <link>${escapeXml(`${siteUrl}/`)}</link>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${escapeXml(new Date().toUTCString())}</lastBuildDate>
${posts
  .map(
    p => `    <item>
      <title>${toCdata(p.data.title)}</title>
      <link>${escapeXml(`${siteUrl}/${p.id}/`)}</link>
      <guid isPermaLink="true">${escapeXml(`${siteUrl}/${p.id}/`)}</guid>
      <pubDate>${escapeXml(new Date(p.data.date).toUTCString())}</pubDate>
      <description>${toCdata(p.data.summary)}</description>
      <category>${escapeXml(p.data.category)}</category>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
