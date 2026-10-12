# Friendly outreach and a single submit attempt

**Review-first mode (current setting: `outreach.submit_by_default` is `false`).** Build, deploy and verify each preview and prepare its exact message in `runs/JOB_ID/outreach.txt`, but do not submit any contact form until the operator has reviewed and approved that specific job's message and destination in the current conversation. Present ready jobs together for approval (business, preview URL, form URL, final message), then send only the approved ones. If `submit_by_default` is later set to `true`, the operator's request for a real batch counts as standing consent to send the fixed message below. The message is the fixed English text below, substituting only the placeholders listed under Default message from `settings.json` → `sender`. Complete the full workflow and record the result. A later dry-run/review-only instruction or withdrawal of consent overrides this authorization. Include the verified preview link in the first message. Use the same English wording every time; keep the operator's name, phone and email (from `settings.json` → `sender`) exact. Translate only if the operator explicitly requests it. Don't mimic a customer requesting service.

## Default message

Source: Google Drive `cold calling script/Landing-Page-Cold-Email.docx`, Cold Email Version 1, kept word for word. The only changes are the filled placeholders and the one added preview-link sentence.

Subject: `Your landing page is leaving conversions on the table`

> Hi [First Name],
>
> We came across [Company] through a local search. The product looks solid—but we noticed your landing page looks dated, slow, or doesn't clearly sell what makes you different.
>
> Most early-stage teams deprioritize the landing page. Meanwhile, it's the first impression for new and returning customers. A few hours of focused design and development usually turns a template-looking page into one that actually converts—and takes almost no engineering bandwidth.
>
> One recent example: ZenTEK rebuilt a landing page for a startup, went from generic template to custom and cohesive, and their conversion rate went from 2% to 5% on the same traffic.
>
> We also put together a preview of an updated site: [verified preview URL]
>
> Worth 15 minutes to walk through what we'd change on [Company]'s page? It's a quick conversation; you walk away with concrete ideas either way.
>
> <CONTACT_LINE>
>
> Best,
>
> <SENDER_NAME>
>
> ZenTEK
>
> <SENDER_CONTACT> | <SENDER_WEBSITE>

Fill only these: `[First Name]` = the owner/contact's first name when publicly verified, otherwise `there` (so it reads "Hi there,"); `[Company]` = the business name exactly as it appears on its website; `[verified preview URL]` = the verified public preview; `<SENDER_NAME>`, `<SENDER_PHONE>`, `<SENDER_WEBSITE>` = `settings.json` → `sender` values (`name`, `phone`, `website`); `<SENDER_CONTACT>` (signature line only) = `sender.calendly` when it is set and non-empty, otherwise `sender.phone`. `<CONTACT_LINE>` = when `sender.calendly` is set and non-empty: "Book a 15-minute call at a time that works for you here: <calendly link>." Otherwise the doc's original line: "Reach us at <SENDER_PHONE>." Never send a message that still contains a placeholder. Copy everything else exactly, including the subject. Do not add an observed issue, custom praise, other results/statistics, or a rewritten opening. **Do not mention any price in the first message** — no website price, hosting amount or package. The operator quotes pricing ($500 one-time + hosting, or the $750 analytics package) when the business replies. Do not spin messages or send follow-ups to hit a quota.

## Email version with clickable links

Contact forms accept plain text only, so form submissions use `outreach.txt` with the raw preview URL. When the message goes by email (Gmail, manual outreach), send the HTML version built by `python3 tools/outreach_html.py runs/JOB_ID/outreach.txt` (writes `outreach.html`) as `htmlBody`, with `outreach.txt` as the plain-text `body`. The HTML version keeps the same wording but turns the raw links into link text: "We also put together a [preview of an updated site]." , "Book a 15-minute call at a time that works for you [here]." and the signature "[Book a 15-minute call] | [zentek365.com]".

## Confirmation classification

Ordinary authorized website-proposal outreach with public business contact details and a public preview link does not automatically require per-form confirmation. Follow the active tool policy for routine low-impact communication. If a particular form creates a legal commitment, discloses sensitive information, or triggers an explicit approval review, apply that specific rule and report its source. Do not claim the browser rejected an action unless a tool actually returned that rejection. Never work around a real restriction or repeat a submission with an uncertain outcome.

## Check the form before building

During qualification, use [Firecrawl screening](firecrawl-scouting.md) of the original website’s contact page, falling back to browser inspection for ambiguous/embedded forms, and confirm a form suitable for a website proposal, including a message field and submit control. Save its URL as `contact_url` and record the observed fields and any restrictions in the qualification evidence. Email/phone listings, newsletter signups and customer-review forms do not qualify. If no usable form exists but the business otherwise qualifies, follow [Manual outreach](manual-outreach.md): still build, deploy and verify the site, prepare the message and verified contact details, then mark manual. Apply the form rules below during this check, then recheck the saved form before sending.

## Form operation

1. Inspect the original contact page in the worker's own browser tab. Prefer its general enquiry form. The operator also authorizes inspection-request forms for this website offer: clearly state this is a website proposal, not an inspection request; leave optional appointment dates and pest categories blank. Respect a visible no-solicitation/opt-out notice; save a skipped result. Do not fabricate a pest problem or book a paid service; do not use forms requiring unsupported facts or commitments; prepare manual outreach for an otherwise eligible business.
2. Use `sender.name` in a full-name field, `sender.first_name` for first name and `sender.last_name` for surname (all from `settings.json`). Supply `sender.phone` and `sender.email` in corresponding fields. For a required business or service-location address, use the prospect's verified publicly listed company address verbatim (from its website or Google result); record the source with the outreach evidence. Never present that address as the operator's personal or sender address, and do not invent an address, account or consent. Leave visible CAPTCHA challenges untouched and route the qualified business to manual outreach after completing its website. Do not check newsletter/marketing-consent boxes. An invisible anti-bot badge alone is not a challenge; stop if a challenge appears.

3. Save `runs/JOB_ID/outreach.txt` with the exact final message and record the form URL. Fill and inspect the form before reserving the attempt. Check that fields show the correct sender, fixed message and verified URL.
4. Immediately before submitting, atomically reserve:

```sh
python3 tools/control.py contact-begin --job JOB_ID --worker WORKER_ID --message-file runs/JOB_ID/outreach.txt --form-url 'https://business.example/contact'
```

This rejects duplicate/reserved attempts, missing qualification, failed QA and unverified previews. If reservation fails, do not submit. Then click Submit **once**.

5. Record actual outcome:

```sh
python3 tools/control.py contact-finish --job JOB_ID --worker WORKER_ID --status submitted --evidence 'Clicked Submit once; observed result: ...; screenshot stored at ...'
```

Use `submitted` after the single submit action, marking the job `complete` and moving on. Record exactly what happened (confirmation, cleared form, or no confirmation); completion means the outreach action is done, not proof of delivery. Do not wait for explicit acceptance. If a visible CAPTCHA or validation error prevents submission before reservation, follow the manual-outreach command for the ready website. After reservation, use `contact-finish --status blocked` when it is certain no submit action occurred; `contacting` cannot transition to `skipped`. Keep the reservation and never make this prospect retryable. If it is unknown whether the submit action occurred at all (e.g. crash during the action), use `uncertain`. Never resend completed or ambiguous attempts, and do not switch to email/SMS without a separate instruction.

For CAPTCHA encountered before reservation, use `manual-outreach` after public verification, preserving the preview and evidence. Do not mark an otherwise qualified prospect skipped for its contact method. Resolve ordinary address requirements with the verified company address above; do not mark a job blocked merely because a form asks for that address.
