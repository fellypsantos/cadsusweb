import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tampermonkey/cadsusweb.user.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  bundle: true,
  format: ['cjs'],
  noExternal: [ /(.*)/ ],
  loader: {
    '.njk': 'copy',
    '.ini': 'copy',
    '.bat': 'copy'
  }
});
