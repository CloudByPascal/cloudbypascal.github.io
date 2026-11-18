import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const postsDir = path.join(rootDir, 'src', 'content', 'posts');
const siteUrl = 'https://entraidfieldnotes.com';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
});

function validateXmlFile(relativePath) {
  const absolutePath = path.join(rootDir, relativePath);
  const xml = fs.readFileSync(absolutePath, 'utf-8');
  const result = XMLValidator.validate(xml);
  if (result !== true) {
    throw new Error(`${relativePath} is not valid XML: ${result.err.msg} (line ${result.err.line}, col ${result.err.col})`);
  }
  return { parsed: parser.parse(xml), raw: xml };
}

function getDraftIds() {
  return fs
    .readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .filter(f => /^draft:\s*true\b/m.test(fs.readFileSync(path.join(postsDir, f), 'utf-8')))
    .map(f => f.replace(/\.md$/, ''));
}

function collectHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function resolveDistTarget(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const rel = cleanPath.replace(/^\/+/, '');
  const candidates = rel === ''
    ? [path.join(distDir, 'index.html')]
    : [
        path.join(distDir, rel),
        path.join(distDir, rel, 'index.html'),
      ];
  return candidates.some(c => fs.existsSync(c) && fs.statSync(c).isFile());
}

const { parsed: rss, raw: rssRaw } = validateXmlFile(path.join('dist', 'rss.xml'));
const { parsed: sitemap, raw: sitemapRaw } = validateXmlFile(path.join('dist', 'sitemap.xml'));

assert(rss?.rss?.channel, 'dist/rss.xml is missing <rss><channel> structure');
assert(sitemap?.urlset?.url, 'dist/sitemap.xml is missing <urlset><url> entries');

const urls = Array.isArray(sitemap.urlset.url) ? sitemap.urlset.url : [sitemap.urlset.url];
for (const entry of urls) {
  assert(
    typeof entry.loc === 'string' && entry.loc.startsWith(`${siteUrl}/`) && entry.loc.endsWith('/'),
    `Invalid sitemap <loc>: ${entry.loc}`
  );
}

for (const draftId of getDraftIds()) {
  assert(!rssRaw.includes(`/${draftId}/`), `Draft post "${draftId}" leaked into dist/rss.xml`);
  assert(!sitemapRaw.includes(`/${draftId}/`), `Draft post "${draftId}" leaked into dist/sitemap.xml`);
  assert(!fs.existsSync(path.join(distDir, draftId)), `Draft post "${draftId}" was built into dist/`);
}

const searchIndexRaw = fs.readFileSync(path.join(distDir, 'search-index.json'), 'utf-8');
const searchIndex = JSON.parse(searchIndexRaw);
assert(Array.isArray(searchIndex) && searchIndex.length > 0, 'dist/search-index.json must be a non-empty JSON array');
for (const item of searchIndex) {
  assert(typeof item.id === 'string' && typeof item.content === 'string', 'Invalid entry in dist/search-index.json');
}

const brokenLinks = [];
for (const htmlFile of collectHtmlFiles(distDir)) {
  const html = fs.readFileSync(htmlFile, 'utf-8');
  const matches = html.matchAll(/(?:href|src)=["'](\/(?!\/)[^"']*)["']/g);
  for (const match of matches) {
    const target = match[1];
    if (!resolveDistTarget(target)) {
      brokenLinks.push(`${path.relative(distDir, htmlFile)} -> ${target}`);
    }
  }
}

assert.equal(brokenLinks.length, 0, `Broken internal links/assets in dist:\n${brokenLinks.join('\n')}`);

console.log(`[validate-feeds] RSS (${urls.length} sitemap URLs), search-index.json, and all HTML internal links/assets in dist/ are valid.`);
