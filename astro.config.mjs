import { defineConfig, fontProviders } from 'astro/config';

export default defineConfig({
  site: 'https://aislam23.github.io',
  base: '/beresta',
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Manrope',
      cssVariable: '--font-manrope',
      weights: ['400 800'],
      styles: ['normal'],
      subsets: ['cyrillic', 'latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
