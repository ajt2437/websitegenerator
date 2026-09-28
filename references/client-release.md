# Client release on Firebase Hosting

Previews live on Vercel with `noindex` and exist only to show a prospect. A client release is a separate, indexable copy on Firebase Hosting. Only run it after the operator confirms the client signed.

## Layout: one project, one site per client

All client sites share one Firebase project (`settings.json` → `firebase.project_id`, e.g. `zentek-sites`). Each client gets its own Hosting site (`SITE.web.app`) and its own custom domain. Reasons: the free Spark plan limits a Google account to roughly 5–10 projects, while one project holds roughly 36 sites; one login and dashboard; matches the proposal's "website will be under ZenTek account for hosting". If a client later leaves and wants to own hosting, create a project for them, deploy there, and move their domain.

## Inputs

- Site ID: the folder name under `runs/quick/` (also in `runs/batches/*.result.json`).
- Hosting site name: derived from the business name, globally unique across Firebase (`quantum-electric`, add `-atx` etc. if taken).
- Optional custom domain, e.g. `www.clientdomain.com`.

## Steps

```sh
python3 tools/client_release.py create-site --site SITE
python3 tools/client_release.py prepare --id SITE_ID --site SITE --domain www.clientdomain.com
python3 tools/client_release.py deploy --id SITE_ID
```

On Windows use `py -3` instead of `python3`. The operator must have run `npx firebase-tools login` once. `prepare` is safe to rerun: it rebuilds `public/` from the preview.

What `prepare` changes compared with the preview:
- removes `<meta name="robots" content="noindex...">` and replaces `robots.txt` with `Allow: /`;
- drops `vercel.json`, `.vercelignore`, `_redirects`, `.vercel/`, `.env*` and `.gitignore`;
- writes `firebase.json` (`hosting.site`, SPA rewrite to `/index.html`, long cache for `/assets/**`, dotfiles ignored) and `.firebaserc` pointing at the shared project.

## Verify before telling the client

- `https://SITE.web.app` loads in a logged-out window; a service route (e.g. `/services`) loads directly.
- Business name, phone and email links are correct; no `noindex` in page source.
- The quote/contact forms are previews and send nothing. Tell the operator before go-live; do not claim a working lead form.

## Custom domain

Add the client's domain(s) to their site through the Hosting API (the firebase CLI has no domain command). Needs the Google Cloud CLI signed in once as the Firebase account (`gcloud auth login`):

```sh
python3 tools/client_release.py domain --site SITE --domain clientdomain.com --domain www.clientdomain.com
python3 tools/client_release.py domain-status --site SITE --domain clientdomain.com
```

`domain` registers the domains and prints `dns_records_to_set` (type, host, value, ADD/REMOVE). Give those to the operator, who adds them at the client's registrar on the agreed switch-over date; the script never changes DNS. Re-run `domain-status` until `host_state` is `HOST_ACTIVE` and `cert_state` is active (minutes to ~24 h). If gcloud is unavailable, fall back to Firebase console → Hosting → the site → Add custom domain. The client's current site stops showing once DNS switches. Record the domain and live URL on the Trello card.

## Boundaries

No purchases, plan upgrades or billing changes. Do not touch the client's existing site or DNS without the operator's explicit instruction. Package 1 ($500 + $25/month) gets no analytics. Package 2 ($750 + $35/month) adds Google Analytics, call/email click tracking, Search Console and a monthly visitor report (see `settings.json` → `packages`); the generator does not add analytics yet, so tell the operator it must be set up before a Package 2 site goes live.

## Proposal / contract (before the release)

When a lead moves to **Leads · Signed ($500)**, prepare the client's proposal from the Google Doc template in `settings.json` → `contracts`:
1. Drive `copy_file` the template into the Leads folder, titled `BUSINESS NAME - YYYY/MM/DD`. Never edit the template itself.
2. Docs `update_doc` with `replaceAllText` for every placeholder in `contracts.placeholders` (scope `tabsCriteria` to the doc's tab). Ask the operator for any value you don't have (client's name, meeting date); never invent one. Both packages and prices are written into the template; the client ticks one at signing. Note the chosen package on the Trello card.
3. Re-read the copy and confirm no `{{` remains; link the Doc on the lead's Trello card.
4. The operator reviews, exports PDF and sends it for signature.
