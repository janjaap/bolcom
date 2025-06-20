/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './setupTests.ts',
  },
});
