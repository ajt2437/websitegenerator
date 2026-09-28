# Client release on Firebase Hosting

Previews live on Vercel with `noindex` and exist only to show a prospect. A client release is a separate, indexable copy on the client's own Firebase project. Only run it after the operator confirms the client signed.

## Inputs

- Site ID: the folder name under `runs/quick/` (also in `runs/batches/*.result.json`).
- Firebase project ID: 6–30 chars, lowercase letters/digits/dashes. One project per client so ownership can be handed over (add the client as Owner in Firebase console → Project settings → Users and permissions).
- Optional custom domain, e.g. `www.clientdomain.com`.

## Steps

```sh
python3 tools/client_release.py prepare --id SITE_ID --project PROJECT_ID --domain www.clientdomain.com
python3 tools/client_release.py deploy --id SITE_ID
```

On Windows use `py -3` instead of `python3`. `deploy` runs `npx firebase-tools deploy --only hosting` inside `runs/clients/SITE_ID/`; the operator must have run `npx firebase-tools login` once. `prepare` is safe to rerun: it rebuilds `public/` from the preview.

What `prepare` changes compared with the preview:
- removes `<meta name="robots" content="noindex...">` and replaces `robots.txt` with `Allow: /`;
- drops `vercel.json`, `_redirects`, `.vercel/`, `.env*` and `.gitignore`;
- writes `firebase.json` (SPA rewrite to `/index.html`, long cache for `/assets/**`, dotfiles ignored) and `.firebaserc`.

## Verify before telling the client

- `https://PROJECT_ID.web.app` loads in a logged-out window; a service route (e.g. `/services`) loads directly.
- Business name, phone and email links are correct; no `noindex` in page source.
- The quote/contact forms are previews and send nothing. Tell the operator before go-live; do not claim a working lead form.

## Custom domain

Firebase console → Hosting → Add custom domain → follow the TXT/A records it lists at the client's registrar. SSL is issued automatically after DNS propagates (minutes to ~24 h). Record the domain and live URL with the job.

## Boundaries

No purchases, plan upgrades or billing changes. Do not touch the client's existing site or DNS without the operator's explicit instruction. The Spark (free) plan covers typical small-business traffic; the operator decides on paid plans.

## Proposal / contract (before the release)

When a lead moves to **Leads · Signed ($500)**, prepare the client's proposal from the Google Doc template in `settings.json` → `contracts`:
1. Drive `copy_file` the template into the Leads folder, titled `BUSINESS NAME - YYYY/MM/DD`. Never edit the template itself.
2. Docs `update_doc` with `replaceAllText` for every placeholder in `contracts.placeholders` (scope `tabsCriteria` to the doc's tab). Ask the operator for any value you don't have (client's name, meeting date); never invent one. Prices ($500 one-time, $25/month) are written into the template.
3. Re-read the copy and confirm no `{{` remains; link the Doc on the lead's Trello card.
4. The operator reviews, exports PDF and sends it for signature.
