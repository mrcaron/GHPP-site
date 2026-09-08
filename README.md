# The Greenhouse 🌱

The website for **The Greenhouse** — a 24-7 prayer room in Sun Prairie, WI.

Built with [Astro](https://astro.build) (static site) + a single Cloudflare
Pages Function for the contact form. Designed to host for **free** on
Cloudflare Pages.

---

## Pages

| URL         | Purpose                                                         | Indexed?   |
| ----------- | --------------------------------------------------------------- | ---------- |
| `/`         | Home — vision, announcements, sign-up call to action            | ✅ yes     |
| `/visit`    | Public visit guide — **city-level** map, access, what to expect | ✅ yes     |
| `/about`    | Who we are + contact form (`#contact`)                          | ✅ yes     |
| `/<random-slug>` | **Unlisted, unguessable** — exact address, map & directions (link emailed after booking) | 🚫 noindex |
| `/thank-you`| Contact form success page                                       | 🚫 noindex |

**Privacy model:** public pages only ever mention the *city*. The exact
address lives on a private page served at a random URL (`WELCOME_SLUG`, see
step 6), whose link you share by email after someone books — not the
predictable `/welcome`, since that page has no login and anyone with the
link can see it.
**The door combination code is never on the website — put it in the email only.**

---

## Editing content

Almost everything you'll want to change lives in **one file**: [`src/config.ts`](src/config.ts).

- **Announcements** — edit the `ANNOUNCEMENTS` array.
- **Sign-up link** — `SIGNUP_URL`.
- **Your exact address / maps** — the `LOCATION.welcome` block (used only on the private welcome page).
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
   | `CONTACT_TO`      | Secret | `YOUR EMAIL ADDR`                       |
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

### 6. Set the private welcome page's address, door code, and URL (kept OUT of the public repo)
The exact address, the garage door code, and the random URL the page lives
at are **not** stored in the code — they're read from build-time
environment variables so none of it lands in this public GitHub repo. In
Cloudflare Pages → **Settings → Variables and Secrets** (type **Plaintext**,
Production environment), add:

| Name                   | Value                                             |
| ---------------------- | ------------------------------------------------- |
| `WELCOME_ADDRESS_LINE` | `123 Example St.`                                 |
| `WELCOME_CITY_LINE`    | `Sun Prairie, WI 53590`                           |
| `WELCOME_MAP_EMBED`    | Google Maps → your address → **Share → Embed a map** → copy the `src="..."` URL |
| `WELCOME_DOOR_CODE`    | The garage keypad code, e.g. `1234`               |
| `WELCOME_PHONE`        | Contact number shown for "text if there's an issue" |
| `WELCOME_VIDEO_URL`    | Direct URL to the getting-in walkthrough video (see below) |
| `WELCOME_SLUG`         | A long random string, e.g. output of `openssl rand -hex 8` |

Then **re-deploy** (push, or retry a deployment) so the build bakes them in.
The Google/Apple directions links are generated automatically from the address.
When these vars are unset, the page falls back to city-level placeholders and
the path `/welcome` — fine for local preview, but set them for real before
sharing the site.

> This keeps the address and door code off GitHub. It does **not**
> password-protect the page — anyone with the link still sees it. That's why
> the page is served at an unguessable random URL instead of `/welcome`,
> rather than something anyone could type in — treat the link itself as the
> secret, and only share it after someone books.
>
> Neither `WELCOME_SLUG` nor `WELCOME_DOOR_CODE` expire or rotate on their
> own, and they're the same for every booking. Periodically rotating both
> (e.g. the physical keypad code on its own schedule, and the URL slug
> independently, redeploying after each) limits how long an old link or
> code stays valid if it's ever shared or found.
>
> `WELCOME_VIDEO_URL` (below) has the same property, but rotating the slug
> does **not** rotate it — the R2 URL keeps working on its own regardless of
> what page links to it. If the video URL is ever shared or found, replace
> the object in R2 (a new upload gets a new URL; deleting the old object
> invalidates the old one) rather than assuming a slug rotation covers it.

Then, in your 24-7 Prayer booking confirmation email, include a link to
`https://yourdomain.com/<your-WELCOME_SLUG-value>`.

#### The walkthrough video (`WELCOME_VIDEO_URL`)

The video showing the whole getting-in process is hosted in **Cloudflare
R2**, not this repo — it's too large for git and, like the address and door
code, not something to publish publicly.

1. Prefer an **`.mp4` file (H.264 video)** over `.mov` if you can — it plays
   natively in every browser, not just Safari. Phone-recorded video is
   usually much higher bitrate than a walkthrough needs; re-exporting at
   720p (e.g. in iMovie: Share → Save Video → choose 720p) both improves
   compatibility and shrinks the file a lot.
2. **The Cloudflare dashboard's browser upload caps out around 300MB** —
   larger files fail with "exceeds the 300 MB limit." If your file is
   under that after step 1, skip to step 3. If it's still over, either
   compress it further, or upload from a computer via `rclone` or the
   `aws` CLI against R2's S3-compatible API (both do automatic multipart
   upload, so the dashboard's cap doesn't apply) — see Cloudflare's R2 docs
   for the one-time API token setup.
3. Cloudflare dashboard → **R2** → create a bucket (or reuse one) → open it
   → **Upload** → select the video file. A non-obvious object key (e.g.
   `getting-in-a83f2e.mp4` rather than `video.mp4`) adds a little extra
   obscurity, matching the unguessable-URL approach used elsewhere on this
   page — not required, just consistent.
4. Bucket → **Settings → Public Access** → enable the `r2.dev` subdomain (or
   connect a custom domain under **Custom Domains** for a cleaner URL). This
   gives you a public URL like `https://pub-XXXXXXXX.r2.dev/<your-key>.mp4`.
5. Set that URL as `WELCOME_VIDEO_URL` in Cloudflare Pages, alongside the
   other `WELCOME_*` variables above, and redeploy.

When `WELCOME_VIDEO_URL` is unset, the video section simply doesn't render —
the page still works fine with just the written steps.

> Like the door code and address, this makes the video reachable by anyone
> who has the URL, indefinitely — the site is 100% static with no server to
> enforce auth or expiring links. That's a reasonable tradeoff here (same
> model as the rest of this page), but it's worth knowing this is
> obscurity, not real access control: don't treat the R2 URL as safe to
> post anywhere public.

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
