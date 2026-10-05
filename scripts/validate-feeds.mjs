import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
  return parser.parse(xml);
}

const rss = validateXmlFile(path.join('public', 'rss.xml'));
const sitemap = validateXmlFile(path.join('public', 'sitemap.xml'));

if (!rss?.rss?.channel) {
  throw new Error('public/rss.xml is missing <rss><channel> structure');
}

if (!sitemap?.urlset?.url) {
  throw new Error('public/sitemap.xml is missing <urlset><url> entries');
}

console.log('[validate-feeds] RSS and sitemap XML are valid.');
