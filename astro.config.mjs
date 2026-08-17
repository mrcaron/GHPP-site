import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { welcomeSlug } from './scripts/welcome-slug.mjs';

// Canonical URL for SEO tags + the sitemap. Must be the "www" host since
// the apex (greenhouse247.org) 301-redirects to www at the Cloudflare edge —
// keeping this in sync avoids canonical tags pointing at a redirecting URL.
export default defineConfig({
  site: 'https://www.greenhouse247.org',
  // Dev-server only: let ngrok tunnels reach `npm run dev`. A leading dot
  // matches any subdomain, so it survives ngrok handing you a new URL each
  // session. This has no effect on the deployed (static) Cloudflare site.
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.dev', '.ngrok-free.app', '.ngrok.io'],
    },
  },
  integrations: [
    sitemap({
      // Keep the noindex pages out of the sitemap: the unlisted exact-location
      // page (served at the random WELCOME_SLUG path) and the form success page.
      filter: (page) => !page.includes(`/${welcomeSlug}`) && !page.includes('/thank-you'),
    }),
  ],
});
