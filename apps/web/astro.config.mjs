// @ts-check
import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

const { env } = process;

// https://astro.build/config
export default defineConfig({
  compressHTML: false,
  integrations: [react()],
  scopedStyleStrategy: 'class',
  server: { port: 3000 },

  env: {
    schema: {
      GRAPHQL_HOST: envField.string({
        context: 'client',
        access: 'public',
        default: env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://bolcom-apollo.vercel.app/',
      }),
    },
  },
});
