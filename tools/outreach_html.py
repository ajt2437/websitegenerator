#!/usr/bin/env python3
"""Build the HTML (email) version of a prepared plain-text outreach message.

Contact forms only accept plain text, so forms keep the raw URL from outreach.txt.
Emails get this HTML version: the preview URL, the Calendly link and the website
become short clickable link text. Wording is otherwise identical to outreach.txt.
Usage: python3 tools/outreach_html.py runs/JOB_ID/outreach.txt  -> writes runs/JOB_ID/outreach.html
"""
import html, re, sys
from pathlib import Path

CALL_TEXT = 'Book a 15-minute call'

def build(text):
    paras = [p.strip() for p in text.strip().split('\n\n')]
    out = []
    for p in paras:
        e = html.escape(p)
        e = re.sub(r'We also put together a preview of an updated site: (https://\S+)',
                   lambda m: f'We also put together a <a href="{m.group(1)}">preview of an updated site</a>.', e)
        e = re.sub(r'(Book a 15-minute call at a time that works for you )here: (https://\S+?)\.$',
                   lambda m: f'{m.group(1)}<a href="{m.group(2)}">here</a>.', e)
        # signature line: "<calendly or phone> | <website>"
        m = re.fullmatch(r'(https://\S+) \| (\S+)', e)
        if m:
            e = f'<a href="{m.group(1)}">{CALL_TEXT}</a> | <a href="https://{m.group(2)}">{m.group(2)}</a>'
        else:
            m = re.fullmatch(r'(.+) \| ([a-z0-9.-]+\.[a-z]{2,})', e)
            if m: e = f'{m.group(1)} | <a href="https://{m.group(2)}">{m.group(2)}</a>'
        out.append(f'<p>{e}</p>')
    return '<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.5;color:#222">' + ''.join(out) + '</div>\n'

if __name__ == '__main__':
    src = Path(sys.argv[1]); dst = src.with_suffix('.html')
    dst.write_text(build(src.read_text(encoding='utf-8')), encoding='utf-8'); print(dst)
