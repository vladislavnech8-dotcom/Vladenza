import { useState, useEffect } from 'react';
import { FileText, Globe, TrendingUp, CheckCircle, Star, ArrowRight, Clock, Shield, Search } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

const features = [
  { icon: Globe, title: 'Real Traffic Sites Only', desc: 'Every placement is on a verified, live website with genuine organic traffic — no PBNs, no link farms, no recycled placements.' },
  { icon: Shield, title: 'Manual Quality Review', desc: 'Our team manually checks every domain for traffic trends, niche relevance, spam score, and link profile health before outreach.' },
  { icon: FileText, title: 'Native Content Writing', desc: 'Expert writers craft articles that naturally fit the host site\'s voice while anchoring your link in a topically relevant context.' },
  { icon: TrendingUp, title: 'Niche-Matched Placements', desc: 'Links placed only on sites that are thematically relevant to your business — not generic "write for us" directories.' },
  { icon: Star, title: 'DR 30–90+ Options', desc: 'Packages from entry-level DR 30+ through to editorial placements on DR 70–90+ authority publications.' },
  { icon: Search, title: 'Anchor Text Strategy', desc: 'We map anchors according to your existing profile to maintain a natural ratio and avoid over-optimisation penalties.' },
];

const tiers = [
  {
    name: 'Starter',
    dr: 'DR 30–50',
    traffic: '1k–5k/mo',
    turnaround: '10–14 days',
    price: 'From $80',
    features: ['Niche-relevant domain', 'Manual QC check', '800+ word article', 'Permanent placement', 'Report with live URL'],
    highlight: false,
  },
  {
    name: 'Authority',
    dr: 'DR 50–70',
    traffic: '5k–30k/mo',
    turnaround: '10–14 days',
    price: 'From $180',
    features: ['High-traffic editorial sites', 'In-depth content (1,200+ words)', 'Strategic anchor mapping', 'Priority support', 'Full placement report'],
    highlight: true,
  },
  {
    name: 'Premium',
    dr: 'DR 70–90+',
    traffic: '30k+/mo',
    turnaround: '14–21 days',
    price: 'From $380',
    features: ['Industry publication placements', 'Expert-level content', 'Editor-reviewed copy', 'Dedicated account manager', 'Custom anchor planning'],
    highlight: false,
  },
];

const process = [
  { num: '01', title: 'Site Discovery', desc: 'We source domains from our private network and verified outreach — not public link marketplaces.' },
  { num: '02', title: 'Manual QC', desc: 'Each site passes traffic, spam, and relevance checks before being proposed to your campaign.' },
  { num: '03', title: 'Content Creation', desc: 'Our writers craft a piece that fits the host site while embedding your link naturally and contextually.' },
  { num: '04', title: 'Publication & Report', desc: 'Once live, you get the URL, DA/DR, traffic estimate, and anchor used — full transparency.' },
];

export default function GuestPostingPage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: 'Buy Guest Posts — Guest Posting Service | Vladenza',
    description: 'Buy guest posts on DR 30–90+ real-traffic sites. Niche-matched, permanent links with native content. No PBNs — transparent reporting.',
    canonical: 'https://vladenza.com/services/guest-posting',
  });

  useEffect(() => {
    const id = 'service-schema';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Guest Posting / Link Building',
      provider: { '@type': 'Organization', name: 'Vladenza', url: 'https://vladenza.com' },
      areaServed: 'Worldwide',
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: '80', url: 'https://vladenza.com/services/guest-posting/' },
    });
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="400" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="280" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="160" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`gp-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <FileText size={12} />
              Service — Guest Posting
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              Guest Posts on<br />
              <span className="text-[#F97316]">Real, Traffic-Driven Sites</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              Editorial placements with expert-written content on niche-relevant domains — manually vetted, permanently placed, and fully reported.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg({ name: 'Guest Posting', price: 'From $80', links: 'DR 30–90+', service: 'Guest Posting' })}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Start a Campaign <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                <Clock size={14} className="text-[#F97316]" />
                From $80 per placement
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              Why It Works
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quality-first link acquisition</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">We don't use link farms, PBNs, or recycled placements. Every link is built to last and built to rank.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-[#F97316]/20 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <f.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-4">
              Packages
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Guest Posting Packages & Pricing</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">Mix tiers across your campaign for a natural, varied link profile.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-7 border ${tier.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>{tier.dr}</div>
                <h3 className={`text-2xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-white'}`}>{tier.name}</h3>
                <p className={`text-sm mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>{tier.traffic} traffic</p>
                <div className={`text-2xl font-black mb-6 mt-4 ${tier.highlight ? 'text-white' : 'text-white'}`}>{tier.price}</div>
                <div className="flex flex-col gap-2.5 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={tier.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${tier.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: tier.name, price: tier.price, links: tier.dr, service: 'Guest Posting' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${tier.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  Get Started <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">End-to-end managed. You approve domains, we handle everything else.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto mb-4 text-[#F97316] font-black text-sm">
                  {step.num}
                </div>
                <h4 className="text-gray-900 font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ServiceSeoBlock
        heading="Guest posting that builds real authority, not just links"
        intro="Guest posting remains one of the most reliable ways to earn contextual, editorial backlinks — but only when placements sit on real websites with genuine organic traffic. Our guest posting service focuses on niche relevance and editorial quality so every link strengthens your topical authority and helps you rank in competitive markets."
        body={[
          "Unlike marketplaces that resell the same recycled domains, we source placements through private relationships and direct outreach. Every site passes a manual quality check for traffic trends, spam score, and link profile health before we propose it. That means your links are placed inside genuinely useful content that both Google and AI search engines can trust.",
          "Guest posts work best as part of a diversified profile. Many clients combine them with [niche edits](/services/niche-edits) for faster authority transfer into aged pages, and [crowd links](/services/crowd-links) for a natural, varied link footprint. If you operate in a specific vertical, our [niche link packages](/services/link-packages/saas) bundle guest posts with supporting placements tuned to your industry.",
          "See how guest posting helped [a SaaS client build non-brand organic traffic](/case-studies/saas-non-brand-traffic) — one of many campaigns in our [case studies](/case-studies) archive. Read the [2026 link building playbook](/blog/link-building-2026) to understand how editorial links now feed AI visibility too — see our [AI & LLM visibility service](/services/ai-llm) for how this fits into a broader strategy.",
          "We run guest posting campaigns across every major vertical — [SaaS](/services/link-packages/saas), [iGaming](/services/link-packages/igaming), [health](/services/link-packages/health), [automotive](/services/link-packages/auto), [proxy/VPN](/services/link-packages/proxy), and [home renovation](/services/link-packages/renovations) — with placements sourced from niche-specific publisher networks rather than generic directories.",
        ]}
        faqs={[
          { q: 'Is guest posting still effective in 2026?', a: 'Yes, but only high-tier editorial guest posting — placements on real sites with genuine audiences and expert-authored content. Marketplace "write for us" links on sites that exist purely to sell placements can now do more harm than good. That distinction is exactly why we manually vet every domain before outreach.' },
          { q: 'What makes a guest post high quality?', a: 'A high-quality guest post lives on a niche-relevant site with real organic traffic, is written as genuinely useful editorial content, and embeds your link naturally with a sensible anchor. We avoid PBNs, link farms, and generic "write for us" directories entirely.' },
          { q: 'Are the links permanent?', a: 'Yes. Every placement is a permanent, indexed link. You receive the live URL, DR/DA, traffic estimate, and the anchor used in a full transparency report.' },
          { q: 'How do you choose the anchor text?', a: 'We map anchors against your existing backlink profile to maintain a natural ratio of branded, partial-match, and exact-match anchors — protecting you from over-optimisation penalties.' },
          { q: 'How long until I see results?', a: 'Guest posts are typically published within 10–21 days depending on tier. Ranking impact usually builds over several weeks as links are crawled and indexed. See our guide on [how long link building takes](/blog/how-long-does-link-building-take) for a realistic timeline.' },
        ]}
      />
    </ServicePageLayout>
  );
}
