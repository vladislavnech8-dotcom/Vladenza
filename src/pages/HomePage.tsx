import { useState } from 'react';
import { ArrowRight, ArrowDown, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LinkPlanModal from '../components/LinkPlanModal';
import ReviewsSection from '../components/ReviewsSection';
import FAQ from '../components/FAQ';
import { useSEO } from '../hooks/useSEO';
import { trackEvent } from '../lib/analytics';
import { nicheEditPlacements } from '../data/nicheEditPlacements';
import { NICHE_EDIT_STARTING_PRICE, sampleReportUrl } from '../data/nicheEditPackages';
import { cases } from '../data/cases';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const linkProducts = [
  {
    emoji: '🔗',
    name: 'Niche Edits',
    desc: 'Links added inside existing, relevant articles.',
    price: `From $${NICHE_EDIT_STARTING_PRICE}`,
    best: 'Adding contextual links without publishing a new article.',
    href: '/services/niche-edits',
    placementsLink: '/services/niche-edits#placements',
  },
  {
    emoji: '📝',
    name: 'Guest Posts',
    desc: 'New articles published with your backlink included naturally in the content.',
    price: 'From $80',
    best: 'Building links around a new topic or target page.',
    href: '/services/guest-posting',
  },
  {
    emoji: '💬',
    name: 'Crowd Links',
    desc: 'Contextual mentions in forums and relevant online discussions.',
    price: 'From $290',
    best: 'Diversifying the backlink profile with community placements.',
    href: '/services/crowd-links',
  },
];

const philosophyRows = [
  { emoji: '🔗', title: 'Build referring domains', desc: 'Lower-cost links add diversity to the referring-domain count.' },
  { emoji: '🎯', title: 'Support priority pages', desc: 'Stronger editorial placements point link equity at commercial pages.' },
  { emoji: '⚖️', title: 'Diversify the link profile', desc: 'Community links make the profile broader and more natural.' },
  { emoji: '📈', title: 'Scale gradually', desc: 'Link velocity and mix adjust over time based on results.' },
];

const processSteps = [
  { emoji: '🔍', num: '01', title: 'Analyze', desc: 'Website, competitors, referring domains and anchors.' },
  { emoji: '🧩', num: '02', title: 'Build the Mix', desc: 'Choose link types, DR/traffic ranges and target pages.' },
  { emoji: '🔗', num: '03', title: 'Place Links', desc: 'Manual outreach, placement and quality review.' },
  { emoji: '📊', num: '04', title: 'Report & Adjust', desc: 'See every live URL, anchor and metric in the report.' },
];

const niches = [
  { emoji: '🎰', label: 'iGaming', href: '/services/link-packages/igaming' },
  { emoji: '💻', label: 'SaaS', href: '/services/link-packages/saas' },
  { emoji: '🚗', label: 'Automotive', href: '/services/link-packages/auto' },
  { emoji: '🩺', label: 'Health', href: '/services/link-packages/health' },
  { emoji: '🔐', label: 'Proxy & VPN', href: '/services/link-packages/proxy' },
  { emoji: '🏠', label: 'Home Services', href: '/services/link-packages/renovations' },
];

const secondaryServices = [
  { emoji: '📍', label: 'Local Link Building', href: '/services/local-seo-links' },
  { emoji: '🔎', label: 'SEO Audit', href: '/services/seo-audit' },
  { emoji: '🤖', label: 'AI & LLM Visibility', href: '/services/ai-llm' },
  { emoji: '💼', label: 'LinkedIn Growth', href: '/services/linkedin-personal' },
];

const homeFaqs = [
  { q: 'What type of backlinks should I choose?', a: 'It depends on your current backlink profile, competitors, target pages and budget. Niche edits are faster and cheaper because the article already exists. Guest posts give you more control over topic and context. Crowd links add diversity. Most campaigns use a mix.' },
  { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual niche edit orders, we source within the selected DR and traffic range and review each placement before it goes live.' },
  { q: 'Can I provide my own anchors?', a: 'Yes. You can provide preferred anchors during checkout or send them after payment. You can also let us recommend anchors based on your current backlink profile and target pages.' },
  { q: 'How long does delivery take?', a: 'Niche edits typically take 3–7 days. Guest posts take 10–21 days because a new article needs to be written and published. Crowd links are delivered in 5–10 days.' },
  { q: 'Can I order links individually?', a: 'Yes. You can buy a single niche edit, one guest post, or a small batch of crowd links. There is no minimum order. You can also combine different link types in the same checkout.' },
  { q: 'Do you guarantee rankings?', a: 'No. No link-building service can guarantee specific search rankings. Rankings depend on many factors outside our control, including algorithm updates, competitor activity and on-page signals. We guarantee manual placement on real websites within the selected metrics.' },
];

const featuredCases = cases.slice(0, 3);
const previewPlacements = nicheEditPlacements.slice(0, 4);

export default function HomePage() {
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);

  useSEO({
    title: 'Vladenza — Link Building Agency | Niche Edits, Guest Posts & Crowd Links',
    description: 'Buy niche edits, guest posts and crowd links individually or combined into a link-building plan. From $70 per placement. 8+ years in link building.',
    canonical: 'https://vladenza.com/',
  });

  const openLinkPlan = () => {
    trackEvent('get_link_plan');
    setLinkPlanOpen(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openLinkPlan} />

      {/* 1. Hero */}
      <section className="relative overflow-hidden pt-16 pb-12 lg:pt-20 lg:pb-14" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-center">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-4">
                Link Building Built Around<br />Your Site, Competition & Budget
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-2 font-semibold">
                Guest posts, niche edits and community links — available as individual placements or combined into a link-building plan based on your backlink profile.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                8+ years in link building · 3,000+ completed orders
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { scrollToId('products'); trackEvent('view_packages'); }}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  View Link Options <ArrowDown size={14} />
                </button>
                <button
                  onClick={openLinkPlan}
                  className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  Get a Link Plan <ArrowRight size={14} />
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-3">Not sure what to choose? We'll review your site and competitors.</p>
            </div>

            {/* Right: Build Your Link Mix visual */}
            <div className="hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Your Campaign</div>
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🔗</span>
                      <span className="text-sm font-semibold text-gray-900">Niche Edits</span>
                    </div>
                    <span className="text-xs font-bold text-[#F97316]">From ${NICHE_EDIT_STARTING_PRICE}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">📝</span>
                      <span className="text-sm font-semibold text-gray-900">Guest Posts</span>
                    </div>
                    <span className="text-xs font-bold text-[#F97316]">From $80</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">💬</span>
                      <span className="text-sm font-semibold text-gray-900">Crowd Links</span>
                    </div>
                    <span className="text-xs font-bold text-[#F97316]">From $290</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 mb-2">Not sure about the mix?</p>
                  <button onClick={openLinkPlan} className="flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    Get a Link Plan <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust strip */}
      <section className="bg-gray-950 py-5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-[#F97316] text-[#F97316]" />)}
              </div>
              <span className="text-xl font-black text-white">4.9</span>
              <span className="text-xs text-gray-400">across review platforms</span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">8+</span>
              <span className="text-xs text-gray-400">years in link building</span>
            </div>
            <div className="w-px h-6 bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white">3,000+</span>
              <span className="text-xs text-gray-400">completed orders</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Link Products */}
      <section id="products" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Choose How You Want to Build Links</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">
            Buy individual placements or combine different link types into a broader campaign.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {linkProducts.map((p) => (
              <Link
                key={p.name}
                to={p.href}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="text-2xl mb-3">{p.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                <div className="text-xl font-black text-[#F97316] mb-3">{p.price}</div>
                <div className="bg-gray-50 rounded-lg px-3 py-2.5 mb-4">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Best for</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{p.best}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] transition-colors flex items-center gap-1.5">
                    View {p.name} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  {p.placementsLink && (
                    <span className="text-xs text-gray-400 hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      See real placements <ExternalLink size={11} />
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Not Sure What to Buy */}
      <section className="py-10 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Not Sure What Links You Need?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                Send us your website and budget. We'll review your backlink profile and competitors and suggest how we'd split the budget.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1">$1,000 budget → 4 Niche Edits + 3 Guest Posts + 15 Crowd Links</span>
              </div>
              <p className="text-[10px] text-gray-300 mt-1.5">Illustrative example. Actual mix depends on your site and goals.</p>
            </div>
            <button
              onClick={openLinkPlan}
              className="flex-shrink-0 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              Get a Link Plan <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Different Links / Strategy */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Different Links Do Different Jobs</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-2xl">
            Not every backlink needs to be a $300 placement. The right mix depends on the site, competitors, target pages and budget.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {philosophyRows.map((r) => (
              <div key={r.title} className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <span className="text-xl flex-shrink-0 mt-0.5">{r.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">{r.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <span className="text-sm font-bold text-gray-900">Strategy Over Templates.</span>
            <span className="text-sm text-gray-400 ml-2">No two campaigns get the same link package.</span>
          </div>
        </div>
      </section>

      {/* 6. Real Placements Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">See the Links Before You Buy</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            Examples of placements we've delivered across different niches, DR levels and traffic ranges.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {previewPlacements.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-[#F97316]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900 truncate">{p.domain}</span>
                  <ExternalLink size={12} className="text-gray-300 group-hover:text-[#F97316] transition-colors flex-shrink-0" />
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-semibold text-gray-600">{p.niche}</span>
                  <span>DR {p.dr}</span>
                  <span>{p.traffic.toLocaleString()} traffic</span>
                </div>
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/services/niche-edits#placements" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              Explore Real Placements <ArrowRight size={14} />
            </Link>
            {sampleReportUrl && (
              <a href={sampleReportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-[#F97316] transition-colors">
                See Sample Report <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* 7. Case Studies */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Real Campaigns. Real Outcomes.</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            Real client campaigns with documented metrics. No stock screenshots.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredCases.map((c) => {
              const drStat = c.stats.find((s) => s.label.toLowerCase().includes('dr'));
              return (
                <Link
                  key={c.slug}
                  to={`/case-studies/${c.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c.color }}>{c.niche}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">{c.service}</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-4xl font-black leading-none transition-transform group-hover:scale-105 origin-left duration-300" style={{ color: c.color }}>
                      {c.metric}
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-medium">{c.metricSub}</div>
                  </div>
                  {drStat && (
                    <div className="flex items-center gap-2 mb-4 text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-400 text-xs">{drStat.label}:</span>
                      <span className="font-bold text-gray-800 text-sm">{drStat.value}</span>
                    </div>
                  )}
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors mb-4 flex-1">{c.title}</h3>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xs font-bold text-gray-700">{c.period}</span>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      View Case Study <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              Explore All Case Studies <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">How We Build a Campaign</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">
            From analysis to reporting, every step is designed around your site and goals.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((s) => (
              <div key={s.num} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-xs font-black text-gray-300">{s.num}</span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Reviews */}
      <ReviewsSection />

      {/* 10. Niches */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Experience Across Competitive Niches</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            We've built link campaigns in some of the most contested verticals online.
          </p>
          <div className="flex flex-wrap gap-3">
            {niches.map((n) => (
              <Link
                key={n.label}
                to={n.href}
                className="group flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-200"
              >
                <span className="text-lg">{n.emoji}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{n.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Secondary Services */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">More Ways We Can Help</h2>
          <p className="text-gray-500 text-sm mb-6">Additional services beyond core link building.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {secondaryServices.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="group flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 hover:border-[#F97316]/30 hover:bg-white transition-all duration-200"
              >
                <span className="text-lg">{s.emoji}</span>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{s.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section id="faq" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Questions Before You Buy</h2>
          <p className="text-gray-500 text-sm mb-8">Honest answers to the things that matter before ordering.</p>
          <FAQ faqs={homeFaqs} />
        </div>
      </section>

      {/* 13. Final CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Not Sure Where to Start?</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Send us your website and budget. We'll review the backlink profile and recommend where we'd start.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={openLinkPlan}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20 flex items-center gap-2"
            >
              Get a Link Plan <ArrowRight size={14} />
            </button>
            <button
              onClick={() => scrollToId('products')}
              className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200"
            >
              Explore Link Services
            </button>
          </div>
        </div>
      </section>

      <Footer onOpenModal={openLinkPlan} />
      <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
    </div>
  );
}
