import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // three.js ships as one ~600 kB chunk (~156 kB gzip); the budget is 200 KB gzip.
    chunkSizeWarningLimit: 700,
  },
});
