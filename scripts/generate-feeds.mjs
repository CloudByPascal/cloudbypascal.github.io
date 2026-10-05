import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const postsDir = path.join(rootDir, 'src', 'content', 'posts');
const publicDir = path.join(rootDir, 'public');

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const frontmatterText = match[1];
  const data = {};
  
  for (const line of frontmatterText.split(/\r?\n/)) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1);
    }
    data[key] = val;
  }
  return data;
}

const siteUrl = 'https://entraidfieldnotes.com';
const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const posts = postFiles.map(file => {
  const slug = file.replace(/\.md$/, '');
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  const data = parseFrontmatter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString().split('T')[0],
    summary: data.summary || '',
    category: data.category || 'General',
  };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

// 1. Generate Sitemap XML
const sitemapPages = [
  { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
  { loc: `${siteUrl}/impressum/`, changefreq: 'monthly', priority: '0.3' },
  ...posts.map(p => ({
    loc: `${siteUrl}/${p.slug}/`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.9',
  }))
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPages.map(p => `  <url>
    <loc>${p.loc}</loc>${p.lastmod ? `\n    <lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log(`[generate-feeds] Successfully wrote sitemap.xml with ${sitemapPages.length} URLs.`);

// 2. Generate RSS XML
const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Pascal Riester | Entra ID Field Notes</title>
    <description>Technical blog by Pascal Riester specializing in Microsoft Entra ID, Conditional Access, Privileged Identity Management (PIM), and Microsoft Cloud Security.</description>
    <link>${siteUrl}/</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts.map(p => `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${siteUrl}/${p.slug}/</link>
      <guid isPermaLink="true">${siteUrl}/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.summary}]]></description>
      <category>${p.category}</category>
    </item>`).join('\n')}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf-8');
console.log(`[generate-feeds] Successfully wrote rss.xml with ${posts.length} articles.`);
