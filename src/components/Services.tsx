import { Newspaper, Scissors, Users as Users2, ScanSearch, Bot, Gamepad2, Cpu, Car, Heart, ArrowUpRight, MapPin, Lock, Home, Linkedin, Zap } from 'lucide-react';
import type { Package } from './OrderModal';

const LINK_BUILDING = [
  { icon: Newspaper, title: 'Guest Posts',      desc: 'Editorial placements on real sites with organic traffic.', href: '/services/guest-posting',
    pkg: { name: 'Starter', price: 'From $80', links: 'DR 30–50', service: 'Guest Posting' } as Package },
  { icon: Scissors,  title: 'Link Insertions',  desc: 'Contextual backlinks in already-published articles.',       href: '/services/niche-edits',
    pkg: { name: 'Essential', price: 'From $80', links: 'DR 20–40+', service: 'Niche Edits' } as Package },
  { icon: Users2,    title: 'Crowd Marketing',  desc: 'Brand mentions placed in relevant forum discussions.',      href: '/services/crowd-links',
    pkg: { name: 'Basic', price: '$290', links: '30 Links', service: 'Crowd Links' } as Package },
];

const SEO_AI = [
  { icon: ScanSearch, title: 'SEO Audit',           desc: 'Technical, on-page, content & off-page analysis.',                 href: '/services/seo-audit' },
  { icon: Bot,        title: 'AI & LLM Visibility', desc: 'Get mentioned across ChatGPT, Perplexity, Gemini and more.',       href: '/services/ai-llm' },
];

const NICHE = [
  { icon: Gamepad2, title: 'iGaming',          href: '/services/link-packages/igaming' },
  { icon: Cpu,      title: 'SaaS',             href: '/services/link-packages/saas' },
  { icon: Car,      title: 'Automotive',       href: '/services/link-packages/auto' },
  { icon: Heart,    title: 'Health & Wellness', href: '/services/link-packages/health' },
  { icon: Lock,     title: 'Proxy & VPN',      href: '/services/link-packages/proxy' },
  { icon: Home,     title: 'Home Renovation',  href: '/services/link-packages/renovations' },
];

const DIGITAL = [
  { icon: Linkedin, title: 'LinkedIn Personal Brand', desc: 'Grow authority, reach, and network through profile & content.', href: '/services/linkedin-personal' },
  { icon: Linkedin, title: 'LinkedIn Company Page',   desc: 'Strengthen visibility and lead gen via strategic page management.', href: '/services/linkedin-company' },
];

const CARD_BASE = 'group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5';
const cardStyle = { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' };
const cardHoverIn  = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; };
const cardHoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; };

function CatLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-0.5 h-3.5 rounded-full flex-shrink-0" style={{ background: '#F97316' }} />
      <span className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
    </div>
  );
}

function Card({ icon: Icon, title, desc, href }: { icon: React.ElementType; title: string; desc: string; href: string }) {
  return (
    <a href={href} className={CARD_BASE} style={cardStyle} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(249,115,22,0.13)' }}>
        <Icon size={14} style={{ color: '#F97316' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-[13px] leading-tight mb-0.5">{title}</div>
        <div className="text-[11px] leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</div>
      </div>
      <ArrowUpRight size={12} className="flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" style={{ color: 'rgba(249,115,22,0.45)' }} />
    </a>
  );
}

function BasicServiceCard({
  icon: Icon, title, desc, href, pkg, onOrder,
}: { icon: React.ElementType; title: string; desc: string; href: string; pkg: Package; onOrder: (pkg: Package) => void }) {
  return (
    <div className="group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5" style={cardStyle}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.45)'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(249,115,22,0.13)' }}>
        <Icon size={14} style={{ color: '#F97316' }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <a href={href} className="text-white font-semibold text-[13px] leading-tight hover:text-[#F97316] transition-colors">{title}</a>
          <span className="text-[#F97316] text-[12px] font-bold whitespace-nowrap">{pkg.price}</span>
        </div>
        <div className="text-[11px] leading-snug line-clamp-2 mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>{desc}</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOrder(pkg)}
            className="flex items-center gap-1 text-[11px] font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] px-2.5 py-1 rounded-md transition-colors"
          >
            <Zap size={10} /> Get Started
          </button>
          <a href={href} className="text-[11px] text-gray-500 hover:text-gray-300 transition-colors">Learn more</a>
        </div>
      </div>
    </div>
  );
}

export default function Services({ onOrder }: { onOrder: (pkg: Package) => void }) {
  return (
    <section className="py-14" style={{ background: '#0f1117' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-0.5 rounded-full" style={{ background: '#F97316' }} />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: '#F97316' }}>Services</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Everything You Need to Grow<br />
              <span style={{ color: '#F97316' }}>Search Visibility</span>
            </h2>
          </div>
        </div>

        {/* Grid layout: 2 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">

          {/* Left col */}
          <div className="flex flex-col gap-7">

            {/* Link Building */}
            <div>
              <CatLabel>Link Building Services</CatLabel>
              <div className="flex flex-col gap-2">
                {LINK_BUILDING.map(s => <BasicServiceCard key={s.title} {...s} onOrder={onOrder} />)}
              </div>
            </div>

            {/* Local */}
            <div>
              <CatLabel>Local Link Building</CatLabel>
              <a href="/services/local-seo-links" className={CARD_BASE} style={cardStyle} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.13)' }}>
                  <MapPin size={14} style={{ color: '#F97316' }} />
                </div>
                <div className="flex-1">
                  <div className="text-white font-semibold text-[13px] mb-0.5">Local Link Building</div>
                  <div className="text-[11px] leading-snug" style={{ color: 'rgba(255,255,255,0.38)' }}>Geo-relevant backlinks and citations that strengthen local search visibility.</div>
                </div>
                <ArrowUpRight size={12} className="flex-shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" style={{ color: 'rgba(249,115,22,0.45)' }} />
              </a>
            </div>

            {/* Digital Marketing */}
            <div>
              <CatLabel>Digital Marketing Services</CatLabel>
              <div className="flex flex-col gap-2">
                {DIGITAL.map(s => <Card key={s.title} {...s} />)}
              </div>
            </div>

          </div>

          {/* Right col */}
          <div className="flex flex-col gap-7">

            {/* SEO & AI */}
            <div>
              <CatLabel>SEO &amp; AI Visibility</CatLabel>
              <div className="flex flex-col gap-2">
                {SEO_AI.map(s => <Card key={s.title} {...s} />)}
              </div>
            </div>

            {/* Niche */}
            <div>
              <CatLabel>Niche Link Building Packages</CatLabel>
              <div className="grid grid-cols-2 gap-2">
                {NICHE.map(({ icon: Icon, title, href }) => (
                  <a key={title} href={href} className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                    style={cardStyle} onMouseEnter={cardHoverIn} onMouseLeave={cardHoverOut}>
                    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.13)' }}>
                      <Icon size={12} style={{ color: '#F97316' }} />
                    </div>
                    <span className="text-white text-[12px] font-semibold flex-1 leading-tight">{title}</span>
                    <ArrowUpRight size={11} className="flex-shrink-0 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" style={{ color: '#F97316' }} />
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
