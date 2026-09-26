import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Check, X, Link2, FileText, MessagesSquare, Search, ClipboardCheck, Target, Eye, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LinkPlanModal from '../components/LinkPlanModal';
import FAQ from '../components/FAQ';
import { useSEO } from '../hooks/useSEO';
import { trackEvent } from '../lib/analytics';
import { fetchPlacements, type Placement, type PlacementServiceType } from '../data/placements';
import { cases, casesUk } from '../data/cases';
import PlacementCard from '../components/PlacementCard';
import { useLocale } from '../context/LocaleContext';
import { homePageContent } from '../lib/homeContent';

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

type TabKey = 'guest-posts' | 'link-insertions' | 'crowd-marketing';

const SERVICE_TYPE_MAP: Record<TabKey, PlacementServiceType> = {
  'link-insertions': 'niche_edit',
  'guest-posts': 'guest_post',
  'crowd-marketing': 'crowd_link',
};

const PROCESS_ICONS = [Search, ClipboardCheck, Check, Target, Eye];

export default function HomePage() {
  const { locale, localizePath: lp } = useLocale();
  const c = homePageContent[locale];
  const featuredCases = (locale === 'uk'
    ? cases.slice(0, 3).map(cs => { const tr = casesUk[cs.slug]; return tr ? { ...cs, ...tr } : cs; })
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
      '@context': 'https://schema.org', '@type': 'Organization',
      name: 'Vladenza', description: c.seo.description, url: 'https://vladenza.com',
      logo: 'https://vladenza.com/logo.svg',
    },
  });

  useEffect(() => { fetchPlacements({ status: 'active', homepage_featured: true }).then(setHomepagePlacements); }, []);

  const openLinkPlan = () => { trackEvent('get_link_plan'); setLinkPlanOpen(true); };

  const tabs: { key: TabKey; label: string; icon: typeof Link2 }[] = [
    { key: 'guest-posts', label: c.placementTypes.items[0].name, icon: FileText },
    { key: 'link-insertions', label: c.placementTypes.items[1].name, icon: Link2 },
    { key: 'crowd-marketing', label: c.placementTypes.items[2].name, icon: MessagesSquare },
  ];
  const activeServiceType = SERVICE_TYPE_MAP[activeTab];
  const tabPlacements = homepagePlacements.filter(p => p.service_type === activeServiceType).slice(0, 3);

  const placementIcons = [FileText, Link2, MessagesSquare];

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={openLinkPlan} />

      {/* 1. HERO */}
      <section className="relative overflow-hidden pt-[72px] pb-12 lg:pb-16">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        <div className="absolute pointer-events-none" style={{ right: '-5%', top: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 lg:pt-14">
          <div className="grid lg:grid-cols-[1fr_380px] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">{c.hero.eyebrow}</p>
              <h1 className="text-[30px] md:text-4xl lg:text-[42px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-5 max-w-2xl">{c.hero.h1}</h1>
              <p className="text-gray-600 text-[15px] md:text-base leading-relaxed mb-6 max-w-xl">{c.hero.body}</p>
              <div className="flex flex-wrap gap-3 mb-5">
                <button onClick={openLinkPlan} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">{c.hero.ctaPrimary} <ArrowRight size={14} /></button>
                <button onClick={() => scrollToId('placements')} className="border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50 flex items-center gap-2">{c.hero.ctaSecondary} <ArrowDown size={14} /></button>
              </div>
            </div>
            <div className="hidden lg:block"><LinkBuildingVisual /></div>
          </div>
        </div>
      </section>

      {/* 2. PROOF STRIP */}
      <section className="bg-gray-950 py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.proof.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  {i === 0 && <TrendingUp size={18} className="text-[#F97316]" />}
                  {i === 1 && <Check size={18} className="text-[#F97316]" />}
                  {i === 2 && <Search size={18} className="text-[#F97316]" />}
                  {i === 3 && <Eye size={18} className="text-[#F97316]" />}
                </div>
                <div>
                  <div className="text-xl font-black text-white leading-none">{item.value}</div>
                  <div className="text-[11px] text-gray-400 mt-1 leading-tight">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TWO WAYS TO WORK */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.twoWays.heading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-8 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{c.twoWays.individual.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed mb-5">{c.twoWays.individual.body}</p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {c.twoWays.individual.points.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700"><Check size={15} className="text-[#F97316] flex-shrink-0" />{p}</li>
                ))}
              </ul>
              <Link to={lp('/placements')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">{c.twoWays.individual.cta} <ArrowRight size={14} /></Link>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 flex flex-col" id="managed-campaigns">
              <h3 className="text-xl font-bold text-white mb-3">{c.twoWays.managed.title}</h3>
              <p className="text-gray-400 text-base leading-relaxed mb-5">{c.twoWays.managed.body}</p>
              <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                {c.twoWays.managed.points.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-300"><Check size={15} className="text-[#F97316] flex-shrink-0" />{p}</li>
                ))}
              </ul>
              <button onClick={openLinkPlan} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">{c.twoWays.managed.cta} <ArrowRight size={14} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PLACEMENT TYPES */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.placementTypes.heading}</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {c.placementTypes.items.map((item, i) => {
              const Icon = placementIcons[i];
              return (
                <Link key={item.name} to={lp(item.href)} className="group bg-white border border-gray-200 rounded-2xl p-7 hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center mb-4"><Icon size={20} className="text-[#F97316]" /></div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{item.desc}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-gray-400 block mb-1">{locale === 'uk' ? 'Найкраще для' : 'Best suited to'}</span>
                    <span className="text-sm text-gray-700">{item.bestFor}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.process.heading}</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-px bg-gray-200" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
              {c.process.steps.map((step, i) => {
                const Icon = PROCESS_ICONS[i];
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[#F97316] flex items-center justify-center mb-3 relative z-10"><Icon size={16} className="text-[#F97316]" /></div>
                    <h4 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 6. REAL PLACEMENTS */}
      <section id="placements" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.placements.heading}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">{c.placements.body}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === t.key ? 'bg-[#F97316] text-white border border-[#F97316]' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            {tabPlacements.length === 0 ? (
              <div className="col-span-3 py-10 text-center"><p className="text-gray-400 text-sm">{c.placements.empty}</p></div>
            ) : tabPlacements.map(p => <PlacementCard key={p.id} p={p} />)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Link to={lp('/placements')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">{c.placements.ctaLabel} <ArrowRight size={14} /></Link>
          </div>
          <p className="text-xs text-gray-400 mt-4">{c.placements.note}</p>
        </div>
      </section>

      {/* 7. CASE STUDIES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.caseStudies.heading}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-lg">{c.caseStudies.body}</p>
          <div className="grid md:grid-cols-3 gap-5">
            {featuredCases.map(cs => {
              const drStat = cs.stats.find(s => s.label.toLowerCase().includes('dr'));
              const secondaryStat = cs.stats.find(s => !s.label.toLowerCase().includes('dr') && !s.label.toLowerCase().includes('timeline'));
              return (
                <Link key={cs.slug} to={lp(`/case-studies/${cs.slug}`)} className="group bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F97316] mb-3">{cs.niche}</span>
                  <h3 className="text-[15px] font-bold text-gray-900 leading-snug mb-2">{cs.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{cs.service}</p>
                  <div className="mb-4">
                    <div className="text-4xl font-black leading-none text-[#F97316]">{cs.metric}</div>
                    <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-medium">{cs.metricSub}</div>
                  </div>
                  {secondaryStat && <div className="flex items-center gap-2 mb-3 text-sm bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400 text-xs">{secondaryStat.label}:</span><span className="font-bold text-gray-800 text-sm">{secondaryStat.value}</span></div>}
                  {drStat && <div className="flex items-center gap-2 mb-4 text-sm bg-gray-50 rounded-lg px-3 py-2"><span className="text-gray-400 text-xs">{drStat.label}:</span><span className="font-bold text-gray-800 text-sm">{drStat.value}</span></div>}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <span className="text-xs font-bold text-gray-700">{cs.period}</span>
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-[#F97316] flex items-center gap-1 transition-colors">{c.caseStudies.readLabel} <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8"><Link to={lp('/case-studies')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">{c.caseStudies.ctaLabel} <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      {/* 8. PRICING */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.pricing.heading}</h2>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {c.pricing.items.map((item, i) => (
              <div key={item.name} className={`flex items-center justify-between px-6 py-5 ${i !== c.pricing.items.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div>
                  <span className="text-sm font-bold text-gray-900">{item.name}</span>
                  {item.coverage && <span className="text-xs text-gray-400 block mt-0.5">{item.coverage}</span>}
                </div>
                <span className="text-sm font-bold text-[#F97316]">{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FIT / NOT A FIT */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.fit.heading}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50/50 border border-green-100 rounded-2xl p-7">
              <h3 className="text-sm font-bold text-green-700 uppercase tracking-wide mb-4">{c.fit.goodFit}</h3>
              <ul className="flex flex-col gap-3">
                {c.fit.goodItems.map((item, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"><Check size={15} className="text-green-600 flex-shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </div>
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-7">
              <h3 className="text-sm font-bold text-red-700 uppercase tracking-wide mb-4">{c.fit.notFit}</h3>
              <ul className="flex flex-col gap-3">
                {c.fit.notItems.map((item, i) => <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed"><X size={15} className="text-red-500 flex-shrink-0 mt-0.5" />{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">{c.faq.heading}</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">{c.faq.items.slice(0, Math.ceil(c.faq.items.length / 2)).map((faq, i) => <FAQ key={i} faqs={[faq]} compact />)}</div>
            <div className="flex flex-col gap-2">{c.faq.items.slice(Math.ceil(c.faq.items.length / 2)).map((faq, i) => <FAQ key={i} faqs={[faq]} compact />)}</div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{c.finalCta.heading}</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">{c.finalCta.body}</p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <button onClick={openLinkPlan} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20 flex items-center gap-2">{c.finalCta.ctaPrimary} <ArrowRight size={14} /></button>
            <button onClick={() => scrollToId('placements')} className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200">{c.finalCta.ctaSecondary}</button>
          </div>
          <p className="text-gray-500 text-xs">{c.finalCta.reassurance}</p>
        </div>
      </section>

      <Footer />
      <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
    </div>
  );
}

/* ─── Link Building Visual ─────────────────────────────────────── */

function LinkBuildingVisual() {
  const steps = [
    { icon: Search, label: 'Review', color: 'text-blue-600 bg-blue-50' },
    { icon: ClipboardCheck, label: 'Plan', color: 'text-[#F97316] bg-orange-50' },
    { icon: Target, label: 'Approve', color: 'text-green-600 bg-green-50' },
    { icon: Link2, label: 'Place', color: 'text-[#F97316] bg-orange-50' },
    { icon: Eye, label: 'Monitor', color: 'text-purple-600 bg-purple-50' },
  ];
  return (
    <div className="relative w-full h-[340px] flex flex-col items-center justify-center gap-3">
      <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center"><Link2 size={14} className="text-[#F97316]" /></div>
            <span className="text-sm font-bold text-gray-900">Link Building Flow</span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Manual</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center`}><s.icon size={15} /></div>
              <span className="text-[10px] font-semibold text-gray-600">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">DR 40+ · 1K–20K traffic</span>
            <span className="text-green-600 font-semibold flex items-center gap-1"><Check size={11} /> Approved</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-950 rounded-xl p-4 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><TrendingUp size={14} className="text-[#F97316]" /></div>
        <div className="flex-1">
          <div className="text-xs font-bold text-white">Link Care Monitoring</div>
          <div className="text-[10px] text-gray-400 mt-0.5">Scheduled checks · Replacement coverage</div>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-green-500 font-semibold">Live</span>
        </div>
      </div>
    </div>
  );
}
