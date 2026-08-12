import { useState } from 'react';
import { Users, MessageSquare, Globe, TrendingUp, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

const features = [
  { icon: MessageSquare, title: 'Niche-Topic Content', desc: 'Every placement is wrapped in a relevant topic that matches your target keywords — so links reinforce keyword visibility, not just pass equity.' },
  { icon: Globe, title: 'Large Forum Database', desc: 'We maintain a large, constantly updated base of forums and community platforms across all major niches — giving your campaign genuine placement variety.' },
  { icon: Users, title: 'Keyword Visibility Focus', desc: 'Crowd links are placed in topically relevant threads and discussions specifically chosen to support your target search terms and improve their rankings.' },
  { icon: Shield, title: 'Spam-Safe Placement', desc: 'Contributions are written to add real value to the conversation, not just drop links. This reduces removal rates and protects your brand.' },
  { icon: TrendingUp, title: 'Referral Traffic Bonus', desc: 'Quality crowd links often drive direct referral traffic in addition to passing link equity — a dual benefit for competitive niches.' },
  { icon: Zap, title: 'Fast Turnaround', desc: 'Crowd campaigns are deployed within 5–10 days. No outreach cycles, no waiting on editorial approvals.' },
];

const useCases = [
  { niche: 'iGaming & Betting', desc: 'Topics around casino strategies, sports betting picks, affiliate comparisons, and bonus reviews — to rank iGaming money pages.' },
  { niche: 'SaaS & Tech', desc: 'Topics covering tool comparisons, productivity workflows, software recommendations, and integration guides — to lift non-brand SaaS keywords.' },
  { niche: 'Health & Wellness', desc: 'Topics on supplement stacks, fitness protocols, wellness routines, and product comparisons — to push health and review pages up.' },
  { niche: 'Finance & Crypto', desc: 'Topics on DeFi strategies, trading platforms, personal finance tips, and crypto project reviews — to rank finance and crypto landing pages.' },
  { niche: 'Automotive', desc: 'Topics on car care, model comparisons, aftermarket parts, and detailing guides — to rank automotive service and review pages.' },
  { niche: 'E-commerce', desc: 'Topics on product reviews, buying guides, deal roundups, and brand comparisons — to push category and product pages higher.' },
];

const packages = [
  {
    name: 'Basic',
    links: '30 Links',
    domains: '30 unique domains',
    price: '$290',
    priceNote: '$9.67 per link',
    desc: 'Entry-level link diversity and brand signals across niche communities.',
    highlight: false,
    popular: false,
  },
  {
    name: 'Standard',
    links: '60 Links',
    domains: '60 unique domains',
    price: '$520',
    priceNote: '$8.67 per link',
    desc: 'Consistent presence across primary niche communities — our most popular volume.',
    highlight: true,
    popular: true,
  },
  {
    name: 'Powerful',
    links: '120 Links',
    domains: '120 unique domains',
    price: '$940',
    priceNote: '$7.83 per link',
    desc: 'High-volume coverage for competitive verticals needing strong profile diversification.',
    highlight: false,
    popular: false,
  },
];

const included = [
  'Indexator processing (~60% avg index rate)',
  'Manual review of every single link before delivery',
  'One unique domain per link — no domain repeats',
  'Niche-matched topics only — no off-topic placements',
  'Full detailed report with all URLs and anchors',
  'Replacement guarantee for removed links',
  'Natural even placement over the campaign period',
  'Tier-2 links as an additional layer of link equity',
];

type Pkg = typeof packages[number];

export default function CrowdLinksPage() {
  const [selectedPkg, setSelectedPkg] = useState<Pkg | null>(null);

  useSEO({
    title: 'Crowd Links — Forum & Community Link Building | Vladenza',
    description: 'Scale your link profile with natural forum, Reddit, and Quora placements from aged accounts. Spam-safe crowd marketing across 50+ platforms per niche.',
    canonical: 'https://vladenza.com/services/crowd-links',
  });

  return (
    <ServicePageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`cl-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
          <line x1="30" y1="30" x2="30" y2="90" stroke="#F97316" strokeWidth="3" opacity="0.18" strokeLinecap="round"/>
          <line x1="0" y1="60" x2="60" y2="60" stroke="#F97316" strokeWidth="3" opacity="0.18" strokeLinecap="round"/>
        </svg>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Users size={12} />
              Service — Crowd Links
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              Forum & Community Links<br />
              <span className="text-[#F97316]">Built at Scale, Done Right</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              Crowd marketing links from forums, Q&A platforms, and niche communities — posted naturally by real account operators to build referral trust and domain diversity.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg(packages[1])}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                Launch Campaign <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                From $290 · Delivered in 5–10 days
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
              How We Do It
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Not spam — genuine community presence</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">Anyone can blast links. We build credibility through context-appropriate contributions that survive moderation and earn referrals.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-[#F97316]/20 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-[#F97316] transition-colors">
                  <f.icon size={18} className="text-[#F97316] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-4">
              Packages
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Crowd link packages</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Every package includes the same full-quality delivery — choose by volume.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl border overflow-hidden flex flex-col ${pkg.highlight ? 'bg-[#F97316] border-[#F97316] shadow-2xl shadow-orange-500/20 scale-[1.02]' : 'bg-[#161616] border-white/10'}`}
              >
                {pkg.popular && (
                  <div className="bg-white/15 text-white text-[10px] font-black uppercase tracking-widest text-center py-2.5 border-b border-white/20">
                    ★ Most Popular
                  </div>
                )}
                <div className="p-7 flex flex-col flex-1">
                  {/* Name + domains */}
                  <div className="mb-5">
                    <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-semibold ${pkg.highlight ? 'text-white/90' : 'text-[#F97316]'}`}>{pkg.domains}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                  </div>
                  <div className={`text-xs mb-6 ${pkg.highlight ? 'text-orange-100' : 'text-gray-500'}`}>{pkg.priceNote} · one-time payment</div>

                  {/* Divider */}
                  <div className={`h-px mb-5 ${pkg.highlight ? 'bg-white/25' : 'bg-white/8'}`} />

                  {/* Desc */}
                  <p className={`text-sm leading-relaxed mb-6 flex-1 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.desc}</p>

                  {/* CTA */}
                  <button
                    onClick={() => setSelectedPkg(pkg)}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-50' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                  >
                    Order Now <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* What's included checklist */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">What's included in every package</p>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
              {included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={14} className="flex-shrink-0 text-[#F97316] mt-0.5" />
                  <span className="text-sm text-gray-300 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <span className="text-xs text-gray-500">Works for all niches · Best for link profile diversification & early-stage link building</span>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">Results typically visible within 2–3 weeks of delivery.</p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              Niches
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Niche-matched topics by vertical</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Every placement is wrapped in a relevant topic context — so links reinforce your target keywords, not just pass equity.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((uc) => (
              <div key={uc.niche} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <h4 className="text-gray-900 font-semibold text-sm">{uc.niche}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Language-specific packages */}
      <section className="py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Crowd links by language market</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">Each market has its own platforms, moderation norms, and conversational tone — pick the one that matches your audience.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { code: 'english', label: 'English' },
              { code: 'spanish', label: 'Spanish' },
              { code: 'german', label: 'German' },
              { code: 'french', label: 'French' },
              { code: 'portuguese', label: 'Portuguese (Brazil)' },
              { code: 'korean', label: 'Korean' },
            ].map((l) => (
              <a
                key={l.code}
                href={`/services/crowd-links/${l.code}`}
                className="bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 hover:border-[#F97316] hover:text-[#F97316] transition-colors"
              >
                {l.label} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <ServiceSeoBlock
        heading="Crowd links: natural signals from forums and communities"
        intro="Crowd marketing places your brand inside real conversations on forums, Q&A sites, and communities like Reddit and Quora. These links diversify your profile with the kind of organic, user-generated signals that look natural to Google — and increasingly help AI search engines understand how real people discuss your brand."
        body={[
          "The value of crowd links is not raw authority — it is diversity, referral traffic, and context. We post from aged, trusted accounts and contribute genuinely useful answers, so mentions are accepted and stick instead of being removed as spam. Coverage spans 50+ relevant platforms per niche.",
          "Crowd links work best as a support layer beneath stronger placements. Combine them with [guest posting](/services/guest-posting) and [niche edits](/services/niche-edits) for a balanced, penalty-safe profile. Learn how we [scale crowd marketing without penalties](/blog/crowd-marketing-scale-without-penalty) in our guide.",
          "Curious about results? Our [case studies](/case-studies) show how diversified link profiles — including crowd signals — supported ranking and traffic growth across competitive niches.",
        ]}
        faqs={[
          { q: 'What are crowd links?', a: 'Crowd links are backlinks and brand mentions placed within forums, Q&A platforms, and online communities as part of natural, helpful discussion — a technique often called crowd marketing.' },
          { q: 'Are crowd links safe for SEO?', a: 'Yes. Because they are placed as genuine contributions from aged accounts across many platforms, they create a natural, diversified signal rather than a spammy footprint.' },
          { q: 'Do crowd links pass authority?', a: 'Their main value is profile diversity, referral traffic, and contextual relevance rather than raw link equity. They complement high-authority placements like guest posts and niche edits.' },
          { q: 'How many platforms do you cover?', a: 'We work across 50+ relevant platforms per niche, choosing communities where your audience is genuinely active.' },
        ]}
      />

      {/* Order Modal */}
      {selectedPkg && (
        <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      )}
    </ServicePageLayout>
  );
}
