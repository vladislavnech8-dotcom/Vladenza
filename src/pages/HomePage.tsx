import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Check, Link2, FileText, MessagesSquare, Search, Cpu, MapPin, Gamepad2, Laptop, Car, Heart, Lock, Home, Linkedin, Building2, Trophy, Package, Sparkles, ShieldCheck, TrendingUp, Target } from 'lucide-react';
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

type TabKey = 'link-insertions' | 'guest-posts' | 'crowd-marketing';

const SERVICE_TYPE_MAP: Record<TabKey, PlacementServiceType> = {
  'link-insertions': 'niche_edit',
  'guest-posts': 'guest_post',
  'crowd-marketing': 'crowd_link',
};

const NICHE_COLORS: Record<string, { bg: string; text: string; icon: typeof Gamepad2 }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: Gamepad2 },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: Laptop },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', icon: Car },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', icon: Heart },
  gray: { bg: 'bg-gray-100', text: 'text-gray-600', icon: Lock },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', icon: Home },
};

const PROOF_ICONS = [Trophy, Package, TrendingUp, ShieldCheck];

export default function HomePage() {
  const { locale, localizePath: lp } = useLocale();
  const c = homePageContent[locale];
  const featuredCases = (locale === 'uk'
    ? cases.slice(0, 3).map(cs => {
        const tr = casesUk[cs.slug];
        return tr ? { ...cs, ...tr } : cs;
      })
    : cases.slice(0, 3)
  );
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('link-insertions');
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

  const tabs: { key: TabKey; label: string; icon: typeof Link2 }[] = [
    { key: 'link-insertions', label: c.coreServices.linkBuilding[1].name, icon: Link2 },
    { key: 'guest-posts', label: c.coreServices.linkBuilding[0].name, icon: FileText },
    { key: 'crowd-marketing', label: c.coreServices.linkBuilding[2].name, icon: MessagesSquare },
  ];

  const activeServiceType = SERVICE_TYPE_MAP[activeTab];
  const tabPlacements = homepagePlacements.filter((p) => p.service_type === activeServiceType).slice(0, 3);
  const totalActiveCount = homepagePlacements.length;

  const linkBuildingIcons = [FileText, Link2, MessagesSquare];

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openLinkPlan} />

      {/* 1. HERO */}
      <section className="relative overflow-hidden pt-[88px] pb-12 lg:pb-16">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        <div className="absolute pointer-events-none" style={{ right: '-5%', top: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-14">
          <div className="grid lg:grid-cols-[1fr_400px] gap-10 lg:gap-14 items-center">
            {/* Left: copy */}
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">{c.hero.badge}</p>
              <h1 className="text-[30px] md:text-4xl lg:text-[44px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
                {c.hero.h1}
              </h1>
              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-6 max-w-xl">{c.hero.body}</p>
              <div className="flex flex-wrap gap-3 mb-5">
                <button onClick={() => { scrollToId('core-services'); trackEvent('view_services'); }} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">
                  {c.hero.ctaPrimary} <ArrowDown size={14} />
                </button>
                <button onClick={openLinkPlan} className="border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">
                  {c.hero.ctaSecondary} <ArrowRight size={14} />
                </button>
              </div>
              <p className="text-gray-400 text-xs font-medium">{c.hero.trustLine}</p>
            </div>

            {/* Right: Search Visibility System visual */}
            <div className="hidden lg:block">
              <SearchVisibilityVisual locale={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PROOF STRIP */}
      <section className="bg-gray-950 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.proof.items.map((item, i) => {
              const Icon = PROOF_ICONS[i];
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#F97316]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-white leading-none">{item.value}</div>
                    <div className="text-[11px] text-gray-400 mt-1 leading-tight">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CLIENTS */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 text-center mb-8">{c.clients.title}</h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-5">
            {clientLogos.map((cl) => (
              <div key={cl.domain} className="flex items-center justify-center gap-2 opacity-40 hover:opacity-70 transition-opacity duration-200">
                <img src={`https://www.google.com/s2/favicons?domain=${cl.domain}&sz=32`} alt={cl.name} width={18} height={18} className="w-[18px] h-[18px] object-contain flex-shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-xs font-semibold text-gray-500 truncate">{cl.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CORE SERVICES */}
      <section id="core-services" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#F97316] mb-3">{c.coreServices.eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.coreServices.title}</h2>
            <p className="text-gray-500 text-sm leading-relaxed">{c.coreServices.body}</p>
          </div>

          {/* A. Link Building Services — 3 cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {c.coreServices.linkBuilding.map((s, i) => {
              const Icon = linkBuildingIcons[i];
              return (
                <Link key={s.name} to={lp(s.href)} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-[#F97316]" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{s.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <span className="text-sm font-bold text-gray-700">{s.price}</span>
                    <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] flex items-center gap-1 transition-colors">
                      <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* B. Local Link Building — wide card */}
          <Link to={lp(c.coreServices.localHref)} className="group block bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 mb-8">
            <div className="flex items-center gap-5">
              <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[#F97316]" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{c.coreServices.localTitle}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{c.coreServices.localDesc}</p>
              </div>
              <ArrowRight size={18} className="text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
          </Link>

          {/* C. SEO & AI Visibility — 2 cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-10">
            {c.coreServices.seoAi.map((s) => (
              <Link key={s.name} to={lp(s.href)} className={`group rounded-2xl p-6 hover:shadow-lg transition-all duration-300 flex flex-col ${s.dark ? 'bg-gray-950 border border-gray-800 hover:border-gray-700' : 'bg-white border border-gray-200 hover:border-[#F97316]/30 hover:shadow-gray-100'}`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.dark ? 'bg-white/5' : 'bg-orange-50'}`}>
                  {s.dark ? <Cpu size={20} className="text-[#F97316]" /> : <Search size={20} className="text-[#F97316]" />}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${s.dark ? 'text-white' : 'text-gray-900'}`}>{s.name}</h3>
                <p className={`text-sm leading-relaxed flex-1 ${s.dark ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</p>
                <div className="flex items-center gap-1 mt-4 pt-4 border-t border-gray-100/20">
                  <span className={`text-sm font-semibold flex items-center gap-1 ${s.dark ? 'text-[#F97316]' : 'text-[#F97316] group-hover:text-[#EA580C]'}`}>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* D. Niche Link Building Packages */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{c.coreServices.nicheTitle}</h3>
            <p className="text-gray-500 text-sm mb-6">{c.coreServices.nicheBody}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {c.coreServices.nichePackages.map((pkg) => {
              const colors = NICHE_COLORS[pkg.color] ?? NICHE_COLORS.gray;
              const Icon = colors.icon;
              return (
                <Link key={pkg.name} to={lp(pkg.href)} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200 flex flex-col">
                  <div className={`w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center mb-3`}>
                    <Icon size={16} className={colors.text} />
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{pkg.name}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-3">{pkg.desc}</p>
                  <span className="text-xs font-semibold text-[#F97316] flex items-center gap-1">
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>

          {/* E. Digital Marketing Services */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{c.coreServices.digitalTitle}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {c.coreServices.digitalServices.map((s, i) => {
              const Icon = i === 0 ? Linkedin : Building2;
              return (
                <Link key={s.name} to={lp(s.href)} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 mb-1.5">{s.name}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. REAL PLACEMENTS */}
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
            <Link to={lp('/placements')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {c.placements.ctaLabel} <ArrowRight size={14} />
            </Link>
            {totalActiveCount > 0 && (
              <span className="text-xs text-gray-400">{totalActiveCount}+ {c.placements.countLabel}</span>
            )}
          </div>
        </div>
      </section>

      {/* 6. CASE STUDIES */}
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
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F97316] mb-3">{cs.niche}</span>
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

      {/* 7. PROCESS */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.process.title}</h2>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-gray-200" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {c.process.steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-white border-2 border-[#F97316] flex items-center justify-center mb-3 relative z-10">
                    <span className="text-sm font-bold text-[#F97316]">{i + 1}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900">{step.title}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
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
            <button onClick={() => scrollToId('core-services')} className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200">
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

/* ─── Search Visibility System Visual ─────────────────────────── */

function SearchVisibilityVisual({ locale }: { locale: string }) {
  const uk = locale === 'uk';
  const center = uk ? 'Авторитет бренду' : 'Brand Authority';
  const nodes = uk
    ? ['Позиції в Google', 'Видимість в AI', 'Релевантні посилання', 'Цільовий трафік']
    : ['Google Rankings', 'AI Visibility', 'Relevant Backlinks', 'Qualified Traffic'];
  const nodeIcons = [TrendingUp, Cpu, Link2, Target];
  const positions = [
    { top: '5%', left: '50%', transform: 'translate(-50%, 0)' },
    { top: '50%', left: '95%', transform: 'translate(-100%, -50%)' },
    { top: '95%', left: '50%', transform: 'translate(-50%, -100%)' },
    { top: '50%', left: '5%', transform: 'translate(0, -50%)' },
  ];

  return (
    <div className="relative w-full h-[340px] flex items-center justify-center">
      {/* Background circle */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 340" fill="none">
        <circle cx="170" cy="170" r="140" stroke="#F97316" strokeWidth="1" strokeDasharray="4 6" opacity="0.2" />
        <circle cx="170" cy="170" r="100" stroke="#F97316" strokeWidth="1" strokeDasharray="2 4" opacity="0.15" />
        {/* Connecting lines */}
        {positions.map((pos, i) => {
          const x = parseFloat(pos.left) / 100 * 340;
          const y = parseFloat(pos.top) / 100 * 340;
          return (
            <line key={i} x1="170" y1="170" x2={x} y2={y} stroke="#F97316" strokeWidth="1" opacity="0.15" />
          );
        })}
      </svg>

      {/* Center node */}
      <div className="absolute z-10 w-28 h-28 rounded-full bg-gray-950 border-2 border-[#F97316] flex items-center justify-center text-center shadow-lg">
        <span className="text-xs font-bold text-white leading-tight px-2">{center}</span>
      </div>

      {/* Surrounding nodes */}
      {nodes.map((label, i) => {
        const Icon = nodeIcons[i];
        return (
          <div
            key={i}
            className="absolute z-10 flex flex-col items-center gap-1.5"
            style={positions[i]}
          >
            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center">
              <Icon size={16} className="text-[#F97316]" />
            </div>
            <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
