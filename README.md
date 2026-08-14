# The Greenhouse 🌱

The website for **The Greenhouse** — a 24-7 prayer room in Sun Prairie, WI.

Built with [Astro](https://astro.build) (static site) + a single Cloudflare
Pages Function for the contact form. Designed to host for **free** on
Cloudflare Pages.

---

## Pages

| URL         | Purpose                                                        | Indexed? |
| ----------- | ------------------------------------------------------------- | -------- |
| `/`         | Home — vision, announcements, sign-up call to action          | ✅ yes   |
| `/visit`    | Public visit guide — **city-level** map, access, what to expect | ✅ yes   |
| `/about`    | Who we are + contact form (`#contact`)                        | ✅ yes   |
| `/welcome`  | **Unlisted** — exact address, map & directions (link emailed after booking) | 🚫 noindex |
| `/thank-you`| Contact form success page                                     | 🚫 noindex |

**Privacy model:** public pages only ever mention the *city*. The exact
address lives on `/welcome`, whose link you share by email after someone books.
**The door combination code is never on the website — put it in the email only.**

---

## Editing content

Almost everything you'll want to change lives in **one file**: [`src/config.ts`](src/config.ts).

- **Announcements** — edit the `ANNOUNCEMENTS` array.
- **Sign-up link** — `SIGNUP_URL`.
- **Your exact address / maps** — the `LOCATION.welcome` block (used only on `/welcome`).
- **Community blurb, movement links** — `COMMUNITY`, `LINKS`.

Longer page copy lives in the matching file under `src/pages/`.

---

## Running locally

```bash
npm install
npm run dev        # http://localhost:4321
```

The contact form's serverless function does **not** run under `npm run dev`.
To test the form end-to-end locally, use Wrangler:

```bash
npm run build
npx wrangler pages dev dist        # copy .dev.vars.example -> .dev.vars first
```

---

## Going live — step by step

### 1. Buy a domain
Register a domain (~$10/yr). Good options: `thegreenhouseprayer.com`,
`greenhousesunprairie.com`, `thegreenhouse247.com`. Registering it **in
Cloudflare** makes the rest easiest, but any registrar works.

Then set it in [`astro.config.mjs`](astro.config.mjs) (the `site:` value) and in
[`public/robots.txt`](public/robots.txt).

### 2. Push this project to GitHub
```bash
git init && git add -A && git commit -m "Initial site"
gh repo create greenhouse-site --private --source=. --push
```

### 3. Create the Cloudflare Pages project
1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick this repo. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Deploy. You'll get a free `*.pages.dev` URL immediately; add your custom
   domain under **Custom domains** once DNS is ready.

### 4. Set up the contact-form email (Resend)
1. Create a free account at [resend.com](https://resend.com).
2. **Add & verify your domain** (add the DNS records it gives you — if your
   domain is in Cloudflare this is a few clicks).
3. Create an **API key**.
4. In Cloudflare Pages → your project → **Settings → Variables and Secrets**, add:

   | Name              | Type   | Value                                   |
   | ----------------- | ------ | --------------------------------------- |
   | `CONTACT_TO`      | Secret | `mr.caron@icloud.com`                   |
   | `CONTACT_FROM`    | Text   | `noreply@yourdomain.com` (verified domain) |
   | `RESEND_API_KEY`  | Secret | `re_...`                                |
   | `TURNSTILE_SECRET`| Secret | (see step 5, optional)                  |

   > `CONTACT_TO` lives only here — it never appears on the website or in git,
   > so your address stays hidden from visitors and scrapers.

   Redeploy after adding variables.

### 5. Turn on spam protection (Cloudflare Turnstile — recommended)
1. Cloudflare dashboard → **Turnstile → Add widget**.
2. **Hostnames:** add **every** host the site runs on, or the widget throws
   error `110200` ("domain not allowed") on the ones you miss:
   - your `*.pages.dev` URL (e.g. `ghpp-site.pages.dev`)
   - your custom domain, once you have it
   - `localhost` (for local testing)
3. Copy the **Site key** into `TURNSTILE_SITE_KEY` in
   [`src/config.ts`](src/config.ts) and commit.
4. Copy the **Secret key** into the `TURNSTILE_SECRET` Cloudflare variable.

Until you set these, the form still works (protected only by the hidden
honeypot field).

### 6. Set the `/welcome` address (kept OUT of the public repo)
The exact address is **not** stored in the code — it's read from build-time
environment variables so it never lands in this public GitHub repo. In
Cloudflare Pages → **Settings → Variables and Secrets** (type **Plaintext**,
Production environment), add:

| Name                   | Value                                             |
| ---------------------- | ------------------------------------------------- |
| `WELCOME_ADDRESS_LINE` | `123 Example St.`                                 |
| `WELCOME_CITY_LINE`    | `Sun Prairie, WI 53590`                           |
| `WELCOME_MAP_EMBED`    | Google Maps → your address → **Share → Embed a map** → copy the `src="..."` URL |

Then **re-deploy** (push, or retry a deployment) so the build bakes them in.
The Google/Apple directions links are generated automatically from the address.
When these vars are unset, `/welcome` shows harmless city-level placeholders.

> This keeps the address off GitHub. It does **not** password-protect
> `/welcome` — anyone with the link still sees it. That's fine because the
> **door combination code is never on the site** — it goes in the email only.

Then, in your 24-7 Prayer booking confirmation email, include:
- a link to `https://yourdomain.com/welcome`
- **the door combination code** (this text only — never on the site)

### 7. Discoverability
- The `LocalBusiness`/`PlaceOfWorship` schema and meta tags are already set at
  **city level** (no street address).
- Ask 24-7 Prayer to link to your site from your room's listing.
- Note: Google's local map-pack needs a public street address, which you've
  chosen to keep private — so on-page SEO + the 24-7 inbound link are your main
  discoverability levers.

---

## Tech notes
- **Fonts:** Montserrat (headings) + Inter (body), self-hosted via
  `@fontsource` — close free stand-ins for 24-7 Prayer's Termina / Aktiv Grotesk
  (which are Adobe Fonts and can't be freely embedded).
- **Colors:** taken from 24-7 Prayer's brand — coral `#ec5d56`, teal `#3c7a89`,
  gold `#f2d876`, ink `#252525`.
- **Photos:** placeholders are on the home page; drop real images into
  `public/img/` and swap them into `src/pages/index.astro` when ready.
