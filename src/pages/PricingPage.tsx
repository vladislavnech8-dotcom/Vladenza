import { useState } from 'react';
import {
  Search, FileText, Link2, Users, Cpu, MapPin,
  Linkedin, Building2, Lock, ArrowRight, CheckCircle, Zap,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';

interface ServicePricing {
  icon: typeof Search;
  name: string;
  href: string;
  tagline: string;
  tiers: { label: string; price: string; desc: string; features: string[]; highlight: boolean }[];
}

const services: ServicePricing[] = [
  {
    icon: Search,
    name: 'SEO Audit',
    href: '/services/seo-audit',
    tagline: 'Full technical & strategic audit',
    tiers: [
      { label: 'Standard', price: 'From $500', desc: 'Technical SEO audit with actionable recommendations.', features: ['100+ page audit', 'Technical issues report', 'Content gap analysis', 'Competitor overview', '30-min strategy call'], highlight: false },
      { label: 'Advanced', price: 'From $1,200', desc: 'Deep audit with link profile and penalty check.', features: ['Everything in Standard', 'Backlink profile audit', 'Penalty risk assessment', 'Content strategy roadmap', 'Priority delivery (5 days)'], highlight: true },
    ],
  },
  {
    icon: FileText,
    name: 'Guest Posting',
    href: '/services/guest-posting',
    tagline: 'Editorial links on real traffic sites',
    tiers: [
      { label: 'Starter', price: 'From $80', desc: 'DR 30–50 placements with 800+ word articles.', features: ['Niche-relevant domain', 'Manual QC check', '800+ word article', 'Permanent placement', 'Report with live URL'], highlight: false },
      { label: 'Authority', price: 'From $180', desc: 'DR 50–70 high-traffic editorial sites.', features: ['High-traffic editorial sites', '1,200+ word content', 'Strategic anchor mapping', 'Priority support', 'Full placement report'], highlight: true },
      { label: 'Premium', price: 'From $380', desc: 'DR 70–90+ industry publications.', features: ['Industry publication placements', 'Expert-level content', 'Editor-reviewed copy', 'Dedicated account manager', 'Custom anchor planning'], highlight: false },
    ],
  },
  {
    icon: Link2,
    name: 'Niche Edits',
    href: '/services/niche-edits',
    tagline: 'Links inserted in aged, indexed content',
    tiers: [
      { label: 'Essential', price: 'From $80', desc: 'DR 20–40+ contextual placements.', features: ['Contextual placement', 'Manual QC', 'Custom anchor', 'Permanent link', 'Report with URL'], highlight: false },
      { label: 'Growth', price: 'From $120', desc: 'DR 30–50+ high-relevance placements.', features: ['All in Essential', 'High-relevance articles', 'Traffic-verified domains', 'Strategic anchor mapping', 'Priority queue'], highlight: true },
      { label: 'Power', price: 'From $220', desc: 'DR 50–80+ premium aged content.', features: ['All in Growth', 'Premium publisher network', 'Editor-level placements', 'Anchor strategy session', 'Dedicated account manager'], highlight: false },
    ],
  },
  {
    icon: Users,
    name: 'Crowd Links',
    href: '/services/crowd-links',
    tagline: 'Forum & community link building',
    tiers: [
      { label: '30 Links', price: '$290', desc: '$9.67 per link — starter package.', features: ['30 crowd links', 'Niche-relevant forums', 'Natural placement', '5–10 day delivery', 'Full report'], highlight: false },
      { label: '60 Links', price: '$520', desc: '$8.67 per link — best value.', features: ['60 crowd links', 'All in 30 Links', 'Priority forums', 'Diversified anchors', '10–14 day delivery'], highlight: true },
      { label: '120 Links', price: '$940', desc: '$7.83 per link — bulk discount.', features: ['120 crowd links', 'All in 60 Links', 'Premium forum access', 'Custom anchor strategy', 'Dedicated manager'], highlight: false },
    ],
  },
  {
    icon: Cpu,
    name: 'AI & LLM SEO',
    href: '/services/ai-llm',
    tagline: 'Get cited by ChatGPT & Perplexity',
    tiers: [
      { label: 'GEO Starter', price: 'From $1,500', desc: 'Entity optimization & AI visibility baseline.', features: ['Entity & schema audit', 'Content optimization for AI', '3 target AI engines', 'Monthly visibility report', 'Strategy call'], highlight: false },
      { label: 'GEO Pro', price: 'From $3,500', desc: 'Full GEO campaign with content & monitoring.', features: ['Everything in Starter', 'AI content optimization', '6 target AI engines', 'Bi-weekly reporting', 'Dedicated specialist'], highlight: true },
      { label: 'Enterprise', price: 'Custom', desc: 'Multi-brand AI visibility at scale.', features: ['Everything in Pro', 'Multi-brand strategy', 'All major AI engines', 'Custom KPI dashboard', 'Priority delivery'], highlight: false },
    ],
  },
  {
    icon: MapPin,
    name: 'Local SEO Links',
    href: '/services/local-seo-links',
    tagline: 'Map pack & local organic rankings',
    tiers: [
      { label: 'Local Starter', price: 'From $600', desc: 'Citations & local link foundation.', features: ['50 local citations', '10 local directory links', 'Google Business optimization', 'Monthly report'], highlight: false },
      { label: 'Local Pro', price: 'From $1,200', desc: 'Full local SEO link campaign.', features: ['Everything in Starter', '30 local links', 'Local PR placements', 'Review generation strategy', 'Bi-weekly calls'], highlight: true },
    ],
  },
  {
    icon: Linkedin,
    name: 'LinkedIn Personal',
    href: '/services/linkedin-personal',
    tagline: 'Personal brand & profile growth',
    tiers: [
      { label: 'Profile Boost', price: 'From $400', desc: 'Profile optimization & content strategy.', features: ['Profile optimization', 'Content calendar', '10 posts/month', 'Engagement strategy', 'Monthly report'], highlight: false },
      { label: 'Authority Builder', price: 'From $900', desc: 'Full personal branding campaign.', features: ['Everything in Boost', '20 posts/month', 'LinkedIn SEO', 'Connection strategy', 'Dedicated writer'], highlight: true },
    ],
  },
  {
    icon: Building2,
    name: 'LinkedIn Company',
    href: '/services/linkedin-company',
    tagline: 'Company page management & B2B leads',
    tiers: [
      { label: 'Page Starter', price: 'From $700', desc: 'Company page setup & content.', features: ['Page optimization', '8 posts/month', 'Employee advocacy kit', 'Monthly analytics', 'Strategy call'], highlight: false },
      { label: 'B2B Growth', price: 'From $1,500', desc: 'Full LinkedIn lead generation.', features: ['Everything in Starter', '16 posts/month', 'Lead gen campaigns', 'Sales Navigator setup', 'Dedicated manager'], highlight: true },
    ],
  },
  {
    icon: Lock,
    name: 'White Label',
    href: '/services/white-label',
    tagline: 'Silent fulfilment for agencies',
    tiers: [
      { label: 'Partner', price: 'From $1K', desc: 'Reseller link building packages.', features: ['Branded reports', 'Volume discounts', 'Dedicated portal', 'Priority delivery', 'Monthly billing'], highlight: false },
      { label: 'Agency Partner', price: 'From $3K', desc: 'Full white-label fulfillment.', features: ['Everything in Partner', 'Custom SLA', 'Bulk pricing', 'Account manager', 'Quarterly strategy reviews'], highlight: true },
    ],
  },
];

export default function PricingPage() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: 'Pricing — All Service Prices | Vladenza',
    description: 'Transparent pricing for every Vladenza service: SEO audits, guest posting, niche edits, crowd links, AI/LLM SEO, local SEO, LinkedIn, and white-label packages.',
    canonical: 'https://vladenza.com/pricing',
  });

  function openModal(service: string, price: string) {
    setSelectedPkg({ name: service, price, links: 'See service page', service });
  }

  function openGenericModal() {
    setSelectedPkg({ name: 'Custom Package', price: 'Custom', links: 'Get a quote', service: 'General Inquiry' });
  }

  return (
    <>
      <Navigation onOpenModal={openGenericModal} />
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
            <Zap size={12} />
            Pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
            Every Service,<br />
            <span className="text-[#F97316]">One Clear Price List</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            No hidden fees. No long-term lock-ins. Pick a service, choose a tier, and start your campaign within 5 business days.
          </p>
        </div>
      </section>

      {/* Service pricing sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-16">
          {services.map((svc) => (
            <div key={svc.name} id={svc.name.toLowerCase().replace(/\s+/g, '-')}>
              {/* Service header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <svc.icon size={20} className="text-[#F97316]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{svc.name}</h2>
                  <p className="text-gray-400 text-sm">{svc.tagline}</p>
                </div>
                <a
                  href={svc.href}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
                >
                  Details <ArrowRight size={13} />
                </a>
              </div>

              {/* Tiers */}
              <div className={`grid gap-5 ${svc.tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {svc.tiers.map((tier) => (
                  <div
                    key={tier.label}
                    className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
                      tier.highlight
                        ? 'bg-white border-2 border-[#F97316]/40 shadow-lg shadow-[#F97316]/10 hover:shadow-xl hover:shadow-[#F97316]/15'
                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {tier.highlight && (
                      <div className="mb-4">
                        <span className="bg-[#F97316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{tier.label}</h3>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">{tier.desc}</p>
                    <div className="text-2xl font-black text-gray-900 mb-5">{tier.price}</div>
                    <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <CheckCircle size={13} className="text-[#F97316] flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openModal(svc.name, tier.price)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        tier.highlight
                          ? 'bg-[#F97316] text-white hover:bg-[#EA580C] hover:shadow-md hover:shadow-orange-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Not sure which service fits?
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Tell us about your goals and we'll recommend the right mix of services for your campaign.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-orange-900/30"
          >
            Get a Custom Proposal <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <Footer onOpenModal={openGenericModal} />
    </>
  );
}
