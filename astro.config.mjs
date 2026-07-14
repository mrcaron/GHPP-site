import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: after you buy your domain, replace the URL below with it,
// e.g. 'https://thegreenhouseprayer.com'. It is used for SEO canonical
// URLs and the sitemap. Until then it is a placeholder.
export default defineConfig({
  site: 'https://REPLACE-WITH-YOUR-DOMAIN.com',
  integrations: [
    sitemap({
      // Keep the noindex pages out of the sitemap. /welcome is the
      // unlisted exact-location page; /thank-you is the form success page.
      filter: (page) => !page.includes('/welcome') && !page.includes('/thank-you'),
    }),
  ],
});
