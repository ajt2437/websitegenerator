# Setup checklist (Windows)

What this repo does: find local businesses with weak-looking websites → generate a modern preview site for each from a template (~1 second each) → host it on Vercel → prepare an outreach message. A contact-sheet dashboard tracks every lead.

## Already done

- Albert Shiney's name, email, Vercel scope and footer credit removed. Your details go in `settings.json` → `sender` (placeholders marked `<...>`).
- Outreach is **review-first** (`outreach.submit_by_default: false`): nothing is sent until you approve each message.
- Windows fixes: template works with a Windows (CRLF) checkout, UTF-8 file handling in all tools, and `website.cmd` / `Open Dashboard.bat` launchers.
- `.env` created from `.env.example` (key still blank).

## You still need to do

1. **Install Python 3** (https://www.python.org/downloads/, tick "Add python.exe to PATH"). Check: `py -3 --version`.
2. **Copy `settings.example.json` to `settings.json`, then fill in `sender`** (settings.json is gitignored): full name, phone, email, first and last name. These appear in every outreach message.
3. **Firecrawl** (scrapes prospect homepages/contact pages): sign up at https://www.firecrawl.dev, copy the API key, paste it after `FIRECRAWL_API_KEY=` in `.env`. Don't share the key in chat.
4. **Vercel** (hosts previews): create a free account at https://vercel.com. Install Node.js LTS (https://nodejs.org), then run `npm i -g pnpm` and `pnpm dlx vercel@59.16.0 login`. Run `pnpm dlx vercel@59.16.0 teams ls` and put your scope slug in `settings.json` → `vercel_scope`.
5. **Connect Claude connectors** (claude.ai → Settings → Connectors): **Trello** (lead board), **Gmail** (email outreach + reply tracking), **Google Drive** and **Google Docs** (proposal contracts, only needed once a client signs). The browser is built into the Claude app; Claude in Chrome also works. See the connector table in `SKILL.md` → Starting a run.
6. Optional, only if you edit the template: `py -3 tools\quick_site.py prepare` (needs Node.js).

## Try it

```bat
website.cmd --name "Test Sparks Ltd" --phone "+1 555 010 0199" --email "hi@test.example" --city "Austin" --theme-color "#e11d48"
```

Output lands in `runs\quick\<id>\site\` — a ready-to-host static site. Double-click `Open Dashboard.bat` to see the contact sheet at http://127.0.0.1:4310.

## Running a batch with Claude

Ask Claude something like: *"Using the websitegenerator repo, find 5 electricians in Austin, TX with weak websites, build previews and prepare outreach for my review."* Only an **electrician** template exists today; other trades need a new template first.

## Notes

- The skill docs (`SKILL.md`, `skills/`, `references/`) were written for OpenAI Codex (`iab` browser, `gpt-5.6-terra` workers). Claude can follow the same workflow with its own browser; the model/worker settings are ignored.
- Unsolicited outreach may be regulated where you operate (e.g. CAN-SPAM, GDPR/PECR, CASL). Respect opt-out notices; the workflow already skips CAPTCHAs and "no solicitation" forms.

## Client sites on Firebase Hosting

Previews stay on Vercel (noindex). Paying clients go to Firebase: one shared project, one Hosting site + custom domain per client.

One-time:
1. https://console.firebase.google.com → Create project (e.g. `zentek-sites`; Analytics off). Put its project ID in `settings.json` → `firebase.project_id`.
2. In that project: Build → Hosting → Get started (click through).
3. `npx firebase-tools login`, then check with `npx firebase-tools projects:list`.

Per client:
1. `py -3 tools\client_release.py create-site --site quantum-electric`
2. `py -3 tools\client_release.py prepare --id <site-id> --site quantum-electric --domain www.clientdomain.com`
3. `py -3 tools\client_release.py deploy --id <site-id>` → live at `https://quantum-electric.web.app`
4. `py -3 tools\client_release.py domain --site quantum-electric --domain clientdomain.com --domain www.clientdomain.com` → prints the DNS records to add at the client's registrar (on the agreed switch-over date). Check progress with `domain-status`. Needs the Google Cloud CLI once: install from https://cloud.google.com/sdk/docs/install, then `gcloud auth login`.

### Google Cloud CLI (one-time, for custom domains)

`tools\client_release.py domain` uses the Firebase Hosting API through the Google Cloud CLI.

1. Install the Google Cloud CLI for Windows: https://cloud.google.com/sdk/docs/install
2. Run `gcloud init`, sign in as the Firebase account (zentekdigitalbusiness@gmail.com) and pick project `zentek-sites`.
   - A "Compute Engine API has not been used ... or it is disabled" error at the end is harmless: gcloud tries to set a default compute zone. Don't enable Compute Engine; it isn't needed and may require billing.
   - Optional, to silence it: `gcloud config unset compute/region` and `gcloud config unset compute/zone`.
3. Check: `gcloud auth print-access-token` prints a long token starting with `ya29.` (don't share it).
4. Keep the Firebase APIs (including Firebase Hosting API) enabled. Verify at https://console.cloud.google.com/apis/dashboard?project=zentek-sites — Compute Engine API should not be listed.
