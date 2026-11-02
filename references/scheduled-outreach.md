# Scheduled first-message outreach (runs unattended)

Operator: Abelardo Torres (Zentek). Standing consent: `settings.json` → `outreach.submit_by_default` is `true`, so every job at stage `ready` gets its first message without a separate approval. If that setting is `false`, do NOT send anything: list the ready jobs and stop.

## Steps

1. `cd` to the repo (connected folder `websitegenerator`). Run `python3 tools/control.py state`. Collect jobs with stage `ready`. If none, finish with a one-line "nothing to send" summary.
2. For each ready job (one at a time, never in parallel):
   - Read `runs/JOB_ID/facts.json` (business facts, `mode`, `contact_url`) and `runs/JOB_ID/outreach.txt` (the exact message). If `outreach.txt` is missing, build it from `references/outreach.md` with the job's verified preview URL; never send a message containing a placeholder.
   - Never contact a business that already has a Trello card in **Leads · Not Interested**, or a job already `complete`/`sent`/`uncertain`.
   - **Form jobs** (`mode: form`): open `contact_url` in the built-in browser. Recheck the form is still a general contact form with a message field. If a visible CAPTCHA, a no-solicitation notice, or a required commitment appears: do not submit; run `manual-outreach` (see references/manual-outreach.md) and move on. Otherwise fill per references/outreach.md "Form operation": sender name/first/last/phone/email from `settings.json` → `sender`; any required address field gets the business's own public address from facts.json; paste `outreach.txt` exactly into the message field; leave marketing/SMS consent boxes unchecked. Then:
     `python3 tools/control.py contact-begin --job JOB --worker WORKER --message-file runs/JOB/outreach.txt --form-url URL` (WORKER = the job's current worker in `state`). Click Submit ONCE. Then `contact-finish --status submitted --evidence '<what the page showed>'`. If unsure whether the click happened, use `--status uncertain` and never retry.
   - **Email jobs** (`mode: manual` with an email): build the HTML with `python3 tools/outreach_html.py runs/JOB/outreach.txt`, then send ONE Gmail message to the verified email: subject `Your landing page is leaving conversions on the table`, `htmlBody` = outreach.html, `body` = outreach.txt. Record it with `contact-begin` (use `--form-url mailto:EMAIL`) + `contact-finish --status sent --evidence 'Gmail message id ...'`; if the ledger rejects that (it rejects `mailto:`), use `manual-outreach` and then `python3 tools/control.py manual-sent --job JOB --evidence 'Gmail to EMAIL on DATE, message id ...'` so the dashboard shows it as sent, not as manual contact needed.
   - **Trello**: on the ZenTek board, search for the business first (no duplicates), then create a card in **Leads · Preview Sent** named `Business (City)` with: preview URL, original site, phone/email/address, how and when sent + observed result, site ID and job ID, the two findings from facts.json. Due date = 7 days later, 09:00 America/New_York.
3. If a browser site approval is pending or the browser/computer is unreachable, skip that job (leave it `ready`), and list it in the summary so the next run retries it.
4. Finish with a short summary sent to the operator: sent / manual / skipped (with reason) per business, and preview URLs.

## Rules

- One submit per job, ever. Never resend after an ambiguous result.
- Keep the fixed message wording; no price in the first message.
- Hyperlinks only in the email HTML; forms get the full plain URL.
