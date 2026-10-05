import fs from 'node:fs';
import { spawn } from 'node:child_process';

// Windows path casing fix for Vite/Astro
if (process.platform === 'win32') {
  try {
    process.chdir(fs.realpathSync.native ? fs.realpathSync.native(process.cwd()) : fs.realpathSync(process.cwd()));
  } catch {}
}

const args = process.argv.slice(2);
const astroCommand = process.platform === 'win32' ? 'astro.cmd' : 'astro';

const child = spawn(astroCommand, args, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});

child.on('error', (error) => {
  console.error('[astro-wrapper] Failed to launch Astro CLI:', error);
  process.exit(1);
});
