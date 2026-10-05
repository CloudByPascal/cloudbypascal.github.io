import fs from 'node:fs';

// Windows path casing fix for Vite/Astro
if (process.platform === 'win32') {
  try {
    process.chdir(fs.realpathSync.native ? fs.realpathSync.native(process.cwd()) : fs.realpathSync(process.cwd()));
  } catch {}
}

const { cli } = await import('astro/dist/cli/index.js');
await cli(process.argv);
