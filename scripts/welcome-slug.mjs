// Shared helper so the sitemap filter (astro.config.mjs) and the generated
// _headers file (scripts/generate-headers.mjs) agree on the unguessable
// path the private location page is served at. Must match the sanitizing
// logic in src/config.ts.
const raw = process.env.WELCOME_SLUG ?? 'welcome';
export const welcomeSlug = raw.replace(/[^a-zA-Z0-9-]/g, '') || 'welcome';
