import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, ExternalLink, Check, Link2, FileText, MessagesSquare, Trophy, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LinkPlanModal from '../components/LinkPlanModal';
import FAQ from '../components/FAQ';
import { useSEO } from '../hooks/useSEO';
import { trackEvent } from '../lib/analytics';
import { fetchPlacements, type Placement, type PlacementServiceType } from '../data/placements';
import { NICHE_EDIT_STARTING_PRICE } from '../data/nicheEditPackages';
import { cases } from '../data/cases';
import PlacementCard from '../components/PlacementCard';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const linkProducts = [
  {
    icon: Link2,
    name: 'Niche Edits',
    desc: 'Links added inside existing, relevant articles.',
    price: `From $${NICHE_EDIT_STARTING_PRICE}`,
    best: 'contextual authority links',
    href: '/services/niche-edits',
    placementsLink: '/services/niche-edits#placements',
  },
  {
    icon: FileText,
    name: 'Guest Posts',
    desc: 'New articles published with your backlink included naturally in the content.',
    price: 'From $80',
    best: 'new content & target pages',
    href: '/services/guest-posting',
  },
  {
    icon: MessagesSquare,
    name: 'Crowd Links',
    desc: 'Contextual mentions in forums and relevant online discussions.',
    price: 'From $290',
    best: 'backlink diversity & natural link profiles',
    href: '/services/crowd-links',
  },
];

const campaignServices = [
  { icon: Link2, name: 'Niche Edits', price: `From $${NICHE_EDIT_STARTING_PRICE}`, href: '/services/niche-edits' },
  { icon: FileText, name: 'Guest Posts', price: 'From $80', href: '/services/guest-posting' },
  { icon: MessagesSquare, name: 'Crowd Links', price: 'From $290', href: '/services/crowd-links' },
];

const clientLogos = [
  { name: 'LootBar', domain: 'lootbar.gg' },
  { name: 'AG Renovations', domain: 'ag-renovations.co.uk' },
  { name: 'Recently Followed', domain: 'recently-followed.com' },
  { name: 'Fields Builds', domain: 'fields-builds.com' },
  { name: 'iGMS', domain: 'igms.com' },
  { name: 'CasinoCanada', domain: 'casinocanada.com' },
  { name: 'Grafbase', domain: 'grafbase.com' },
  { name: 'CarBuzz', domain: 'carbuzz.com' },
  { name: 'Helpware', domain: 'helpware.com' },
  { name: 'Calday', domain: 'calday.com' },
  { name: 'Botnation', domain: 'botnation.ai' },
  { name: 'Foot Africa', domain: 'foot-africa.com' },
];

const SERVICE_TYPE_MAP: Record<TabKey, PlacementServiceType> = {
  'niche-edits': 'niche_edit',
  'guest-posts': 'guest_post',
  'crowd-links': 'crowd_link',
};

type TabKey = 'niche-edits' | 'guest-posts' | 'crowd-links';

const tabs: { key: TabKey; label: string; icon: typeof Link2 }[] = [
  { key: 'niche-edits', label: 'Niche Edits', icon: Link2 },
  { key: 'guest-posts', label: 'Guest Posts', icon: FileText },
  { key: 'crowd-links', label: 'Crowd Links', icon: MessagesSquare },
];

const secondaryServices = [
  { icon: '📍', label: 'Local SEO & Link Building', desc: 'Build geographically relevant authority and strengthen local organic visibility.', href: '/services/local-seo-links' },
  { icon: '🔎', label: 'SEO Audit & Strategy', desc: 'Technical, content, competitor and backlink analysis with an actionable roadmap.', href: '/services/seo-audit' },
  { icon: '🤖', label: 'AI & LLM Visibility', desc: 'Improve how your brand is discovered and referenced across AI-driven search experiences.', href: '/services/ai-llm' },
];

const homeFaqs = [
  { q: 'What type of backlinks should I choose?', a: 'It depends on your current backlink profile, competitors, target pages and budget. Niche edits are faster and cheaper because the article already exists. Guest posts give you more control over topic and context. Crowd links add diversity. Most campaigns use a mix.' },
  { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual niche edit orders, we source within the selected DR and traffic range and review each placement before it goes live.' },
  { q: 'Can I provide my own target URLs and anchors?', a: 'Yes. You can provide preferred anchors during checkout or send them after payment. You can also let us recommend anchors based on your current backlink profile and target pages.' },
  { q: 'How long does delivery take?', a: 'Niche edits typically take 3–7 days. Guest posts take 10–21 days because a new article needs to be written and published. Crowd links are delivered in 5–10 days.' },
  { q: 'Can I order links individually?', a: 'Yes. You can buy a single niche edit, one guest post, or a small batch of crowd links. There is no minimum order. You can also combine different link types in the same checkout.' },
  { q: 'Do you guarantee rankings?', a: 'No. No link-building service can guarantee specific search rankings. Rankings depend on many factors outside our control, including algorithm updates, competitor activity and on-page signals. We guarantee manual placement on real websites within the selected metrics.' },
];

const featuredCases = cases.slice(0, 3);

export default function HomePage() {
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('niche-edits');
  const [homepagePlacements, setHomepagePlacements] = useState<Placement[]>([]);

  useSEO({
    title: 'Vladenza — Link Building Services | Niche Edits, Guest Posts & Crowd Links',
    description: 'Buy niche edits, guest posts and crowd links individually or combined into a link-building plan. From $70 per placement. 8+ years in link building.',
    canonical: 'https://vladenza.com/',
  });

  useEffect(() => {
    fetchPlacements({ status: 'active', homepage_featured: true }).then(setHomepagePlacements);
  }, []);

  const openLinkPlan = () => {
    trackEvent('get_link_plan');
    setLinkPlanOpen(true);
  };

  const activeServiceType = SERVICE_TYPE_MAP[activeTab];
  const tabPlacements = homepagePlacements.filter((p) => p.service_type === activeServiceType).slice(0, 6);
  const totalActiveCount = homepagePlacements.length;

  const tabCtaLink = '/placements';
  const tabCtaLabel = 'Explore All Placement Examples';

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openLinkPlan} />

      {/* 1. HERO */}
      <section className="relative overflow-hidden pt-[88px] pb-10 lg:pb-12">
        {/* Subtle warm background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        {/* Orange radial glow behind card */}
        <div
          className="absolute pointer-events-none"
          style={{
            right: '-5%', top: '15%', width: '500px', height: '500px',
            background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-12">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-12 items-start">

            {/* LEFT: content */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">Link Building Agency</p>
              <h1 className="text-[28px] md:text-4xl lg:text-[44px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
                Link Building Services &mdash;<br className="hidden sm:block" />
                <span className="sm:ml-1">From Individual Links to Full Campaigns</span>
              </h1>
              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-2 max-w-xl">
                Order niche edits, guest posts and community links individually &mdash; or let us build a custom link-building campaign around your website, competitors and budget.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">
                8+ years in link building &middot; 3,000+ completed orders
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { scrollToId('products'); trackEvent('view_packages'); }}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  Explore Link Building Services <ArrowDown size={14} />
                </button>
                <button
                  onClick={openLinkPlan}
                  className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-2"
                >
                  Get a Link Plan <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* RIGHT: campaign card */}
            <div className="hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm shadow-gray-200/60">
                <h3 className="text-base font-bold text-gray-900 mb-1.5">Build Your Link Campaign</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-5">Choose individual placements or combine them into a campaign.</p>

                <div className="flex flex-col gap-2.5 mb-5">
                  {campaignServices.map((s) => (
                    <Link
                      key={s.name}
                      to={s.href}
                      className="group flex items-center justify-between border border-gray-100 rounded-xl px-3.5 py-3 hover:border-[#F97316]/30 hover:bg-orange-50/40 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                          <s.icon size={16} className="text-[#F97316]" />
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#F97316]">{s.price}</span>
                    </Link>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 mb-2">Not sure what to choose?</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">
                    We'll review your backlink profile and recommend the mix.
                  </p>
                  <button onClick={openLinkPlan} className="flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    Get a Link Plan <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROOF BAR */}
      <section className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
            <div className="flex items-center justify-center gap-3">
              <Trophy size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">8+</div>
                <div className="text-[11px] text-gray-400 mt-1">Years in Link Building</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 sm:border-x sm:border-white/10 sm:px-6">
              <Package size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">3,000+</div>
                <div className="text-[11px] text-gray-400 mt-1">Completed Orders</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">Manual</div>
                <div className="text-[11px] text-gray-400 mt-1">Link Building</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHOOSE HOW YOU WANT TO BUILD LINKS */}
      <section id="products" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-[#F97316]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                <div className="text-xl font-black text-[#F97316] mb-4">{p.price}</div>
                <div className="flex items-center gap-1.5 mb-5 text-sm">
                  <Check size={14} className="text-[#F97316] flex-shrink-0" />
                  <span className="text-gray-600"><span className="font-semibold">Best for:</span> {p.best}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
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

      {/* 4. COMPANIES WE'VE WORKED WITH */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-3">Selected Clients</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Companies We've Worked With</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">
            A selection of businesses we've supported with link-building campaigns.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
            {clientLogos.map((c) => (
              <div key={c.domain} className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-200">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
                  alt={c.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain flex-shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-sm font-semibold text-gray-500 truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SEE THE LINKS BEFORE YOU BUY */}
      <section id="placements" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">See the Links Before You Buy</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            Browse real examples of placements we've delivered across different link types, niches, DR levels and traffic ranges.
          </p>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === t.key
                    ? 'bg-[#F97316] text-white border border-[#F97316]'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <t.icon size={14} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Example cards — max 6 (3 cols × 2 rows) */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {tabPlacements.length === 0 ? (
              <div className="col-span-3 py-10 text-center">
                <p className="text-gray-400 text-sm">Examples coming soon for this service.</p>
              </div>
            ) : tabPlacements.map((p) => (
              <PlacementCard key={p.id} p={p} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to={tabCtaLink} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {tabCtaLabel} <ArrowRight size={14} />
            </Link>
            {totalActiveCount > 0 && (
              <span className="text-xs text-gray-400">
                {totalActiveCount}+ real placements across Niche Edits, Guest Posts & Crowd Links
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 6. REAL CAMPAIGNS. REAL OUTCOMES. */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Real Campaigns. Real Outcomes.</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">
            Real client campaigns with documented link-building and organic search results.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredCases.map((c) => {
              const drStat = c.stats.find((s) => s.label.toLowerCase().includes('dr'));
              const secondaryStat = c.stats.find((s) => !s.label.toLowerCase().includes('dr') && !s.label.toLowerCase().includes('timeline'));
              return (
                <Link
                  key={c.slug}
                  to={`/case-studies/${c.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F97316]">{c.niche}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">{c.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{c.service}</p>
                  <div className="mb-4">
                    <div className="text-4xl font-black leading-none text-[#F97316]">
                      {c.metric}
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-medium">{c.metricSub}</div>
                  </div>
                  {secondaryStat && (
                    <div className="flex items-center gap-2 mb-3 text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-400 text-xs">{secondaryStat.label}:</span>
                      <span className="font-bold text-gray-800 text-sm">{secondaryStat.value}</span>
                    </div>
                  )}
                  {drStat && (
                    <div className="flex items-center gap-2 mb-4 text-sm bg-gray-50 rounded-lg px-3 py-2">
                      <span className="text-gray-400 text-xs">{drStat.label}:</span>
                      <span className="font-bold text-gray-800 text-sm">{drStat.value}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs font-bold text-gray-700">{c.period}</span>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      Read Case Study <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
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

      {/* 7. NEED MORE THAN LINK BUILDING? */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Need More Than Link Building?</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">
            Additional SEO services for clients who need strategy, analysis or broader search visibility.
          </p>
          <div className="grid sm:grid-cols-3 gap-5">
            {secondaryServices.map((s) => (
              <Link
                key={s.label}
                to={s.href}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{s.desc}</p>
                <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] flex items-center gap-1.5 transition-colors mt-auto">
                  Explore {s.label.split(' & ')[0]} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. QUESTIONS BEFORE YOU BUY */}
      <section id="faq" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Questions Before You Buy</h2>
          <p className="text-gray-500 text-sm mb-8">Honest answers to the things that matter before ordering.</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              {homeFaqs.slice(0, Math.ceil(homeFaqs.length / 2)).map((faq, i) => (
                <FAQ key={i} faqs={[faq]} compact />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {homeFaqs.slice(Math.ceil(homeFaqs.length / 2)).map((faq, i) => (
                <FAQ key={i} faqs={[faq]} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Not Sure Which Links You Need?</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Send us your website and budget. We'll review your backlink profile and recommend a practical link-building mix.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={openLinkPlan}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20 flex items-center gap-2"
            >
              Get a Custom Link Plan <ArrowRight size={14} />
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

      <Footer />
      <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
    </div>
  );
}
