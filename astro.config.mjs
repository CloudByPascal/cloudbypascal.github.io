import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://entraidfieldnotes.com',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: false })],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true
    }
  }
});
