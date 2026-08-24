import { useState } from 'react';
import { Link2, Zap, Shield, TrendingUp, ArrowRight, Star, Search } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

const advantages = [
  { icon: Zap, title: 'Instant Authority Transfer', desc: 'Links inserted into aged, indexed content pass authority immediately — no waiting for new articles to gain traction.' },
  { icon: Star, title: 'Contextual Placement', desc: 'Every link is inserted inline within a paragraph that is topically relevant to your target keyword and page.' },
  { icon: Shield, title: 'Aged Domain Strength', desc: 'The content already has years of backlinks, trust, and search visibility — your link inherits all of it.' },
  { icon: Search, title: 'Anchor Precision', desc: 'We control the exact anchor text and surrounding copy to perfectly complement your existing link profile.' },
  { icon: TrendingUp, title: 'Minimal Footprint', desc: 'No new author bios, no guest post disclosures. The link blends naturally into existing content.' },
  { icon: Link2, title: 'All Niches Covered', desc: 'From SaaS and fintech to health and iGaming — our network spans hundreds of niche verticals.' },
];

const packages = [
  { label: 'DR10+', dr: '0–1,000 monthly traffic', price: '$1', highlight: false },
  { label: 'DR20+', dr: '0–5,000 monthly traffic', price: '$90', highlight: false },
  { label: 'DR30+', dr: '100–10,000 monthly traffic', price: '$110', highlight: false },
  { label: 'DR40+', dr: '500–20,000 monthly traffic', price: '$200', highlight: true },
  { label: 'DR50+', dr: '1,000–30,000 monthly traffic', price: '$280', highlight: false },
  { label: 'DR60+', dr: '1,000–60,000 monthly traffic', price: '$400', highlight: false },
];

const vsGuest = [
  { label: 'Speed', niche: '3–7 days', guest: '10–21 days' },
  { label: 'Link authority', niche: 'Inherited from aged content', guest: 'Builds over time' },
  { label: 'Footprint', niche: 'Zero guest disclosure', guest: 'Author bio visible' },
  { label: 'Cost per DR', niche: 'Lower', guest: 'Higher' },
  { label: 'Content needed', niche: 'None', guest: 'Full article' },
];

export default function NicheEditsPage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: 'Buy Niche Edits — Link Insertion Service | Vladenza',
    description: 'Buy niche edits — links inserted into aged, indexed content for instant authority transfer. Niche-relevant placements, precise anchor control.',
    canonical: 'https://vladenza.com/services/niche-edits',
  });
  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`ne-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Link2 size={12} />
              Service — Niche Edits
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              Links Inserted Into<br />
              <span className="text-[#F97316]">Aged, Trusted Content</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              Niche edits (curated links) place your backlink inside existing, indexed articles — giving you instant authority from content that's already ranking.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg({ name: 'Niche Edits', price: '$1', links: 'DR 10+', service: 'Niche Edits' })}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Order Niche Edits <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                From $1 per placement · 3–7 day delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why niche edits outperform new posts</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">Aged content has trust signals new articles take months to accumulate. Your link inherits them on day one.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {advantages.map((a) => (
              <div key={a.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <a.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{a.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Simple pricing</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Choose your Domain Rating level. Every placement is contextual, permanent, and manually checked.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.label} className={`rounded-2xl p-7 border ${pkg.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-2xl font-bold mb-2 ${pkg.highlight ? 'text-white' : 'text-white'}`}>{pkg.label}</div>
                <div className={`text-sm mb-8 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.dr}</div>
                <div className="text-4xl font-black text-white mb-7">{pkg.price}<span className={`text-sm font-medium ml-2 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>/ placement</span></div>
                <button
                  onClick={() => setSelectedPkg({ name: pkg.label, price: pkg.price, links: pkg.dr, service: 'Niche Edits' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  Order Now <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Samples */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-5 tracking-wide uppercase">
              <Link2 size={12} />
              Real Placements
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Sample Placements</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Live examples from our network — each with verified DR and organic traffic data from Ahrefs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { url: 'https://droven.io/why-predictability-matters-in-networking/', domain: 'droven.io', dr: 37, traffic: '260,464', keywords: 35, label: 'Tech / Networking' },
              { url: 'https://www.agicent.com/blog/instagram-growth-hacks-to-get-followers/', domain: 'agicent.com', dr: 54, traffic: '21,972', keywords: 464, label: 'Marketing / SaaS' },
              { url: 'https://thefoxmagazine.com/technology/apps/6-techniques-for-gaining-followers-on-instagram-in-2025/', domain: 'thefoxmagazine.com', dr: 52, traffic: '1,258', keywords: 405, label: 'Tech / Lifestyle' },
              { url: 'https://www.intelligentliving.co/digital-marketing-actionable-insight/', domain: 'intelligentliving.co', dr: 64, traffic: '524', keywords: 444, label: 'Digital Marketing' },
              { url: 'https://ccr-mag.com/unlocking-your-best-smile-dental-innovations-for-a-confident-you/', domain: 'ccr-mag.com', dr: 64, traffic: '1,076', keywords: 571, label: 'Health / Dental' },
              { url: 'https://theglobalhues.com/a-beginners-guide-to-choosing-the-right-hosting-plan-for-your-website/', domain: 'theglobalhues.com', dr: 52, traffic: '7,028', keywords: 766, label: 'Tech / Hosting' },
            ].map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-[#F97316] uppercase tracking-wide mb-1">{s.label}</div>
                    <div className="text-sm font-semibold text-gray-800 group-hover:text-[#F97316] transition-colors leading-snug break-all">{s.domain}</div>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-[#F97316] transition-colors mt-1 flex-shrink-0" />
                </div>
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1 font-medium">DR</div>
                    <div className={`text-lg font-black ${s.dr >= 60 ? 'text-emerald-500' : s.dr >= 50 ? 'text-[#F97316]' : 'text-blue-500'}`}>{s.dr}</div>
                  </div>
                  <div className="text-center border-x border-gray-100">
                    <div className="text-xs text-gray-400 mb-1 font-medium">Traffic</div>
                    <div className="text-sm font-bold text-gray-800">{s.traffic}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-1 font-medium">Keywords</div>
                    <div className="text-sm font-bold text-gray-800">{s.keywords}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Metrics sourced from Ahrefs. DR = Domain Rating, Traffic = estimated monthly organic visits.</p>
        </div>
      </section>

      {/* Niche Edits vs Guest Posts */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Niche Edits vs. Guest Posts</h2>
            <p className="text-gray-500 text-sm">Both have a place in a balanced strategy. Here's when to use each.</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-200">
              <div className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest">Factor</div>
              <div className="p-4 text-xs font-bold uppercase text-[#F97316] tracking-widest border-l border-gray-200">Niche Edits</div>
              <div className="p-4 text-xs font-bold uppercase text-gray-500 tracking-widest border-l border-gray-200">Guest Posts</div>
            </div>
            {vsGuest.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 ${i < vsGuest.length - 1 ? 'border-b border-gray-200' : ''}`}>
                <div className="p-4 text-sm text-gray-700 font-medium">{row.label}</div>
                <div className="p-4 text-sm text-gray-900 border-l border-gray-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0"/>
                  {row.niche}
                </div>
                <div className="p-4 text-sm text-gray-400 border-l border-gray-200">{row.guest}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ServiceSeoBlock
        heading="Niche edits: instant authority from aged, indexed pages"
        intro="Niche edits — also called link insertions — place your link inside existing, already-indexed articles that Google trusts. Because the host page has often accumulated age, traffic, and its own backlinks, authority can transfer faster than waiting for a brand-new guest post to be crawled and ranked."
        body={[
          "Speed is only an advantage when relevance is right. We insert links into pages that already discuss your topic, so the placement reads naturally and passes contextual signals. Every target is checked for indexation, traffic, spam score, and topical fit before we approach the site owner — no forced links buried in unrelated paragraphs.",
          "Niche edits pair well with other tactics. Use [guest posting](/services/guest-posting) when you want fresh, controlled content around your link, and [crowd links](/services/crowd-links) to diversify your profile with community signals. Not sure which to prioritise? Our breakdown of [niche edits vs guest posts](/blog/niche-edits-vs-guest-posts) explains when each wins.",
          "See real outcomes in our [case studies](/case-studies), or explore niche-specific bundles in our [link building packages](/services/link-packages/saas) that combine niche edits with supporting placements.",
        ]}
        faqs={[
          { q: 'What is a niche edit?', a: 'A niche edit is a backlink inserted into an existing, indexed article that is topically relevant to your site. Because the page already has authority and traffic, your link benefits from established trust signals.' },
          { q: 'Are niche edits safe?', a: 'Yes, when done correctly. We only place links on relevant, clean pages with real traffic and add them naturally within the existing content. We never use spammy pages or irrelevant insertions.' },
          { q: 'Are niche edits faster than guest posts?', a: 'Often, yes. Because the host page is already indexed and trusted, authority can transfer sooner than with a freshly published guest post. Actual ranking impact still depends on your niche and competition.' },
          { q: 'Can I control the anchor text?', a: 'Yes. We map anchors to your existing profile so the new link maintains a natural ratio and avoids over-optimisation.' },
        ]}
      />
    </ServicePageLayout>
  );
}
