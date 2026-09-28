# Friendly outreach and a single submit attempt

**Review-first mode (current setting: `outreach.submit_by_default` is `false`).** Build, deploy and verify each preview and prepare its exact message in `runs/JOB_ID/outreach.txt`, but do not submit any contact form until the operator has reviewed and approved that specific job's message and destination in the current conversation. Present ready jobs together for approval (business, preview URL, form URL, final message), then send only the approved ones. If `submit_by_default` is later set to `true`, the operator's request for a real batch counts as standing consent to send the fixed message below. The message is the fixed English text below, substituting only the verified preview URL, the business name in the optional subject, and the operator's sender details from `settings.json` → `sender`. Complete the full workflow and record the result. A later dry-run/review-only instruction or withdrawal of consent overrides this authorization. Include the verified preview link in the first message. Use the same English wording every time; keep the operator's name, phone and email (from `settings.json` → `sender`) exact. Translate only if the operator explicitly requests it. Don't mimic a customer requesting service.

## Default message

Subject if requested: `I made a website preview for [Business]`

> Hey!
>
> Your website is decent, but looks a little old.
> I made an updated one.
>
> You can take a look here: [verified preview URL]
>
> It's yours for a one-time $500, plus hosting costs.
>
> If you'd like help setting it up, text me on <SENDER_PHONE> or email <SENDER_EMAIL>.
>
> Best,
> <SENDER_FIRST_NAME>

Replace `<SENDER_PHONE>`, `<SENDER_EMAIL>` and `<SENDER_FIRST_NAME>` with `settings.json` → `sender` values; never send a message that still contains a placeholder. Copy this message exactly, changing only the verified preview URL and the business name in the optional subject. Do not add an observed issue, 'I checked your website', SEO claims, custom praise, or a rewritten opening. Visual qualification findings remain internal evidence; 'looks a little old' describes visual appearance, not the site's actual age. Keep the offer ($500 one-time for the website, plus hosting at cost) and sender details above. Do not name a hosting amount in the first message; the operator quotes it when the business replies. Do not spin messages or send follow-ups to hit a quota.

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
