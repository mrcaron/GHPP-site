// Postbuild: writes dist/_headers, including the noindex rule for the
// private location page's random WELCOME_SLUG path. This must NOT be a
// static public/_headers file, since that would commit the real slug to
// the public GitHub repo. dist/ is gitignored, so it's safe there.
import { writeFileSync } from 'node:fs';
import { welcomeSlug } from './welcome-slug.mjs';

const body = `# Cloudflare Pages headers (https://developers.cloudflare.com/pages/configuration/headers/)
# Generated at build time by scripts/generate-headers.mjs — do not edit dist/_headers directly.

# Belt-and-suspenders: keep the private pages out of search indexes even if
# someone links to them. (astro.config also excludes them from the sitemap.)
/${welcomeSlug}*
  X-Robots-Tag: noindex, nofollow
/thank-you*
  X-Robots-Tag: noindex, nofollow

# Sensible security headers for the whole site
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
`;

writeFileSync(new URL('../dist/_headers', import.meta.url), body);
console.log(`Wrote dist/_headers (welcome slug: /${welcomeSlug})`);
