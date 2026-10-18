# MeloTube — Account Deletion Page: Deployment Guide

Production-ready static page (HTML + CSS + JS, zero build step, zero backend).
Deploy it once on your own domain and keep it live permanently — this URL goes
into **Google Play Console → App content → Data safety → "Delete account URL"**.

## Files

| File          | Purpose                                  |
|---------------|------------------------------------------|
| `index.html`  | Page content (deletion options, policy)  |
| `styles.css`  | Styling (dark MeloTube theme, responsive)|
| `script.js`   | Form validation + pre-filled email flow |

## Step 0 — Set your support email (REQUIRED, 1 minute)

Open `script.js` and replace this single line:

```js
var SUPPORT_EMAIL = "YOUR_SUPPORT_EMAIL_HERE";
```

with your real support email, e.g.:

```js
var SUPPORT_EMAIL = "support@zabidev.com";
```

That is the **only** place the address lives — every button, link, and visible
email on the page is generated from it. Use the same email you put in the
privacy policy, and make sure the inbox is monitored.

## Option A — Cloudflare Pages (recommended)

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages**
   → **Create** → **Pages** → **Upload assets** (no git needed).
2. Name the project (e.g. `melotube`), drag the **folder** containing the 3 files
   (or a zip of it) into the upload area → **Deploy**.
3. You get `https://melotube.pages.dev` instantly. For your own domain:
   **Custom domains** → **Set up a custom domain** → e.g.
   `delete.yourdomain.com` → follow the DNS prompt (Cloudflare handles the cert).
4. Done. URL is permanent as long as the project exists.

## Option B — GitHub Pages

1. Create a repo (e.g. `melotube-account-deletion`), upload the 3 files to the
   repo root (or `docs/` folder).
2. Repo **Settings → Pages** → Source: **Deploy from a branch** → branch `main`,
   folder `/ (root)` (or `/docs`) → **Save**.
3. Live at `https://<username>.github.io/melotube-account-deletion/`.
4. Custom domain: add a file named `CNAME` containing just your domain
   (e.g. `delete.yourdomain.com`), then point a DNS CNAME record at
   `<username>.github.io`. GitHub provisions HTTPS automatically.

## After deploying

1. Open the URL, submit the form once to confirm your email app opens with a
   pre-filled request.
2. Paste the final URL into **Play Console → App content → Data safety →
   "Delete account URL"**.
3. Keep the page live permanently — removing it violates Play policy.

## Notes

- No server, database, or secrets involved: the request travels as a real email
  from the user's own email app to your support inbox. Ownership is verified
  because the request must come from the account's email address.
- The in-app path (MeloTube → Settings → Account → Delete Account) remains the
  fastest option and is documented at the top of the page.
