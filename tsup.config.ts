import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tampermonkey/cadsusweb.user.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  bundle: true,
  format: ['cjs'],
  noExternal: ['bwip-js', 'chalk', 'cors', 'date-fns', 'express', 'ini', 'keypress', 'mongoose', 'nunjucks', 'openurl', 'tty'],
  loader: {
    '.njk': 'copy',
    '.ini': 'copy',
    '.bat': 'copy'
  }
});
