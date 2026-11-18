import { getCollection } from 'astro:content';

function stripMarkdownForSearch(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export async function GET() {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  const index = posts.map(post => ({
    id: post.id,
    content: stripMarkdownForSearch(post.body || ''),
  }));

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}
