# Follow-up email (one per lead, sent by the Monday morning task)

Operator: Abelardo Torres (Zentek). He asked for this follow-up to be sent automatically by the scheduled Monday task, so a due lead needs no separate approval. This is independent of `outreach.submit_by_default`, which only governs first messages.

## Who gets one

A card in **Leads · Preview Sent** on the ZenTek board whose due date is today or earlier and not marked complete, where Gmail (`in:anywhere`, including spam) shows:
- no reply from the business's address or domain since the first message,
- no bounce (mailer-daemon) for that address,
- no follow-up already sent to that address (search `in:sent "wanted to follow up"`).

A reply means no follow-up: leave the card for the response check. A bounce means no follow-up: add a card comment "First email bounced, no follow-up sent" and move on. Never send a second follow-up.

Only email leads get this. If the card says the first message went through a contact form (no email address), skip it and list it in the summary as "follow up by hand".

## Message

Send it as a reply in the original Gmail thread (the first message's id is on the card), so the subject becomes `Re: Your landing page is leaving conversions on the table`. `[First Name]` is the name the first email used ("Hi Chadrick," → Chadrick; "Hi there," → there). `[Company]` and `[preview URL]` come from the card. Calendly and website come from `settings.json` → `sender`.

Plain-text body:

```
Hey [First Name], wanted to follow up on the website preview we put together for [Company]: [preview URL]

Still happy to grab 15 minutes if you're interested. Otherwise, no worries!

Book a 15-minute call at a time that works for you here: [calendly]

Best,
Abelardo Torres
ZenTEK
[calendly] | zentek365.com
```

HTML body (same wording, links as link text):

```html
<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222"><p>Hey [First Name], wanted to follow up on the <a href="[preview URL]">website preview</a> we put together for [Company].</p><p>Still happy to grab 15 minutes if you're interested. Otherwise, no worries!</p><p><a href="[calendly]">Book a 15-minute call</a> at a time that works for you.</p><p>Best,<br>Abelardo Torres<br>ZenTEK<br><a href="[calendly]">Book a call</a> | <a href="https://zentek365.com">zentek365.com</a></p></div>
```

No price, no new claims. Never send a message that still contains a placeholder.

## After sending

On the card: add a comment `Follow-up sent <YYYY-MM-DD> by Gmail reply (message id ...)`, mark the due date complete, and move it to **Leads · Followed up**.

In the dashboard ledger, using the Site ID / Job ID from the card: `python tools/control.py follow-up-sent --job JOB --evidence 'Gmail reply on <YYYY-MM-DD> in the original thread, message id ... (to EMAIL)'`. This adds the follow-up to the job's activity. It refuses a second follow-up for the same job; if it does, do not send again. The Monday 9:00 AM response check closes it as "no response" once the follow-up is at least 3 days old.
