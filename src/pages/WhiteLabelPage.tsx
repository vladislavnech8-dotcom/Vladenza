import { useState } from 'react';
import {
  Shield, EyeOff, Users, TrendingUp, CheckCircle, ArrowRight,
  Star, Clock, Zap, FileText, Lock, BarChart2, RefreshCw, Award,
  ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

/* ── Data ─────────────────────────────────────────────────── */

const whyItMatters = [
  { stat: '80+', label: 'active agency partners trust us with their clients' },
  { stat: '9+', label: 'years delivering white-label link campaigns' },
  { stat: '100%', label: 'NDA protection — clients never see our name' },
  { stat: '12mo', label: 'link replacement guarantee on every placement' },
];

const benefits = [
  {
    icon: EyeOff,
    title: 'Completely invisible',
    desc: 'We operate as your in-house team. Reports arrive in your branding, all communication goes through you — your clients never see our name.',
  },
  {
    icon: Shield,
    title: 'NDA signed as standard',
    desc: 'Every partner signs an NDA before we start. Your client list, campaign details, and our working relationship stay confidential forever.',
  },
  {
    icon: TrendingUp,
    title: 'Scale without hiring',
    desc: "Win five new clients tomorrow — we'll fulfil them. Scale up or down in days, not months. No recruiting, no training, no overhead.",
  },
  {
    icon: BarChart2,
    title: 'White-label reports',
    desc: 'Branded PDF and Google Doc reports you send straight to clients. Placement URL, DR, traffic, anchor — everything documented for you.',
  },
  {
    icon: Award,
    title: '23-point quality review',
    desc: 'Every domain passes our checklist: organic traffic, spam score, niche relevance, outbound link ratio, indexing health, editorial legitimacy.',
  },
  {
    icon: RefreshCw,
    title: '12-month link guarantee',
    desc: "If any link drops within 12 months, we replace it at zero cost. No arguments, no delays — your client's results are always protected.",
  },
];

const linkTypes = [
  {
    name: 'Guest Post Placements',
    desc: 'Original, publication-ready articles on niche-relevant sites with naturally embedded backlinks.',
    dr: 'DR 30–90+',
    time: '10–21 days',
  },
  {
    name: 'Niche Edits',
    desc: 'Contextual links inserted into existing indexed content on authoritative domains — fast and powerful.',
    dr: 'DR 40–80+',
    time: '7–14 days',
  },
  {
    name: 'Crowd Links',
    desc: 'Organic mentions across forums, Q&A platforms, and communities that build natural link diversity.',
    dr: 'Varied',
    time: '5–10 days',
  },
  {
    name: 'Editorial Outreach',
    desc: 'Personalised outreach to publishers and editors for genuine placements on high-authority publications.',
    dr: 'DR 60–90+',
    time: '14–28 days',
  },
];

const process = [
  {
    num: '01',
    title: 'Free consultation',
    desc: "We align on quality benchmarks, anchor strategy, reporting format, and white-label framework. Zero commitment.",
  },
  {
    num: '02',
    title: 'NDA & onboarding',
    desc: "Sign the NDA, set up branded report templates, brief our team on your clients. Up and running within one week.",
  },
  {
    num: '03',
    title: 'We build & report',
    desc: "Outreach specialists and writers handle everything. Branded reports arrive on schedule — ready to forward to clients.",
  },
  {
    num: '04',
    title: 'Scale as you grow',
    desc: "Dedicated account manager maintains quality across all campaigns. Add clients whenever — we grow with you.",
  },
];

const tiers = [
  {
    name: 'Agency Starter',
    volume: '20–50 links/mo',
    price: 'From $700/mo',
    highlight: false,
    features: [
      'All link types included',
      'DR 20–60+ placements',
      'Branded Google Doc reports',
      'NDA as standard',
      'Dedicated TG / WhatsApp channel',
      'Competitor link gap analysis',
      'Anchor text strategy map',
      'Monthly performance summary',
    ],
  },
  {
    name: 'Agency Growth',
    volume: '70–100 links/mo',
    price: 'From $1,500/mo',
    highlight: true,
    features: [
      'All link types included',
      'DR 30–80+ placements',
      'Branded Google Doc reports',
      'Priority turnaround',
      'Dedicated account manager',
      '12-month link guarantee',
      'Full link-building strategy',
      'Weekly progress updates',
      'Anchor ratio monitoring',
      'Competitor gap tracking',
    ],
  },
  {
    name: 'Agency Enterprise',
    volume: '100+ links/mo',
    price: 'Custom pricing',
    highlight: false,
    features: [
      'Full campaign management',
      'DR 60–90+ editorial options',
      'Custom reporting dashboard',
      'Multi-client portal',
      'SLA agreement',
      'Monthly strategy calls',
      'Dedicated content team',
      'Publisher network access',
      'Priority niche coverage',
      'Quarterly strategy review',
    ],
  },
];

const testimonials = [
  {
    name: 'Marcus D.',
    role: 'Head of Growth, SaaS Platform',
    platform: 'Clutch',
    text: "Vladenza delivered exactly what was promised — DR 60+ links, natural anchors, and visible ranking improvements within 8 weeks. Our clients were impressed and we didn't have to lift a finger on fulfilment.",
    stars: 5,
  },
  {
    name: 'Elena V.',
    role: 'SEO Manager, iGaming Portal',
    platform: 'Google',
    text: "We've tried 4 link building agencies before. This is the only one that actually moves the needle in competitive niches. The white-label setup is seamless — clients think we have a huge in-house team.",
    stars: 5,
  },
  {
    name: 'James K.',
    role: 'Agency Director, UK',
    platform: 'Clutch',
    text: "We tripled our link building client base in 18 months. The quality is consistently exceptional and the branded reports are professional enough to go straight to clients without a single edit.",
    stars: 5,
  },
  {
    name: 'Sophie R.',
    role: 'E-commerce Director',
    platform: 'Trustpilot',
    text: "Fast turnaround, real editorial placements, and they follow up to make sure links are still live. The 12-month guarantee gave us the confidence to resell at a premium — rare professionalism in this industry.",
    stars: 5,
  },
  {
    name: 'Tom H.',
    role: 'Digital Agency Owner',
    platform: 'Fiverr',
    text: "I resell these services to my own clients. Quality is consistently high, reporting is clean, and links are always from domains with genuine traffic. The NDA means I never worry about client poaching.",
    stars: 5,
  },
  {
    name: 'Andrei P.',
    role: 'CMO, Fintech Startup',
    platform: 'GoodFirms',
    text: "Their 23-point quality review gives us complete confidence in every placement. Zero client complaints about link quality since switching, and our retention has improved significantly.",
    stars: 5,
  },
];

const faqs = [
  {
    q: 'What are White Label Link Building Services?',
    a: 'White label link building services allow your agency to offer high-quality backlinks we build on your behalf as your own. This enables you to provide comprehensive link-building solutions to clients without handling the work in-house — giving you a full service offering without the overhead of building an internal team.',
  },
  {
    q: 'Can I have input into the link-building strategy?',
    a: 'Absolutely. As a trusted white label service provider, we collaborate closely with your agency to ensure the link-building strategy aligns with your preferences. Our approach is fully tailored to meet your specific client requirements and goals — from anchor text ratios to target DR ranges and niche focus.',
  },
  {
    q: 'What kind of backlinks can I expect?',
    a: 'All backlinks we create are high-quality, do-follow links from reputable, niche-relevant sites. They are secured through manual outreach and content placement, ensuring they add genuine authority and ranking value to your clients\' websites. No PBNs, no link farms, no recycled placements.',
  },
  {
    q: 'Are the link-building techniques white hat?',
    a: 'Yes, we use 100% white hat, ethical link-building methods. This guarantees the longevity and effectiveness of links while keeping your clients\' websites safe from Google penalties. Every placement passes our 23-point quality review before it goes live.',
  },
  {
    q: 'How do White Label Link Building Services benefit SEO agencies?',
    a: null,
    list: [
      'High-quality backlinks that boost client rankings and organic traffic',
      'Cost efficiency — far more affordable than maintaining an in-house team',
      'Timely delivery — meet client deadlines reliably, every time',
      'Scalability — handle sudden spikes in demand without sacrificing quality',
      'Expertise access — tap into experienced outreach specialists and established publisher networks',
      'Do-follow links — maximise SEO impact with effective, lasting backlinks',
      'Client satisfaction — retain clients by consistently delivering measurable results',
      'Brand building — enhance your agency\'s reputation with detailed, branded reports',
      'Long-term strategy — continuous improvement, not just one-off gains',
      'Wide publisher network — access diverse, high-quality publishers across 40+ niches',
    ],
  },
  {
    q: 'How do you ensure the quality of the links?',
    a: 'Our outreach specialists rigorously vet all target sites based on domain authority, relevance, traffic, and editorial standards. In-house writers craft high-quality content, ensuring every backlink meets our stringent quality benchmarks. Every domain is manually reviewed — no automated tools make the final call.',
  },
  {
    q: 'Will my clients know that I\'m outsourcing link building?',
    a: 'No. Our services are fully white-labelled — all deliverables, reports, and analyses are presented as your own work. An NDA ensures complete confidentiality throughout the process. We are your invisible partner.',
  },
  {
    q: 'What happens if a link goes down or a client is unsatisfied?',
    a: 'We offer free link replacement if any links go down within 12 months, though this is rare. We also replace links that do not meet agreed expectations within the specified timeframe to ensure client satisfaction — no arguments, no delays.',
  },
  {
    q: 'Is white label backlink tracking possible?',
    a: 'Yes. Your dedicated account manager provides weekly updates on all link-building orders. You can track every backlink we build through the white-label report, which includes live URLs, DR, traffic estimates, and anchor text used.',
  },
  {
    q: 'How is pricing determined?',
    a: 'Pricing depends on factors such as the number of links per month, the authority of target sites, and niche complexity. We offer flexible volume tiers to suit different budgets, with full transparency and no hidden costs. Enterprise clients receive custom proposals.',
  },
  {
    q: 'What is the typical turnaround time?',
    a: 'For guest posts and niche edits, first links typically go live within 10–21 days. Crowd links are faster — usually 5–10 days. Once onboarded (takes about one week), campaigns run on a continuous monthly cycle with consistent delivery.',
  },
  {
    q: 'Why should I choose you as my white label link building partner?',
    a: '9+ years of link building experience, 80+ active agency partners, a 23-point quality review on every placement, NDA-protected partnerships, a 12-month replacement guarantee, and a dedicated account manager from day one. We don\'t just fulfil — we help your agency grow.',
  },
];

const faviconMap: Record<string, string> = {
  Clutch: 'clutch.co',
  GoodFirms: 'goodfirms.co',
  Trustpilot: 'trustpilot.com',
  Fiverr: 'fiverr.com',
  Google: 'google.com',
};

function PlatformIcon({ favicon, alt }: { favicon: string; alt: string }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${favicon}&sz=64`}
      alt={alt}
      width={14}
      height={14}
      style={{ borderRadius: 3, display: 'inline-block' }}
    />
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function FaqItem({ q, a, list }: { q: string; a: string | null; list?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={15} className="text-gray-400 shrink-0 ml-4" />
          : <ChevronDown size={15} className="text-gray-400 shrink-0 ml-4" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
          {a && <div className="pt-4">{a}</div>}
          {list && (
            <ul className="pt-4 flex flex-col gap-2">
              {list.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function WhiteLabelPage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  const WL_PKG: Package = {
    name: 'White Label Partnership',
    price: 'Custom',
    links: 'Agency fulfilment',
    service: 'White Label Link Building',
  };

  useSEO({
    title: 'White Label Link Building Service | Vladenza',
    description: 'White label link building service for SEO agencies. Guest posts, niche edits, crowd links — branded reports, NDA protected.',
    canonical: 'https://vladenza.com/services/white-label',
  });

  return (
    <ServicePageLayout defaultService="White Label Link Building">
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* ── Hero — dark like AI/LLM ───────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gray-950">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="wlGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="wlGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="1300" cy="200" rx="500" ry="400" fill="url(#wlGlow1)"/>
          <ellipse cx="150" cy="450" rx="380" ry="300" fill="url(#wlGlow2)"/>
          <circle cx="1200" cy="150" r="320" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.15"/>
          <circle cx="1200" cy="150" r="220" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.18"/>
          <circle cx="1200" cy="150" r="120" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.22"/>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`wl-${row}-${col}`} cx={col * 50 + 30} cy={row * 50 + 30} r="1.5" fill="#F97316" opacity={0.07} />
            ))
          )}
          <line x1="0" y1="600" x2="500" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.07"/>
          <line x1="80" y1="600" x2="580" y2="0" stroke="#F97316" strokeWidth="0.8" opacity="0.05"/>
        </svg>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Lock size={11} />
              Service — White Label
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.08] tracking-tight mb-6">
              Link Building Your Clients<br />
              <span className="text-[#F97316]">Will Never Know You Outsourced</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Agency-grade link fulfilment under your brand. Guest posts, niche edits, crowd links — NDA-protected, white-label reported, and guaranteed for 12 months.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg(WL_PKG)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Become a Partner <ArrowRight size={14} />
              </button>
              <button
                onClick={() => setSelectedPkg(WL_PKG)}
                className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 flex items-center gap-2"
              >
                <Zap size={13} className="text-[#F97316]" /> Get a Free Audit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItMatters.map((item) => (
              <div key={item.stat} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-[#F97316] mb-2">{item.stat}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              Why Agencies Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything your agency needs</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              From the first link to full campaign management — built to scale your agency without scaling headcount.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <b.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we build ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Every link type. Every niche.</h2>
            <p className="text-gray-400 text-sm">Mix and match to build a natural, diverse profile for each client — all under your brand.</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {linkTypes.map((lt) => (
              <div key={lt.name} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 hover:border-[#F97316]/30 transition-all group">
                <FileText size={13} className="text-[#F97316]" />
                <span className="text-sm font-medium text-gray-800">{lt.name}</span>
                <span className="text-xs text-gray-400">{lt.dr}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} />{lt.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — dark ───────────────────────────────── */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">From first call to first links — in 1 week</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">No lengthy onboarding. No complicated integrations. A clean handoff and results you can show clients.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {process.map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#F97316]/30 transition-all duration-300">
                <div className="text-[#F97316] font-black text-sm mb-3">{step.num}</div>
                <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => setSelectedPkg(WL_PKG)}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg"
            >
              Start Partnership <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Packages ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              Packages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Partner pricing</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              Flexible volume tiers for agencies of every size. All plans include NDA, white-label reports, and a dedicated point of contact.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-7 border transition-all ${tier.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-gray-950 border-white/10 hover:border-white/20'}`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>
                  {tier.volume}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <div className={`text-2xl font-black mb-6 mt-4 text-white`}>{tier.price}</div>
                <div className="flex flex-col gap-2.5 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={tier.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${tier.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: tier.name, price: tier.price, links: tier.volume, service: 'White Label Link Building' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${tier.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  Get Started <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">
              What Agency Partners Say
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              80+ agencies trust us to fulfil their link building — invisibly, reliably, at scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map((t) => {
              const favicon = faviconMap[t.platform];
              return (
                <div
                  key={t.name}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {favicon && <PlatformIcon favicon={favicon} alt={t.platform} />}
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t.platform}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-xs">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-gray-900">4.9 / 5.0</span>
                <span className="text-gray-400 ml-1.5">from 80+ agency partners</span>
              </div>
              <a
                href="/reviews"
                className="flex items-center gap-1 text-xs text-[#F97316] font-semibold hover:underline ml-2"
              >
                All reviews <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Common questions</h2>
            <p className="text-gray-500 text-sm">Everything agencies ask before becoming a partner.</p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} list={f.list} />)}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
