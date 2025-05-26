import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  platform: 'node',
  target: 'node18',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.js' : '.mjs',
    }
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
  },
}); 