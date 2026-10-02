import { defineConfig } from 'vite';

export default defineConfig({
  // Published at gavinfung321.github.io/hongkong/; the dev server stays at /.
  base: process.env.GITHUB_ACTIONS ? '/hongkong/' : '/',
  build: {
    // three.js ships as one ~600 kB chunk (~156 kB gzip); the budget is 200 KB gzip.
    chunkSizeWarningLimit: 700,
  },
});
