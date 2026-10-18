# MeloTube — Account Deletion Page: Deployment Guide

Static page (HTML + CSS + JS, zero build step, zero backend). Deploy once on your
own domain and keep it live permanently — the final URL goes into
**Google Play Console → App content → Data safety → "Delete account URL"**.

## How deletion requests reach your inbox

The form submits **directly to ffvspubg420@gmail.com** via FormSubmit's AJAX
endpoint (`https://formsubmit.co/ajax/...`) — no backend or database needed.
Each submission arrives as a table-formatted email with the requester's account
email, confirmation, and any notes, with Reply-To set to the requester.

- **Spam protection:** hidden honeypot field + FormSubmit filtering.
- **Fallback:** if online sending fails, the page offers a pre-filled email
  (mailto) option so the request is never lost.
- **Third-party note:** request data passes through formsubmit.co's servers to
  deliver the email. If you later prefer a self-hosted endpoint, replace the
  `fetch(...)` call in `script.js` — the form and validation stay the same.

## ⚠️ REQUIRED: activate the inbox (one time, 2 minutes)

FormSubmit requires one-time activation before it delivers:

1. Deploy the page (below).
2. Open the live URL and **submit the form once yourself** (use a real email).
3. Check the **ffvspubg420@gmail.com** inbox for FormSubmit's activation email.
4. Click the activation link inside it.
5. Done — all future submissions now arrive in the inbox automatically.

Until you complete this step, submissions will NOT be delivered.

## Deploy

### Option A — Cloudflare Pages (recommended)
1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   **Create** → **Pages** → **Upload assets**. Name it (e.g. `melotube`),
   upload the folder (or zip) → **Deploy**.
2. Custom domain: **Custom domains** → add e.g. `delete.yourdomain.com` →
   follow the DNS prompt (Cloudflare provisions HTTPS).

### Option B — GitHub Pages
1. New repo (e.g. `melotube-account-deletion`), upload the 3 files to the root.
2. **Settings → Pages** → Deploy from branch `main`, folder `/ (root)` → Save.
3. Custom domain via a `CNAME` file + DNS CNAME to `<username>.github.io`.

## After deploying — test checklist

- [ ] Activation email received and link clicked (step above).
- [ ] Submit a real test request → email arrives in inbox with all fields.
- [ ] Test with an invalid email → inline error shown, nothing sent.
- [ ] Test without checking the confirmation box → error shown.
- [ ] Disable network / block formsubmit.co → mailto fallback appears and works.
- [ ] Page renders cleanly on a phone (responsive check).
- [ ] Paste the final URL into Play Console → Data safety → "Delete account URL".
- [ ] Keep the page live permanently — removing it violates Play policy.

## Operational notes

- **Processing commitment:** verified requests are processed **within 30 days**;
  send a confirmation email when done.
- **Verification:** only act on requests from the email linked to the MeloTube
  account; ask for additional confirmation when unsure; never delete unverified.
- **Retention:** deletion-request correspondence is kept up to **12 months**
  after completion (proof of handling, disputes, legal records).
- **In-app deletion** (Settings → Account → Delete Account) ships in the next
  app update; the page will be updated then to describe it as available.
