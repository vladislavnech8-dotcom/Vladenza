import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Link2, Shield, TrendingUp, Globe, Zap, FileText, Lock, Home } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

const nicheData: Record<string, {
  label: string;
  tagline: string;
  desc: string;
  challenge: string;
  stats: { label: string; value: string }[];
  packages: { name: string; links: string; dr: string; price: string; features: string[]; highlight: boolean }[];
  features: { icon: typeof Link2; title: string; desc: string }[];
  includedSources: string[];
}> = {
  igaming: {
    label: 'iGaming & Betting',
    tagline: 'Rank in the most competitive niche on the web',
    desc: 'iGaming is notoriously difficult to rank in. Google treats casino, betting, and gambling sites with extreme scrutiny. Our link packages are specifically built for this vertical — with niche-relevant, compliant domains that actually move the needle.',
    challenge: 'Standard link vendors often refuse iGaming or use irrelevant domains. We specialise in this vertical and understand the compliance, editorial, and anchor requirements unique to gambling SEO.',
    stats: [
      { label: 'Niches covered', value: 'Casino, Poker, Sports Betting, eSports, Fantasy' },
      { label: 'Average DR range', value: 'DR 30–80+' },
      { label: 'Delivery time', value: '14–21 days' },
      { label: 'Content', value: 'Native, compliance-aware writing' },
    ],
    packages: [
      { name: 'Starter', links: '10 Links', dr: 'DR 30–50', price: '$950', features: ['iGaming-niche domains', 'Manual outreach QC', 'Anchor strategy included', 'Full placement report', 'Compliant content'], highlight: false },
      { name: 'Growth', links: '20 Links', dr: 'DR 40–60', price: '$1,750', features: ['High-authority igaming sites', 'Mixed guest post + niche edits', 'Custom anchor map', 'Priority delivery', 'Monthly reporting'], highlight: true },
      { name: 'Authority', links: '40 Links', dr: 'DR 50–80+', price: '$3,200', features: ['Tier 1 igaming publications', 'DR 70+ editorial placements', 'Dedicated account manager', 'Competitor gap analysis', 'Full strategy session'], highlight: false },
    ],
    features: [
      { icon: Shield, title: 'Compliance-Aware Content', desc: 'All content written with gambling advertising guidelines in mind — appropriate disclaimers, no prohibited claims.' },
      { icon: Globe, title: 'Real iGaming Domains', desc: 'Placements on legitimate casino review sites, affiliate portals, and gambling news publications — not irrelevant lifestyle blogs.' },
      { icon: TrendingUp, title: 'Tested Anchor Strategy', desc: 'Anchor text ratios built specifically for igaming sites, which are under higher scrutiny for over-optimisation.' },
      { icon: Zap, title: 'Fast-Track Pipeline', desc: 'We have pre-established relationships with iGaming site owners, reducing outreach timelines significantly.' },
    ],
    includedSources: ['Casino review portals', 'Sports betting affiliates', 'iGaming news sites', 'Poker strategy blogs', 'eSports publications', 'Responsible gambling orgs'],
  },
  saas: {
    label: 'SaaS & B2B Tech',
    tagline: 'Build domain authority for long-tail B2B keyword domination',
    desc: 'SaaS companies live and die by organic acquisition. Our SaaS link packages target software review sites, tech publications, founder communities, and B2B content hubs to build the authority needed to rank for commercial intent keywords.',
    challenge: 'SaaS SEO requires a mix of editorial links from tech publications and niche-relevant software/business sites. Generic link building misses the topical signals that SaaS category pages need.',
    stats: [
      { label: 'Niches covered', value: 'B2B SaaS, Developer Tools, HR Tech, MarTech, FinTech' },
      { label: 'Average DR range', value: 'DR 40–85+' },
      { label: 'Delivery time', value: '10–18 days' },
      { label: 'Content', value: 'Expert B2B/tech content writing' },
    ],
    packages: [
      { name: 'Starter', links: '8 Links', dr: 'DR 40–55', price: '$720', features: ['SaaS-relevant domains', 'Tech publication placements', 'B2B content writing', 'Anchor optimisation', 'Report with metrics'], highlight: false },
      { name: 'Growth', links: '15 Links', dr: 'DR 50–70', price: '$1,380', features: ['High-authority tech sites', 'Category page anchor strategy', 'Software review site placements', 'Priority queue', 'Monthly link report'], highlight: true },
      { name: 'Enterprise', links: '30 Links', dr: 'DR 65–85+', price: '$2,700', features: ['Top SaaS publications', 'Forbes/TechCrunch level targets', 'Dedicated manager', 'Full keyword mapping', 'Competitive link analysis'], highlight: false },
    ],
    features: [
      { icon: FileText, title: 'Expert B2B Writing', desc: 'Content written by specialists who understand SaaS products, personas, and the language B2B buyers respond to.' },
      { icon: Globe, title: 'Relevant Tech Sources', desc: 'Links from software review platforms, tech blogs, startup publications, and developer-focused content hubs.' },
      { icon: TrendingUp, title: 'Category Page Focus', desc: 'Link strategy built around driving authority to high-value category and comparison pages, not just the homepage.' },
      { icon: Shield, title: 'Brand-Safe Placements', desc: 'Every placement is screened for brand safety, ensuring your links appear on reputable, professionally-run sites.' },
    ],
    includedSources: ['G2 / Capterra adjacent sites', 'SaaS review blogs', 'Tech startup publications', 'Developer communities', 'ProductHunt adjacent sites', 'Business software directories'],
  },
  auto: {
    label: 'Automotive',
    tagline: 'Drive rankings for dealerships, parts, and auto services',
    desc: 'Automotive SEO spans local dealerships, national parts retailers, insurance comparison sites, and enthusiast communities. Our auto link packages target the right mix of local authority signals and national editorial placements to rank in this competitive vertical.',
    challenge: 'Auto is a fragmented niche — a dealership has different needs than a parts e-commerce store or a car review blog. We customise anchor strategy and domain selection based on your specific sub-niche.',
    stats: [
      { label: 'Niches covered', value: 'Dealerships, Parts, Accessories, Reviews, Leasing' },
      { label: 'Average DR range', value: 'DR 30–75+' },
      { label: 'Delivery time', value: '10–16 days' },
      { label: 'Content', value: 'Automotive-fluent native writers' },
    ],
    packages: [
      { name: 'Starter', links: '8 Links', dr: 'DR 30–50', price: '$640', features: ['Auto-niche domain matching', 'Local + national mix', 'Make/model relevant content', 'Report with live URLs', 'Custom anchor text'], highlight: false },
      { name: 'Growth', links: '15 Links', dr: 'DR 45–65', price: '$1,150', features: ['High-authority auto sites', 'Enthusiast community placements', 'Industry publication links', 'Priority delivery', 'Full campaign report'], highlight: true },
      { name: 'Authority', links: '25 Links', dr: 'DR 60–75+', price: '$1,900', features: ['National auto publications', 'Editorial placement strategy', 'Dedicated account manager', 'Competitor backlink analysis', 'Quarterly strategy review'], highlight: false },
    ],
    features: [
      { icon: Globe, title: 'Auto-Specific Domains', desc: 'Placements on car review sites, enthusiast forums, dealership news, parts directories, and automotive news publications.' },
      { icon: Zap, title: 'Local SEO Boosts', desc: 'For dealerships and local service businesses, we prioritise regional auto sites and local business associations.' },
      { icon: FileText, title: 'Automotive Writers', desc: 'Content created by writers who know the difference between a torque converter and a transmission — it shows in quality.' },
      { icon: TrendingUp, title: 'Model & Make Targeting', desc: 'Content and anchor text tailored to specific vehicle types, brands, and buyer intent stages your business targets.' },
    ],
    includedSources: ['Car review publications', 'Auto enthusiast forums', 'Dealership news sites', 'Parts & accessories blogs', 'Vehicle insurance comparison sites', 'EV & tech automotive media'],
  },
  health: {
    label: 'Health & Wellness',
    tagline: 'Build E-E-A-T authority in Google\'s most scrutinised vertical',
    desc: 'Health is a YMYL (Your Money, Your Life) niche — Google applies its strictest quality standards here. Our health link packages focus on building genuine E-E-A-T signals through medically credible, authoritative placements that satisfy algorithmic and human reviewers alike.',
    challenge: 'Low-quality health links can actively harm rankings. Every domain is screened for medical accuracy, authorship quality, editorial standards, and topical relevance before being used.',
    stats: [
      { label: 'Niches covered', value: 'Supplements, Fitness, Mental Health, Medical, Beauty' },
      { label: 'Average DR range', value: 'DR 35–80+' },
      { label: 'Delivery time', value: '12–18 days' },
      { label: 'Content', value: 'Medically reviewed, expert-written' },
    ],
    packages: [
      { name: 'Foundation', links: '8 Links', dr: 'DR 35–55', price: '$760', features: ['Health-verified domains', 'Expert-written content', 'Medically accurate copy', 'E-E-A-T compliant placement', 'Full report'], highlight: false },
      { name: 'Authority', links: '15 Links', dr: 'DR 50–70', price: '$1,420', features: ['High-authority health sites', 'Editorial + niche edit mix', 'Author credibility check', 'Priority delivery', 'Monthly reporting'], highlight: true },
      { name: 'Premium', links: '25 Links', dr: 'DR 65–80+', price: '$2,380', features: ['Major health publications', 'Medical review sites', 'Expert author attribution', 'Dedicated account manager', 'E-E-A-T strategy review'], highlight: false },
    ],
    features: [
      { icon: Shield, title: 'E-E-A-T First Approach', desc: 'Every placement is evaluated for Experience, Expertise, Authoritativeness, and Trustworthiness — Google\'s core health ranking criteria.' },
      { icon: FileText, title: 'Medically Accurate Content', desc: 'Written by health-literate specialists and reviewed for accuracy. No misleading health claims, ever.' },
      { icon: Globe, title: 'Credible Domain Standards', desc: 'Domains screened for editorial quality, medical advisory boards, author credentials, and citation practices.' },
      { icon: TrendingUp, title: 'YMYL-Safe Strategy', desc: 'Anchor and content strategy specifically designed for sites operating in Google\'s highest-scrutiny categories.' },
    ],
    includedSources: ['Health & wellness magazines', 'Supplement review sites', 'Fitness & nutrition blogs', 'Mental health platforms', 'Medical news publications', 'Natural health directories'],
  },
  proxy: {
    label: 'Proxy & VPN',
    tagline: 'Rank in the privacy & cybersecurity vertical with compliant authority links',
    desc: 'Proxy and VPN is a fiercely competitive niche dominated by affiliate review sites and cybersecurity publications. Our link packages are built exclusively for this vertical — using tech-privacy-relevant domains that pass Google\'s stricter scrutiny of YMYL-adjacent security content.',
    challenge: 'Generic link vendors avoid the proxy/VPN niche due to compliance concerns. We work exclusively with cybersecurity publishers, tech review sites, and privacy advocacy platforms to deliver links that carry genuine topical authority.',
    stats: [
      { label: 'Niches covered', value: 'VPN, Proxy, Cybersecurity, Privacy Tools, Anonymity' },
      { label: 'Average DR range', value: 'DR 35–80+' },
      { label: 'Delivery time', value: '10–18 days' },
      { label: 'Content', value: 'Tech & privacy-fluent writers' },
    ],
    packages: [
      { name: 'Starter', links: '8 Links', dr: 'DR 35–55', price: '$680', features: ['Privacy/tech niche domains', 'Manual outreach QC', 'Anchor strategy included', 'Full placement report', 'Compliance-aware content'], highlight: false },
      { name: 'Growth', links: '15 Links', dr: 'DR 45–65', price: '$1,250', features: ['High-authority cybersec sites', 'Guest post + niche edit mix', 'Custom anchor map', 'Priority delivery', 'Monthly reporting'], highlight: true },
      { name: 'Authority', links: '30 Links', dr: 'DR 60–80+', price: '$2,400', features: ['Top privacy publications', 'DR 70+ editorial placements', 'Dedicated account manager', 'Competitor gap analysis', 'Full strategy session'], highlight: false },
    ],
    features: [
      { icon: Lock, title: 'Privacy-Niche Domains', desc: 'Placements sourced exclusively from cybersecurity news sites, VPN review publications, and privacy advocacy portals — never irrelevant lifestyle blogs.' },
      { icon: Shield, title: 'Compliance-Safe Content', desc: 'All articles are written with FTC/advertising disclosure guidelines in mind for affiliate and review-style content.' },
      { icon: TrendingUp, title: 'Affiliate Anchor Strategy', desc: 'Anchor ratios calibrated for VPN/proxy affiliate pages which face heightened scrutiny for exact-match over-optimisation.' },
      { icon: Zap, title: 'Pre-Vetted Publishers', desc: 'We maintain active relationships with editors at leading cybersecurity and privacy-tech publications, reducing delivery timelines.' },
    ],
    includedSources: ['VPN comparison platforms', 'Cybersecurity news sites', 'Privacy advocacy blogs', 'Tech review publications', 'Infosec community hubs', 'Developer & IT portals'],
  },
  renovations: {
    label: 'Home Renovations & Plumbing',
    tagline: 'Dominate local & national SERPs for high-intent home service keywords',
    desc: 'Home renovation and plumbing businesses live on local search visibility. Our link packages combine geo-targeted local citations with high-DR editorial links from home improvement publications — building both map pack authority and organic ranking power simultaneously.',
    challenge: 'Home services SEO requires a dual approach: local citation consistency for map pack rankings and editorial authority for competitive national keywords. We build both, tailored to your service area and specialty.',
    stats: [
      { label: 'Niches covered', value: 'Plumbing, Renovation, HVAC, Electrical, Roofing, Landscaping' },
      { label: 'Average DR range', value: 'DR 30–70+' },
      { label: 'Delivery time', value: '10–16 days' },
      { label: 'Content', value: 'Home & trades-literate writers' },
    ],
    packages: [
      { name: 'Local Boost', links: '8 Links', dr: 'DR 30–50', price: '$580', features: ['Home improvement domains', 'Local + national mix', 'Service-area relevant content', 'Report with live URLs', 'Custom anchor text'], highlight: false },
      { name: 'Growth', links: '15 Links', dr: 'DR 45–65', price: '$1,080', features: ['High-authority home sites', 'DIY & renovation publications', 'Contractor community links', 'Priority delivery', 'Full campaign report'], highlight: true },
      { name: 'Authority', links: '28 Links', dr: 'DR 55–70+', price: '$1,980', features: ['National home improvement media', 'Editorial placement strategy', 'Dedicated account manager', 'Competitor backlink analysis', 'Quarterly strategy review'], highlight: false },
    ],
    features: [
      { icon: Home, title: 'Home Services Domains', desc: 'Links from renovation blogs, contractor directories, plumbing trade publications, and DIY home improvement communities.' },
      { icon: Globe, title: 'Geo-Targeted Signals', desc: 'For local businesses, we prioritise regional home & garden sites and local business associations that strengthen map pack presence.' },
      { icon: FileText, title: 'Trades-Fluent Writers', desc: 'Content written by specialists who understand plumbing codes, renovation timelines, and contractor pricing — creating credible, useful articles.' },
      { icon: TrendingUp, title: 'High-Intent Keyword Focus', desc: 'Anchor and content strategy built around commercial intent keywords like "emergency plumber", "kitchen remodel cost", and "roof replacement near me".' },
    ],
    includedSources: ['Home improvement publications', 'DIY & renovation blogs', 'Contractor trade directories', 'Real estate & property sites', 'HVAC & plumbing trade news', 'Local business associations'],
  },
};

const otherNiches = [
  { key: 'igaming',     label: 'iGaming',            href: '/services/link-packages/igaming' },
  { key: 'saas',        label: 'SaaS',               href: '/services/link-packages/saas' },
  { key: 'auto',        label: 'Automotive',         href: '/services/link-packages/auto' },
  { key: 'health',      label: 'Health',             href: '/services/link-packages/health' },
  { key: 'proxy',       label: 'Proxy & VPN',        href: '/services/link-packages/proxy' },
  { key: 'renovations', label: 'Home Renovations',   href: '/services/link-packages/renovations' },
];

export default function LinkPackagesPage() {
  const { niche = 'igaming' } = useParams<{ niche: string }>();
  const data = nicheData[niche] ?? nicheData['igaming'];
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: `Buy ${data.label} Backlinks | Vladenza`,
    description: `Buy ${data.label} backlinks — niche-specific link building packages. ${data.desc.slice(0, 60)}...`,
    canonical: `https://vladenza.com/services/link-packages/${niche}`,
  });

  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      {/* Niche tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-[88px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-1 py-2 overflow-x-auto">
            {otherNiches.map((n) => (
              <Link
                key={n.key}
                to={n.href}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${niche === n.key ? 'bg-[#F97316] text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`lp-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Link2 size={12} />
              Link Packages — {data.label}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-4">
              {data.label} Link Building<br />
              <span className="text-[#F97316]">Packages</span>
            </h1>
            <p className="text-[#F97316] font-semibold text-lg mb-4">{data.tagline}</p>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-xl">{data.desc}</p>
            <button
              onClick={() => setSelectedPkg({ name: `${data.label} Package`, price: data.packages[1]?.price ?? 'Custom', links: data.packages[1]?.links ?? 'Custom', service: `Link Packages — ${data.label}` })}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get a Custom Quote <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {data.stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-gray-900 font-bold text-sm">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">{data.label} link packages</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Flexible volumes built for different campaign phases — from foundation building to aggressive authority scaling.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {data.packages.map((pkg) => (
              <div key={pkg.name} className={`rounded-2xl p-7 border ${pkg.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.dr}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                <p className={`text-sm mb-4 font-semibold ${pkg.highlight ? 'text-white/90' : 'text-[#F97316]'}`}>{pkg.links}</p>
                <div className="text-3xl font-black text-white mb-6">{pkg.price}</div>
                <div className="flex flex-col gap-2.5 mb-8">
                  {pkg.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={pkg.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: pkg.name, price: pkg.price, links: pkg.links, service: `${data.label} Link Package` })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  Order Package <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this niche */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
                Why Choose Us
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                Niche expertise that<br /><span className="text-[#F97316]">makes a difference</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">{data.challenge}</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.features.map((f) => (
                  <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-[#F97316]/20 transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                      <f.icon size={15} className="text-[#F97316]" />
                    </div>
                    <h4 className="text-gray-900 font-semibold text-xs mb-1">{f.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-7">
              <h3 className="text-gray-900 font-bold text-base mb-2">Included source types</h3>
              <p className="text-gray-400 text-sm mb-5">Domains are sourced exclusively from these {data.label} relevant site categories.</p>
              <div className="flex flex-col gap-2">
                {data.includedSources.map((src) => (
                  <div key={src} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{src}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-5 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPkg({ name: 'Custom Package', price: 'Custom', links: data.label, service: `${data.label} Link Package` })}
                  className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-gray-800 text-white py-3 rounded-lg text-sm font-semibold transition-all"
                >
                  Request Custom Package <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other niches */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Explore other niche packages</h3>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {otherNiches.filter((n) => n.key !== niche).map((n) => (
              <Link key={n.key} to={n.href} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-[#F97316]/40 hover:text-[#F97316] transition-all duration-200 flex items-center gap-2">
                {n.label} Packages <ArrowRight size={13} />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <ServiceSeoBlock
        heading={`${data.label} link building packages built for your niche`}
        intro={`Generic backlinks rarely move the needle in ${data.label}. Ranking here demands placements on sites your audience and Google already associate with the industry. Our ${data.label} packages bundle niche-relevant guest posts, contextual insertions, and supporting signals into one managed campaign.`}
        body={[
          `Every ${data.label} campaign is built around topical relevance. We prioritise publications and communities that carry weight in your vertical, then blend link types for a natural profile rather than a single repeated tactic.`,
          "Under the hood, packages draw on the same quality standards as our core services: [guest posting](/services/guest-posting) on real-traffic sites, [niche edits](/services/niche-edits) for faster authority transfer, and [crowd links](/services/crowd-links) for diversity. Read the [2026 link building playbook](/blog/link-building-2026) to see how this approach also builds AI visibility.",
          "Want evidence before you commit? Our [case studies](/case-studies) document ranking and traffic gains across competitive niches just like yours.",
        ]}
        faqs={[
          { q: `Why choose a niche-specific package over generic links?`, a: `Relevance is one of the strongest ranking signals. Links from sites within your industry pass more contextual authority and look far more natural than random high-DR placements with no topical connection.` },
          { q: 'What link types are included?', a: 'Packages combine niche-relevant guest posts, contextual niche edits, and supporting crowd and citation signals — mixed for a natural, varied profile.' },
          { q: 'Can I customise the package?', a: 'Yes. We tailor link volume, authority tiers, and anchor strategy to your goals, competition, and budget. Request a custom quote and we respond within 24 hours.' },
          { q: 'How soon will I see results?', a: 'Most clients see movement within a few weeks to a few months depending on niche competitiveness. Consistency matters more than a single burst of links.' },
        ]}
      />
    </ServicePageLayout>
  );
}
