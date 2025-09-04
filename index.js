export default {
  async fetch(req, env, ctx) {
    if (req.method === 'OPTIONS') return handleOptions(req, env);
    if (req.method !== 'POST') return json({ error: 'Method Not Allowed' }, 405, req, env);

    let data = {};
    try { data = await req.json(); }
    catch { return json({ error: 'Invalid JSON' }, 400, req, env); }

    const {
      first_name = '', work_email = '', company = '', consent = false,
      context = '', timestamp = '', ip = '', page_url = '',
      utm_source = '', utm_medium = '', utm_campaign = '', utm_content = '',
      recaptcha_token = ''
    } = data || {};

    if (!consent || !work_email) {
      return json({ error: 'Missing consent or work_email' }, 400, req, env);
    }

    // Optional: reCAPTCHA server-side verify
    if (env.RECAPTCHA_SECRET) {
      try {
        const body = new URLSearchParams({ secret: env.RECAPTCHA_SECRET, response: recaptcha_token });
        const r = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body });
        const j = await r.json();
        if (!j.success || (j.score !== undefined && j.score < 0.4)) {
          return json({ error: 'Recaptcha failed' }, 400, req, env);
        }
      } catch (e) {
        console.warn('recaptcha verify error', e);
      }
    }

    // 1) Email via Resend (if configured)
    let email_ok = false, email_err = null;
    if (env.RESEND_API_KEY && env.TO_EMAIL && env.FROM_EMAIL) {
      try {
        const subject = `New lead (${context || 'general'}) — ${first_name || work_email}`;
        const text = [
          `Name: ${first_name}`,
          `Email: ${work_email}`,
          `Company: ${company || '-'}`,
          `Context: ${context}`,
          `Time: ${timestamp}`,
          `IP: ${ip || '-'}`,
          `URL: ${page_url}`,
          `UTM: ${utm_source}|${utm_medium}|${utm_campaign}|${utm_content}`
        ].join('\n');

        const resp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: env.FROM_EMAIL,
            to: [env.TO_EMAIL],
            subject,
            text
          })
        });

        email_ok = resp.ok;
        if (!resp.ok) email_err = await resp.text();
      } catch (e) {
        email_err = String(e);
      }
    }

    // 2) Google Sheets store via Apps Script Web App (if configured)
    let sheet_ok = false, sheet_err = null;
    if (env.GSHEET_WEBAPP_URL && env.GSHEET_SECRET) {
      try {
        const payload = {
          first_name, work_email, company, consent, context, timestamp, ip, page_url,
          utm_source, utm_medium, utm_campaign, utm_content
        };
        const r = await fetch(env.GSHEET_WEBAPP_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': env.GSHEET_SECRET
          },
          body: JSON.stringify(payload)
        });
        sheet_ok = r.ok;
        if (!r.ok) sheet_err = await r.text();
      } catch (e) {
        sheet_err = String(e);
      }
    }

    return json({
      ok: true,
      email: email_ok ? 'sent' : (email_err ? `error: ${email_err}` : 'skipped'),
      sheet: sheet_ok ? 'logged' : (sheet_err ? `error: ${sheet_err}` : 'skipped')
    }, 200, req, env);
  }
}

function json(obj, status, req, env) {
  const origin = req.headers.get('Origin') || '*';
  const allow = (env.ALLOW_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = allow.length === 0 || allow.includes(origin);
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed ? origin : '*',
    'Vary': 'Origin',
    'Access-Control-Allow-Credentials': 'true'
  };
  return new Response(JSON.stringify(obj), { status, headers });
}

function handleOptions(req, env) {
  const origin = req.headers.get('Origin') || '*';
  const allow = (env.ALLOW_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  const allowed = allow.length === 0 || allow.includes(origin);
  const headers = {
    'Access-Control-Allow-Origin': allowed ? origin : '*',
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Webhook-Secret',
    'Access-Control-Max-Age': '86400'
  };
  return new Response(null, { status: 204, headers });
}
