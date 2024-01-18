import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: true,
  bundle: true,
  format: ['cjs'],
  noExternal: ['bwip-js', 'chalk', 'cors', 'date-fns', 'express', 'ini', 'mongoose', 'node-notifier', 'nunjucks'],
  loader: {
    '.njk': 'copy',
    '.ini': 'copy',
    '.bat': 'copy'
  }
});
