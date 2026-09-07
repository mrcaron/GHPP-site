/**
 * The Greenhouse — central site configuration.
 * ---------------------------------------------------------------------------
 * This is the ONE file you edit for day-to-day changes: the signup link,
 * announcements, community info, and location text. Everything else on the
 * site reads from here.
 */

export const SITE = {
  name: 'The Greenhouse',
  tagline: 'A 24-7 prayer room in Sun Prairie, Wisconsin',
  // Short description used for SEO / social sharing.
  description:
    'The Greenhouse is an ecumenical Christian prayer room in Sun Prairie, ' +
    'WI — a safe, welcoming space to encounter God. Book a free one-hour ' +
    'prayer slot, any hour of the day.',
  city: 'Sun Prairie',
  region: 'WI',
  regionName: 'Wisconsin',
  country: 'USA',
};

/** The primary call to action — 24-7 Prayer's booking page for this room. */
export const SIGNUP_URL = 'https://signup.24-7prayer.com/signup/343adb';

/**
 * Cloudflare Turnstile — free, privacy-friendly spam protection for the
 * contact form. Create a widget at dash.cloudflare.com > Turnstile, then
 * paste the SITE key here (it is public/safe to expose). The matching SECRET
 * key goes in Cloudflare as an environment variable — see README.md.
 * Leave as '' to temporarily run the form without a captcha.
 */
export const TURNSTILE_SITE_KEY = '0x4AAAAAAD16jYWv6wfL9rYJ';

/** External movement links (used in header/footer for the brand tie-back). */
export const LINKS = {
  prayer247: 'https://24-7prayer.com',
  prayer247About: 'https://www.24-7prayer.com/about/about-us/who-we-are/',
  prayer247USA: 'https://www.24-7prayerusa.com/',
  weekOfPrayer: 'https://www.24-7prayer.com/weekofprayer/',
  mustardSeed: 'https://www.orderofthemustardseed.com/',
};

/**
 * Home-page announcements (rendered as cards). Edit / add / remove freely.
 * `cta` is optional; omit it for an announcement with no button.
 */
export const ANNOUNCEMENTS = [
  {
    tag: 'Global Week of Prayer',
    title: 'September 6–13 · 168 hours of non-stop prayer',
    body:
      'Join hundreds of prayer rooms around the world for a full week of ' +
      'unbroken prayer. Every hour of every day, someone will be praying — ' +
      'come take your hour.',
    cta: { label: 'Learn about the Week of Prayer', href: '/global-week-of-prayer', external: false },
  },
  {
    tag: 'Lend a hand',
    title: 'Help us build out the room before the Week of Prayer',
    body:
      'We need help to paint, build, lay carpet, and prepare the space. ' +
      'If you would love to be part of creating this place of prayer, ' +
      'reach out — every pair of hands matters.',
    cta: { label: 'I want to help', href: '/about#contact', external: false },
  },
  {
    tag: 'Pre-GWOP slots',
    title: 'Prayer slots are open now',
    body:
      'Pre-Global-Week-of-Prayer slots are available. If you would like to ' +
      'pray in the room ahead of the week, get in touch and we will help ' +
      'you find a time.',
    cta: { label: 'Ask about a slot', href: '/about#contact', external: false },
  },
];

/**
 * LOCATION — public pages only ever reference the CITY, never the street.
 *
 * The exact address is rendered ONLY on /welcome (unlisted, noindex). To keep
 * it OUT of this public GitHub repo, the private values are read from
 * BUILD-TIME environment variables instead of being written here. Set them in
 * Cloudflare Pages → Settings → Variables and Secrets (type: Plaintext), for
 * the Production environment:
 *
 *   WELCOME_ADDRESS_LINE   e.g. "123 Example St."
 *   WELCOME_CITY_LINE      e.g. "Sun Prairie, WI 53590"
 *   WELCOME_MAP_EMBED      the Google Maps "Embed a map" <iframe src> URL
 *   WELCOME_DOOR_CODE      the garage keypad code, e.g. "1234"
 *   WELCOME_PHONE          contact number shown for "text if there's an issue"
 *
 * After adding or changing them, RE-DEPLOY (push, or retry a deployment) so
 * the build picks them up. When unset, the safe city-level placeholders below
 * are used. To preview real values locally, set the same vars in your shell
 * (they are ordinary env vars, read via process.env at build time).
 *
 * NOTE: this keeps the address (and now the door code) off GitHub. The page
 * itself has no login — anyone with the link still sees it — so it's also
 * served at an unguessable random URL (WELCOME_SLUG below) instead of the
 * predictable "/welcome", rather than something anyone could type in.
 */
const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
const env = proc?.env ?? {};

const addressLine = env.WELCOME_ADDRESS_LINE ?? '000 Your Street (set WELCOME_ADDRESS_LINE)';
const cityLine = env.WELCOME_CITY_LINE ?? 'Sun Prairie, WI 53590';
const doorCode = env.WELCOME_DOOR_CODE ?? '0000 (set WELCOME_DOOR_CODE)';
const phoneRaw = env.WELCOME_PHONE ?? '';
const phoneDisplay = phoneRaw || '(set WELCOME_PHONE)';
const phoneHref = phoneRaw ? `sms:${phoneRaw.replace(/[^0-9+]/g, '')}` : undefined;

/**
 * WELCOME_SLUG — the unguessable path segment the private location page is
 * served at (e.g. "wtj-9fk2m7q" -> yoursite.com/wtj-9fk2m7q), instead of the
 * predictable "/welcome". Set it in Cloudflare Pages → Settings → Variables
 * and Secrets (type: Plaintext, Production environment) to a long random
 * string — e.g. generate one with `openssl rand -hex 8`. Falls back to
 * "welcome" for local dev only; only letters, numbers, and hyphens are kept.
 */
const rawSlug = env.WELCOME_SLUG ?? 'welcome';
export const WELCOME_SLUG = rawSlug.replace(/[^a-zA-Z0-9-]/g, '') || 'welcome';
const directionsDest = encodeURIComponent(`${addressLine}, ${cityLine}`);

export const LOCATION = {
  // Public, city-level map embed (safe to index). Centered on Sun Prairie.
  cityMapEmbed: 'https://www.google.com/maps?q=Sun+Prairie,+WI&output=embed',
  cityMapLink: 'https://www.google.com/maps/place/Sun+Prairie,+WI',

  // PRIVATE — rendered only on the unlisted /welcome page, sourced from env vars.
  welcome: {
    addressLine,
    cityLine,
    // Exact-address map embed; falls back to the city map when the var is unset.
    exactMapEmbed:
      env.WELCOME_MAP_EMBED ?? 'https://www.google.com/maps?q=Sun+Prairie,+WI&output=embed',
    // Turn-by-turn deep links, derived from the address above.
    googleDirections: `https://www.google.com/maps/dir/?api=1&destination=${directionsDest}`,
    appleDirections: `https://maps.apple.com/?daddr=${directionsDest}`,
    doorCode,
    phoneDisplay,
    phoneHref,
  },
};

/** Semi-monthly community rhythm, described on the About page. */
export const COMMUNITY = {
  blurb:
    'Alongside keeping the room open to the public, we maintain a small ' +
    'community that gathers semi-monthly to worship, pray, learn, and ' +
    'celebrate together. You are warmly welcome to reach out for more ' +
    'information about that time.',
};
