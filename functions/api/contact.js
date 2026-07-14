/**
 * Cloudflare Pages Function — POST /api/contact
 * ---------------------------------------------------------------------------
 * Receives the contact form, screens for spam (honeypot + Cloudflare
 * Turnstile), and emails the message to you via Resend.
 *
 * Configure these in the Cloudflare dashboard
 * (Workers & Pages > your project > Settings > Variables and Secrets):
 *
 *   CONTACT_TO       your inbox, e.g. mr.caron@icloud.com   (kept private here)
 *   CONTACT_FROM     a sender on your verified domain, e.g. noreply@yourdomain.com
 *   RESEND_API_KEY   (secret) from resend.com
 *   TURNSTILE_SECRET (secret) from Cloudflare Turnstile  — optional
 *
 * Nothing sensitive lives in this file or the git repo.
 */

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json' },
  });

export async function onRequestPost({ request, env }) {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');

  const fail = (msg, status = 400) =>
    wantsJson
      ? json({ ok: false, error: msg }, status)
      : Response.redirect(new URL('/about?error=1#contact', request.url), 303);

  let form;
  try {
    form = await request.formData();
  } catch {
    return fail('Could not read the form. Please try again.');
  }

  const name = (form.get('name') || '').toString().trim();
  const email = (form.get('email') || '').toString().trim();
  const topic = (form.get('topic') || 'General').toString().trim();
  const message = (form.get('message') || '').toString().trim();
  const honeypot = (form.get('website') || '').toString().trim();

  // 1) Honeypot — bots fill hidden fields; humans don't. Silently "succeed".
  if (honeypot) {
    return wantsJson
      ? json({ ok: true })
      : Response.redirect(new URL('/thank-you', request.url), 303);
  }

  // 2) Basic validation
  if (!name || !email || !message) {
    return fail('Please fill in your name, email, and a message.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail('That email address doesn’t look right.');
  }
  if (message.length > 5000) {
    return fail('That message is a little long — please shorten it.');
  }

  // 3) Cloudflare Turnstile (only enforced if a secret is configured)
  if (env.TURNSTILE_SECRET) {
    const token = (form.get('cf-turnstile-response') || '').toString();
    if (!token) return fail('Please complete the anti-spam check.');
    const verify = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: token,
          remoteip: request.headers.get('CF-Connecting-IP') || '',
        }),
      }
    );
    const outcome = await verify.json();
    if (!outcome.success) return fail('Anti-spam check failed. Please try again.');
  }

  // 4) Make sure email is configured
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return fail('The contact form isn’t fully set up yet. Please email us directly.', 500);
  }

  // 5) Send via Resend
  const subject = `[The Greenhouse] ${topic} — from ${name}`;
  const text =
    `New message from The Greenhouse contact form\n\n` +
    `Name:  ${name}\n` +
    `Email: ${email}\n` +
    `Topic: ${topic}\n\n` +
    `${message}\n`;

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: `The Greenhouse <${env.CONTACT_FROM}>`,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!send.ok) {
    const detail = await send.text().catch(() => '');
    console.log('Resend error:', send.status, detail);
    return fail('Sorry — we couldn’t send that just now. Please try again shortly.', 502);
  }

  return wantsJson
    ? json({ ok: true })
    : Response.redirect(new URL('/thank-you', request.url), 303);
}
// Any non-POST request to /api/contact returns 405 automatically.
