import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

// Builds ONE self-contained index.html (all JS/CSS/images inlined) in dist-single/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  resolve: { alias: { '@': rootDir } },
  build: { outDir: 'dist-single', assetsInlineLimit: 100000000 },
});
