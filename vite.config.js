import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Library build: ESM + CJS bundles in dist/.
// Styles are compiled separately with the Tailwind CLI (see the `build` script)
// so consumers can import `@elevvo/react-ui/styles.css` explicitly.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.mjs' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
    minify: 'esbuild',
    emptyOutDir: true,
  },
});
