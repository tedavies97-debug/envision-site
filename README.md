# EnVision Leads — Cloudflare Worker

Collects leads from your site, emails you (Resend), and logs to Google Sheets (via Apps Script).

## 1) Deploy the Worker
```bash
npm i -g wrangler
wrangler login
wrangler publish
```

### Config
Edit `wrangler.toml`:
- `ALLOW_ORIGINS` — comma list of your site origins (e.g. `https://envision.studio,https://www.envision.studio`).
- `FROM_EMAIL` — sender name/address verified in Resend.
- `TO_EMAIL` — where to receive notifications.
- `GSHEET_WEBAPP_URL` — your Apps Script Web App URL (see below).
- `GSHEET_SECRET` — shared secret for the Web App.

Add secret in Cloudflare:
```bash
wrangler secret put RESEND_API_KEY
```

(Optional) Server-side reCAPTCHA v3:
```toml
RECAPTCHA_SECRET = "your_recaptcha_secret"
```

## 2) Google Sheets logging (Apps Script Web App)
1. Create a new Google Sheet (name it “EnVision Leads”). Add header row:
   `Timestamp, First Name, Email, Company, Consent, Context, IP, Page URL, UTM Source, UTM Medium, UTM Campaign, UTM Content`
2. Extensions → Apps Script. Paste the code below.
3. In Script Properties, add `SECRET` with a random string (e.g., from 1Password).
4. Deploy → New deployment → Type: **Web app** → Execute as: **Me** → Who has access: **Anyone with the link**. Copy the Web App URL.
5. Put the Web App URL in `GSHEET_WEBAPP_URL` and the same secret in `GSHEET_SECRET` in `wrangler.toml`.

### Apps Script (paste in Code.gs)
```js
function doPost(e) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    var reqSecret = e && e.headers && e.headers['x-webhook-secret'];
    if (reqSecret !== secret) return ContentService.createTextOutput('Forbidden').setMimeType(ContentService.MimeType.TEXT);

    var body = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getActiveSheet();
    sh.appendRow([
      new Date(),
      body.first_name || '',
      body.work_email || '',
      body.company || '',
      (body.consent ? 'yes' : 'no'),
      body.context || '',
      body.ip || '',
      body.page_url || '',
      body.utm_source || '',
      body.utm_medium || '',
      body.utm_campaign || '',
      body.utm_content || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false, error: String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

> Security: the Worker sends a header `X-Webhook-Secret: GSHEET_SECRET`. The Apps Script checks it before writing.

## 3) Point your site at the Worker
In your website `.env`:
```
VITE_LEADS_ENDPOINT=https://<your-worker-subdomain>.workers.dev
```
Rebuild and deploy your site.

## 4) Test
```bash
curl -X POST https://<your-worker-subdomain>.workers.dev \
 -H 'Content-Type: application/json' \
 -d '{"first_name":"Alex","work_email":"alex@acme.com","company":"Acme","consent":true,"context":"socials"}'
```

You should receive an email and see a new row in your Sheet.

---

### Notes
- Map the Worker to `/api/leads` on your domain via Cloudflare Routes.
- Swap Resend for SendGrid/Mailgun if you prefer (similar payloads).
- Restrict CORS by setting `ALLOW_ORIGINS` to your exact domain(s). If blank, all origins are allowed.
