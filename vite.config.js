import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// IMPORTANT: `base` must match the GitHub Pages repo name so asset URLs resolve
// at https://<account>.github.io/fll-camp/. If the repo is ever renamed, change
// this in lockstep.
export default defineConfig({
  base: '/fll-camp/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
