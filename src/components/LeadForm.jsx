import { useState } from 'react'

export default function LeadForm({ context }){
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const getUTMs = () => {
    const p = new URLSearchParams(window.location.search)
    return ['utm_source','utm_medium','utm_campaign','utm_content'].reduce((acc,k)=>{acc[k]=p.get(k)||'';return acc;}, {})
  }

  async function onSubmit(e){
    e.preventDefault(); setError(""); setSubmitting(true)
    const fd = new FormData(e.currentTarget)
    const payload = {
      first_name: fd.get('first_name')||'',
      work_email: fd.get('work_email')||'',
      company: fd.get('company')||'',
      consent: !!fd.get('consent'),
      context,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...getUTMs(),
    }
    if(!payload.consent){ setError('Please tick consent.'); setSubmitting(false); return }
    try { const r = await fetch('https://api.ipify.org?format=json'); const j = await r.json(); payload.ip=j.ip } catch{}
    try { window.gtag && window.gtag('event','lead_magnet_submit',{context}) } catch{}
    try {
      const endpoint = import.meta.env.VITE_LEADS_ENDPOINT || '/api/leads'
      await fetch(endpoint,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    } catch(e){ console.warn('Lead POST failed:', e) }
    window.location.hash = '/thanks'
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="text-sm opacity-80">First name</label>
        <input required name="first_name" className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"/>
      </div>
      <div className="grid gap-2">
        <label className="text-sm opacity-80">Work email</label>
        <input required type="email" name="work_email" className="px-3 py-2 rounded-lg bg-white/10 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary"/>
      </div>
      <div className="grid gap-2">
        <label className="text-sm opacity-80">Company (optional)</label>
        <input name="company" className="px-3 py-2 rounded-lg bg-white/10 border border-white/10"/>
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="consent" className="mt-1"/>
        <span>I agree to be contacted by EnVision and accept the <a href="#/privacy" className="underline">Privacy Policy</a>.</span>
      </label>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button disabled={submitting} className="mt-2 px-5 py-3 rounded-xl font-medium disabled:opacity-60 bg-primary text-bg">{submitting? 'Submitting…' : 'Get the mini-audit'}</button>
    </form>
  )
}
