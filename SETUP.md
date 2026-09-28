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

Previews stay on Vercel (noindex). When a client signs, publish their site to Firebase:

1. Create a Firebase project for the client at https://console.firebase.google.com (one project per client makes handover easy). Note its project ID.
2. `npx firebase-tools login` (once per computer).
3. `py -3 tools\client_release.py prepare --id <site-id> --project <firebase-project-id> --domain www.clientdomain.com`
   Copies the preview to `runs\clients\<site-id>\`, removes the noindex tags and writes `firebase.json`.
4. `py -3 tools\client_release.py deploy --id <site-id>` → live at `https://<project-id>.web.app`.
5. In Firebase console → Hosting → Add custom domain, then add the DNS records it shows at the client's domain registrar.
