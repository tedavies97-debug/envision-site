import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Reticle from '../components/Reticle.jsx'
import LeadForm from '../components/LeadForm.jsx'

const TOKENS = { bg:'#0B1020', surface:'#0F172A', text:'#E2E8F0', primary:'#6366F1', accent:'#22D3EE' }
const Gradient = ({children}) => (<span className="bg-clip-text text-transparent" style={{backgroundImage:`linear-gradient(90deg, ${TOKENS.primary}, ${TOKENS.accent})`}}>{children}</span>)
const Card = ({children}) => (<div className="rounded-2xl p-6 border border-white/10 bg-white/5">{children}</div>)

function Nav(){
  return (
    <header className="sticky top-0 z-30 backdrop-blur border-b border-white/10" style={{background:'rgba(15,23,42,.6)'}}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/social" className="flex items-center gap-3"><Reticle size={28}/><span className="font-sora font-bold text-primary">EnVision</span></Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link to="/social" className="hover:opacity-90">Socials</Link>
          <Link to="/pricebot" className="hover:opacity-90">Pricebot</Link>
          <Link to="/social" className="px-3 py-2 rounded-lg bg-primary text-bg">Book intro</Link>
        </nav>
      </div>
    </header>
  )
}

function Hero({title, sub}){
  const nav = useNavigate()
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-sora font-bold">{title}</h1>
          <p className="mt-4 text-lg opacity-90">{sub}</p>
          <div className="mt-8 flex gap-3">
            <button onClick={()=>nav('/social')} className="px-5 py-3 rounded-xl font-medium bg-primary text-bg">Book a 15-min intro</button>
            <button onClick={()=>nav('/social')} className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/5">Get the mini-audit</button>
          </div>
        </div>
        <div className="justify-self-center"><div className="rounded-2xl p-8 border border-white/10 bg-white/5 shadow-xl"><Reticle size={180}/></div></div>
      </div>
    </section>
  )
}

function Packages(){
  const Item = ({title, price, items}) => (
    <Card><h3 className="text-xl font-sora font-bold">{title}</h3><p className="mt-1 text-2xl text-accent">{price}</p><ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5">{items.map((x,i)=>(<li key={i}>{x}</li>))}</ul></Card>
  )
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <Item title="Starter" price="£300 / mo" items={["4 posts/mo","1 reel/mo","£50 ad test","Monthly report"]}/>
      <Item title="Growth" price="£600 / mo" items={["8–12 posts/mo","1 reel/wk","£50–£200 tests","Comment DMs (30m/day)","GA4/Pixel + strategy call"]}/>
      <Item title="Performance" price="£1,000 / mo" items={["Everything in Growth","1 on-site content day","UGC briefs","A/B ad creatives","Looker dashboard"]}/>
    </div>
  )
}

function Social(){
  return (
    <>
      <Hero title={<><span>Short-form that </span><Gradient>books calls</Gradient><span> + tiny ad tests that </span><Gradient>actually learn</Gradient></>} sub="We plan, shoot and edit weekly content; run £50–£200 experiments; and report in plain English."/>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-sora font-bold mb-6">Packages</h2>
        <Packages/>
        <div className="mt-12 grid md:grid-cols-2 gap-10">
          <Card><h3 className="font-sora font-bold">Get a free socials mini-audit</h3><p className="opacity-80 text-sm mt-1">We’ll send a 1-page quick wins sheet for your niche.</p><div className="mt-4"><LeadForm context="socials"/></div></Card>
          <Card><h3 className="font-sora font-bold">What we measure</h3><ul className="list-disc pl-5 mt-2 text-sm opacity-90 space-y-1"><li>Reach, profile actions, link clicks</li><li>Leads via DMs & forms</li><li>Cost per lead from paid tests</li><li>Top hooks and retention</li></ul></Card>
        </div>
      </section>
    </>
  )
}

function Pricebot(){
  const Tier = ({title, price, items}) => (<Card><h3 className="text-xl font-sora font-bold">{title}</h3><p className="mt-1 text-2xl text-accent">{price}</p><ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5">{items.map((x,i)=>(<li key={i}>{x}</li>))}</ul></Card>)
  return (
    <>
      <Hero title={<><span>Weekly pricing </span><Gradient>Top-10 actions</Gradient><span> that protect </span><Gradient>margin</Gradient><span> and win the sale.</span></>} sub="We scan your competitors, flag undercuts/MAP, and send a simple action sheet."/>
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-sora font-bold mb-6">Tiers</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card><h3 className="font-sora font-bold">Lite</h3><p className="mt-1 text-2xl text-accent">£99 / mo</p><ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5"><li>Up to 250 SKUs</li><li>Weekly scan</li><li>Top-10 actions email</li></ul></Card>
          <Card><h3 className="font-sora font-bold">Standard</h3><p className="mt-1 text-2xl text-accent">£199 / mo</p><ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5"><li>Up to 1,000 SKUs</li><li>2×/week scans</li><li>Google Sheet dashboard</li><li>Stock-out alerts</li></ul></Card>
          <Card><h3 className="font-sora font-bold">Pro</h3><p className="mt-1 text-2xl text-accent">£399 / mo</p><ul className="mt-4 space-y-2 text-sm opacity-90 list-disc pl-5"><li>Up to 3,000 SKUs</li><li>3×/week scans</li><li>Priority alerts</li><li>API/CSV export</li><li>30-min review call</li></ul></Card>
        </div>
        <div className="mt-12 grid md:grid-cols-2 gap-10">
          <Card><h3 className="font-sora font-bold">Free price audit</h3><p className="opacity-80 text-sm mt-1">We’ll send your first Top-10 actions sheet.</p><div className="mt-4"><LeadForm context="pricebot"/></div></Card>
          <Card><h3 className="font-sora font-bold">How we work</h3><ul className="list-disc pl-5 mt-2 text-sm opacity-90 space-y-1"><li>Public pages only; respect robots/terms</li><li>Margin guardrails + stock-out raises</li><li>CSV or Google Sheet delivery</li><li>Optional review call</li></ul></Card>
        </div>
      </section>
    </>
  )
}

function Thanks(){
  return (
    <section className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="rounded-2xl p-10 border border-white/10 bg-white/5 inline-block">
        <h1 className="text-3xl font-sora font-bold">Thanks — you’re on the list ✅</h1>
        <p className="mt-3 opacity-90">We’ll email your mini-audit shortly. If it’s urgent, reply to <a className="underline" href="mailto:hello@envision.studio">hello@envision.studio</a>.</p>
      </div>
    </section>
  )
}

function Privacy(){
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-sora font-bold">Privacy Policy</h1>
      <p className="mt-4 opacity-90 text-sm">We collect first name, work email, optional company, consent, timestamp, IP (where available), UTM parameters and the page URL for lead fulfilment and analytics. We don’t sell your data. Request deletion via <a className="underline" href="mailto:hello@envision.studio">hello@envision.studio</a>.</p>
    </section>
  )
}

function Footer(){
  return (
    <footer className="border-t border-white/10 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-3"><Reticle size={20}/><span className="opacity-80">© {new Date().getFullYear()} EnVision</span></div>
        <nav className="flex gap-4 opacity-80">
          <Link to="/social">Socials</Link>
          <Link to="/pricebot">Pricebot</Link>
          <Link to="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  )
}

export default function App(){
  return (
    <div className="min-h-screen bg-bg text-text">
      <Nav/>
      <Routes>
        <Route path="/" element={<Social/>}/>
        <Route path="/social" element={<Social/>}/>
        <Route path="/pricebot" element={<Pricebot/>}/>
        <Route path="/thanks" element={<Thanks/>}/>
        <Route path="/privacy" element={<Privacy/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}
