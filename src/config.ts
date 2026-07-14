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
    cta: { label: 'Learn about the Week of Prayer', href: LINKS.weekOfPrayer, external: true },
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
 * The exact address, map, and directions live on /welcome (unlisted, noindex)
 * and are shared by email after someone books a slot.
 */
export const LOCATION = {
  // Public, city-level map embed (safe to index). Centered on Sun Prairie.
  cityMapEmbed:
    'https://www.google.com/maps?q=Sun+Prairie,+WI&output=embed',
  cityMapLink: 'https://www.google.com/maps/place/Sun+Prairie,+WI',

  // -------------------------------------------------------------------------
  // PRIVATE — only rendered on the unlisted /welcome page. Fill these in with
  // your real details. Do NOT put the combo code here; it goes in the email.
  // -------------------------------------------------------------------------
  welcome: {
    addressLine: '000 Your Street',
    cityLine: 'Sun Prairie, WI 53590',
    // Paste a Google Maps "embed" src for your exact address (Share > Embed a map).
    exactMapEmbed: 'https://www.google.com/maps?q=Sun+Prairie,+WI&output=embed',
    // Deep links for turn-by-turn directions:
    googleDirections:
      'https://www.google.com/maps/dir/?api=1&destination=000+Your+Street+Sun+Prairie+WI+53590',
    appleDirections:
      'https://maps.apple.com/?daddr=000+Your+Street+Sun+Prairie+WI+53590',
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
