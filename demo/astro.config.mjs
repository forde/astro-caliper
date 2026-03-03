// @ts-check
import { defineConfig } from 'astro/config';
import caliper from 'astro-caliper';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [caliper()],
  vite: {
    plugins: [tailwindcss()],
  },
});