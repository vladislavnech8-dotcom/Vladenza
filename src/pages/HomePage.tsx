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
import { cases, casesUk } from '../data/cases';
import PlacementCard from '../components/PlacementCard';
import { useLocale } from '../context/LocaleContext';
import { homePageContent } from '../lib/homeContent';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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




export default function HomePage() {
  const { locale, localizePath: lp } = useLocale();
  const c = homePageContent[locale];
  const featuredCases = cases.slice(0, 3).map(cs => {
    const tr = casesUk[cs.slug];
    return tr ? { ...cs, ...tr } : cs;
  });
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('niche-edits');
  const [homepagePlacements, setHomepagePlacements] = useState<Placement[]>([]);

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: locale === 'uk' ? 'https://vladenza.com/uk/' : 'https://vladenza.com/',
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Vladenza',
      description: c.seo.description,
      url: 'https://vladenza.com',
      logo: 'https://vladenza.com/logo.svg',
    },
  });

  useEffect(() => {
    fetchPlacements({ status: 'active', homepage_featured: true }).then(setHomepagePlacements);
  }, []);

  const openLinkPlan = () => {
    trackEvent('get_link_plan');
    setLinkPlanOpen(true);
  };

  const linkProducts = [
    { icon: Link2, name: c.products.items[0].name, desc: c.products.items[0].desc, price: `${c.labels.from} ${NICHE_EDIT_STARTING_PRICE}`, best: c.products.items[0].best, href: lp('/services/niche-edits'), placementsLink: lp('/services/niche-edits#placements') },
    { icon: FileText, name: c.products.items[1].name, desc: c.products.items[1].desc, price: `${c.labels.from} $80`, best: c.products.items[1].best, href: lp('/services/guest-posting') },
    { icon: MessagesSquare, name: c.products.items[2].name, desc: c.products.items[2].desc, price: `${c.labels.from} $290`, best: c.products.items[2].best, href: lp('/services/crowd-links') },
  ];

  const campaignServices = [
    { icon: Link2, name: c.products.items[0].name, price: `${c.labels.from} ${NICHE_EDIT_STARTING_PRICE}`, href: lp('/services/niche-edits') },
    { icon: FileText, name: c.products.items[1].name, price: `${c.labels.from} $80`, href: lp('/services/guest-posting') },
    { icon: MessagesSquare, name: c.products.items[2].name, price: `${c.labels.from} $290`, href: lp('/services/crowd-links') },
  ];

  const tabs: { key: TabKey; label: string; icon: typeof Link2 }[] = [
    { key: 'niche-edits', label: c.products.items[0].name, icon: Link2 },
    { key: 'guest-posts', label: c.products.items[1].name, icon: FileText },
    { key: 'crowd-links', label: c.products.items[2].name, icon: MessagesSquare },
  ];

  const secondaryServices = [
    { icon: '\uD83D\uDCCD', label: c.secondary.items[0].label, desc: c.secondary.items[0].desc, href: lp('/services/local-seo-links') },
    { icon: '\uD83D\uDD0E', label: c.secondary.items[1].label, desc: c.secondary.items[1].desc, href: lp('/services/seo-audit') },
    { icon: '\uD83E\uDD16', label: c.secondary.items[2].label, desc: c.secondary.items[2].desc, href: lp('/services/ai-llm') },
  ];

  const activeServiceType = SERVICE_TYPE_MAP[activeTab];
  const tabPlacements = homepagePlacements.filter((p) => p.service_type === activeServiceType).slice(0, 6);
  const totalActiveCount = homepagePlacements.length;
  const tabCtaLink = lp('/placements');
  const tabCtaLabel = c.placements.ctaLabel;

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openLinkPlan} />

      {/* 1. HERO */}
      <section className="relative overflow-hidden pt-[88px] pb-10 lg:pb-12">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        <div className="absolute pointer-events-none" style={{ right: '-5%', top: '15%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-12">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 lg:gap-12 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">{c.hero.badge}</p>
              <h1 className="text-[28px] md:text-4xl lg:text-[44px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
                {c.hero.h1Line1}<br className="hidden sm:block" />
                <span className="sm:ml-1">{c.hero.h1Line2}</span>
              </h1>
              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-2 max-w-xl">{c.hero.body}</p>
              <p className="text-gray-500 text-sm leading-relaxed mb-7">{c.hero.subtext}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { scrollToId('products'); trackEvent('view_packages'); }} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">
                  {c.hero.ctaPrimary} <ArrowDown size={14} />
                </button>
                <button onClick={openLinkPlan} className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
                  {c.hero.ctaSecondary} <ArrowRight size={14} />
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm shadow-gray-200/60">
                <h3 className="text-base font-bold text-gray-900 mb-1.5">{c.hero.cardTitle}</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-5">{c.hero.cardBody}</p>
                <div className="flex flex-col gap-2.5 mb-5">
                  {campaignServices.map((s) => (
                    <Link key={s.name} to={s.href} className="group flex items-center justify-between border border-gray-100 rounded-xl px-3.5 py-3 hover:border-[#F97316]/30 hover:bg-orange-50/40 transition-all duration-200">
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
                  <p className="text-xs text-gray-400 mb-2">{c.hero.cardNotSure}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{c.hero.cardNotSureBody}</p>
                  <button onClick={openLinkPlan} className="flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    {c.hero.cardCta} <ArrowRight size={13} />
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
                <div className="text-xl font-black text-white leading-none">{c.proof.years}</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.proof.yearsLabel}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 sm:border-x sm:border-white/10 sm:px-6">
              <Package size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">{c.proof.orders}</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.proof.ordersLabel}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">{c.proof.manual}</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.proof.manualLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHOOSE HOW YOU WANT TO BUILD LINKS */}
      <section id="products" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.products.sectionTitle}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">{c.products.sectionBody}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {linkProducts.map((p) => (
              <Link key={p.name} to={p.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <p.icon size={20} className="text-[#F97316]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{p.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{p.desc}</p>
                <div className="text-xl font-black text-[#F97316] mb-4">{p.price}</div>
                <div className="flex items-center gap-1.5 mb-5 text-sm">
                  <Check size={14} className="text-[#F97316] flex-shrink-0" />
                  <span className="text-gray-600"><span className="font-semibold">{c.labels.bestFor}</span> {p.best}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] transition-colors flex items-center gap-1.5">
                    {c.products.items[linkProducts.indexOf(p)].viewLabel} {p.name} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  {p.placementsLink && (
                    <span className="text-xs text-gray-400 hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      {c.products.items[linkProducts.indexOf(p)].placementsLabel} <ExternalLink size={11} />
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
          <div className="text-xs font-bold uppercase tracking-widest text-[#F97316] mb-3">{c.clients.badge}</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.clients.title}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">{c.clients.body}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
            {clientLogos.map((cl) => (
              <div key={cl.domain} className="flex items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-200">
                <img src={`https://www.google.com/s2/favicons?domain=${cl.domain}&sz=32`} alt={cl.name} width={20} height={20} className="w-5 h-5 object-contain flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-sm font-semibold text-gray-500 truncate">{cl.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. SEE THE LINKS BEFORE YOU BUY */}
      <section id="placements" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.placements.title}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">{c.placements.body}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === t.key ? 'bg-[#F97316] text-white border border-[#F97316]' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {tabPlacements.length === 0 ? (
              <div className="col-span-3 py-10 text-center"><p className="text-gray-400 text-sm">{c.placements.empty}</p></div>
            ) : tabPlacements.map((p) => (
              <PlacementCard key={p.id} p={p} />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to={tabCtaLink} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {tabCtaLabel} <ArrowRight size={14} />
            </Link>
            {totalActiveCount > 0 && (
              <span className="text-xs text-gray-400">{totalActiveCount}+ {c.placements.countLabel}</span>
            )}
          </div>
        </div>
      </section>

      {/* 6. REAL CAMPAIGNS. REAL OUTCOMES. */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.campaigns.title}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">{c.campaigns.body}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredCases.map((cs) => {
              const drStat = cs.stats.find((s) => s.label.toLowerCase().includes('dr'));
              const secondaryStat = cs.stats.find((s) => !s.label.toLowerCase().includes('dr') && !s.label.toLowerCase().includes('timeline'));
              return (
                <Link key={cs.slug} to={lp(`/case-studies/${cs.slug}`)} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F97316]">{cs.niche}</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">{cs.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{cs.service}</p>
                  <div className="mb-4">
                    <div className="text-4xl font-black leading-none text-[#F97316]">{cs.metric}</div>
                    <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-medium">{cs.metricSub}</div>
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
                    <span className="text-xs font-bold text-gray-700">{cs.period}</span>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F97316] flex items-center gap-1 transition-colors">
                      {c.campaigns.readLabel} <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link to={lp('/case-studies')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {c.campaigns.ctaLabel} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. NEED MORE THAN LINK BUILDING? */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.secondary.title}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">{c.secondary.body}</p>
          <div className="grid sm:grid-cols-3 gap-5">
            {secondaryServices.map((s) => (
              <Link key={s.label} to={s.href} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                <div className="text-2xl mb-3">{s.icon}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">{s.label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">{s.desc}</p>
                <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] flex items-center gap-1.5 transition-colors mt-auto">
                  {s.label.split(' & ')[0]} <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 8. QUESTIONS BEFORE YOU BUY */}
      <section id="faq" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.faq.title}</h2>
          <p className="text-gray-500 text-sm mb-8">{c.faq.body}</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              {c.faq.items.slice(0, Math.ceil(c.faq.items.length / 2)).map((faq, i) => (
                <FAQ key={i} faqs={[faq]} compact />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {c.faq.items.slice(Math.ceil(c.faq.items.length / 2)).map((faq, i) => (
                <FAQ key={i} faqs={[faq]} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{c.finalCta.title}</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">{c.finalCta.body}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={openLinkPlan} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20 flex items-center gap-2">
              {c.finalCta.ctaPrimary} <ArrowRight size={14} />
            </button>
            <button onClick={() => scrollToId('products')} className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200">
              {c.finalCta.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
    </div>
  );
}
