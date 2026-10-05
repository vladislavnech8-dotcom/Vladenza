import { useEffect, useState } from 'react';
import { ArrowRight, Check, Eye, Link2, Search, ClipboardCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LinkPlanModal from '../components/LinkPlanModal';
import FAQ from '../components/FAQ';
import ReviewsSection from '../components/ReviewsSection';
import PlacementCard from '../components/PlacementCard';
import VisualAsset from '../components/VisualAsset';
import { useSEO } from '../hooks/useSEO';
import { trackEvent } from '../lib/analytics';
import { fetchPlacements, type Placement, type PlacementServiceType } from '../data/placements';
import { cases, casesUk } from '../data/cases';
import { useLocale } from '../context/LocaleContext';
import { homePageContent } from '../lib/homeContent';

const serviceTypeMap: Record<string, PlacementServiceType> = { 'Guest Posts': 'guest_post', 'Гостьові публікації': 'guest_post', 'Link Insertions': 'niche_edit', 'Розміщення посилань': 'niche_edit', 'Crowd Marketing': 'crowd_link', 'Крауд-маркетинг': 'crowd_link' };
const processIcons = [Search, ClipboardCheck, Check, Link2, Eye];

function DecorativeChart({ color }: { color: string }) {
  return <svg viewBox="0 0 320 100" className="h-24 w-full" aria-hidden="true" preserveAspectRatio="none"><path d="M0 80 C35 76 43 70 70 72 S110 55 138 62 S176 40 202 46 S240 30 270 34 S300 18 320 20" fill="none" stroke={color} strokeWidth="3" strokeLinecap="square" /><path d="M0 96H320" stroke={color} strokeOpacity=".2" strokeWidth="2" /></svg>;
}



export default function HomePage() {
  const { locale, localizePath: lp } = useLocale();
  const c = homePageContent[locale];
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);
  const [activeType, setActiveType] = useState<PlacementServiceType>('guest_post');
  const [placements, setPlacements] = useState<Placement[]>([]);

  useSEO({ title: c.seo.title, description: c.seo.description, canonical: locale === 'uk' ? 'https://vladenza.com/uk/' : 'https://vladenza.com/', schema: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Vladenza', description: c.seo.description, url: 'https://vladenza.com', logo: 'https://vladenza.com/logo.svg' } });

  useEffect(() => { fetchPlacements({ status: 'active', homepage_featured: true }).then(setPlacements); }, []);
  const openLinkPlan = () => { trackEvent('get_link_plan'); setLinkPlanOpen(true); };
  const featuredCases = (locale === 'uk' ? cases.slice(0, 3).map((item) => ({ ...item, ...(casesUk[item.slug] ?? {}) })) : cases.slice(0, 3));
  const tabs = c.services.items.slice(0, 3).map((item) => ({ label: item.name, type: serviceTypeMap[item.name] }));
  const visiblePlacements = placements.filter((item) => item.service_type === activeType).slice(0, 3);

  return <div className="min-h-screen bg-cream text-ink">
    <Navigation onOpenModal={openLinkPlan} />

    <main>
      <section className="relative overflow-hidden bg-navy text-white lg:min-h-[calc(100svh-104px)]">
        <img src="/assets/visuals/vladenzaheroimage.png" alt="" width="1440" height="1024" fetchPriority="high" className="absolute inset-0 block h-full w-full object-cover object-[72%_72%] brightness-[0.55] lg:object-[72%_68%] lg:brightness-[0.72]" />
        <div className="paper-grain absolute inset-0 opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/95 via-navy/80 to-navy/45 lg:hidden" />
        <div className="absolute inset-0 hidden lg:block" style={{ background: 'radial-gradient(ellipse 65% 60% at 38% 44%, rgba(7,16,43,0.78) 0%, rgba(7,16,43,0.58) 34%, rgba(7,16,43,0.36) 58%, rgba(7,16,43,0.14) 78%, transparent 100%)' }} />
        <div className="relative z-10 mx-auto flex min-h-0 w-full min-w-0 box-border flex-col lg:min-h-[calc(100svh-104px)] items-center justify-center px-5 py-24 text-center sm:px-8 lg:px-16 lg:py-20">
          <div className="flex w-full min-w-0 max-w-[1500px] flex-col items-center">
            <h1 className="w-full min-w-0 font-display text-[clamp(36px,9vw,64px)] font-bold leading-[1.06] tracking-[-.035em] sm:text-[clamp(3.5rem,6vw,7.75rem)] sm:leading-[.94] sm:tracking-[-.055em]" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.22)' }}>
              <span className="block w-full text-cream">{c.hero.h1First}</span>
              <span className="mt-2 block w-full text-signal sm:mt-1">{c.hero.h1Second}</span>
            </h1>
            <div className="mt-8 flex w-full max-w-[360px] flex-col items-center gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <Link to={lp('/pricing')} className="editorial-focus inline-flex min-h-[54px] w-full items-center justify-center gap-2 bg-signal px-6 text-base font-bold text-white transition-colors hover:bg-[#EA580C] sm:w-auto sm:min-w-[170px] lg:min-h-[56px] lg:px-8">{c.hero.pricing}<ArrowRight size={18} /></Link>
              <Link to={lp('/placements')} className="editorial-focus inline-flex min-h-[54px] w-full items-center justify-center gap-2 bg-[#FFFDF8] px-6 text-base font-bold text-navy transition-colors hover:bg-white sm:w-auto sm:min-w-[230px] lg:min-h-[56px] lg:px-8">{c.hero.placements}<ArrowRight size={18} /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-white" aria-label="Verified proof">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 divide-y divide-ink/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

            {/* Experience */}
            <div className="flex min-h-[120px] flex-col justify-center py-7 sm:py-0 sm:pr-8 lg:pr-12">
              <p className="font-display text-[32px] font-bold leading-none tracking-tight text-ink">8+</p>
              <p className="mt-2 text-sm leading-snug text-ink/55">{locale === 'uk' ? 'Років досвіду в лінкбілдингу' : 'Years of link-building experience'}</p>
            </div>

            {/* Fiverr */}
            <a
              href="https://www.fiverr.com/fittranslate?public_mode=true"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-focus group flex min-h-[120px] flex-col justify-center py-7 transition-colors hover:text-signal sm:px-8 sm:py-0 lg:px-12"
            >
              <p className="font-display text-[32px] font-bold leading-none tracking-tight text-ink group-hover:text-signal">4.9 · 1,100+</p>
              <p className="mt-2 text-sm leading-snug text-ink/55">{locale === 'uk' ? 'Рейтинг і відгуки на Fiverr' : 'Rating and reviews on Fiverr'}</p>
            </a>

            {/* Clutch */}
            <a
              href="https://clutch.co/profile/vladenza"
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-focus group flex min-h-[120px] flex-col justify-center py-7 transition-colors sm:pl-8 sm:py-0 lg:pl-12"
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-signal">Recognized by Clutch</p>
              <p className="font-display text-[22px] font-bold leading-tight tracking-tight text-ink group-hover:text-signal">Top Company · Ukraine · 2026</p>
              <p className="mt-2 text-sm font-bold text-signal">{locale === 'uk' ? 'Переглянути профіль →' : 'View profile →'}</p>
            </a>

          </div>
        </div>
      </section>

      <section className="bg-cream py-[88px] md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="max-w-[620px]"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">01 / Services</p><h2 className="font-display max-w-[580px] text-[clamp(2.75rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em]">{c.services.heading}</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{c.services.items.map((item, index) => <Link key={item.name} to={lp(item.href)} className="group editorial-focus border-2 border-ink bg-white transition-transform hover:-translate-y-2"><VisualAsset src={item.visual} alt={item.alt} width={640} height={480} tone="cream" className="border-0 border-b border-ink" /><div className="flex min-h-64 flex-col p-6"><span className="text-xs font-bold text-signal">0{index + 1}</span><h3 className="mt-4 font-display text-[25px] font-bold tracking-tight">{item.name}</h3><p className="mt-3 text-[15px] leading-6 text-ink/70">{item.description}</p><div className="mt-auto flex items-end justify-between gap-3 border-t-2 border-ink/10 pt-5"><span className="text-sm font-bold">{item.price}</span><ArrowRight size={18} className="text-signal transition-transform group-hover:translate-x-1" /></div></div></Link>)}</div>
        </div>
      </section>

      <section id="placements" className="scroll-mt-20 bg-navy py-[88px] text-white md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">02 / Proof</p><h2 className="font-display max-w-[720px] text-[clamp(2.75rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em]">{c.placements.heading}</h2><p className="mt-5 max-w-xl text-[17px] leading-[1.6] text-white/75">{c.placements.body}</p></div><Link to={lp('/placements')} className="editorial-focus inline-flex min-h-12 shrink-0 items-center gap-2 border-2 border-signal px-5 text-sm font-bold text-white hover:bg-signal">{c.placements.ctaLabel}<ArrowRight size={16} /></Link></div>
          <div className="mt-10 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.label} onClick={() => setActiveType(tab.type)} className={`editorial-focus min-h-11 border-2 px-4 text-sm font-bold transition-colors ${activeType === tab.type ? 'border-signal bg-signal text-white' : 'border-white/30 text-white/70 hover:border-white'}`}>{tab.label}</button>)}</div>
          <div className="mt-6 grid items-stretch gap-6 md:grid-cols-3">{visiblePlacements.length > 0 ? visiblePlacements.map((placement) => <PlacementCard key={placement.id} p={placement} />) : <div className="border-2 border-white/20 px-6 py-12 text-sm text-white/60 md:col-span-3">{c.placements.empty}</div>}</div><p className="mt-5 text-xs text-white/45">{c.placements.note}</p>
        </div>
      </section>

      <section className="bg-white py-[88px] md:py-28"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">03 / Process</p><h2 className="font-display mx-auto max-w-[760px] text-[clamp(2.75rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em]">{c.process.heading}</h2></div><div className="relative mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5"><div className="absolute left-[8%] right-[8%] top-10 hidden h-px bg-ink/20 lg:block" />{c.process.steps.map((step, index) => { const Icon = processIcons[index]; return <div key={step.title} className="relative z-10 flex min-h-[258px] flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><span className="flex h-12 w-16 items-center justify-center border-2 border-ink bg-signal font-display text-2xl font-bold text-white shadow-[3px_3px_0_#111111]">0{index + 1}</span><Icon size={19} /></div><h3 className="mt-8 font-display text-[22px] font-bold">{step.title}</h3><p className="mt-3 text-[15px] leading-6 text-ink/70">{step.desc}</p></div>; })}</div></div></section>

      <section className="bg-[#ebe5d8] py-[88px] md:py-28"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">04 / Case studies</p><h2 className="font-display max-w-[760px] text-[clamp(2.75rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em]">{c.caseStudies.heading}</h2><p className="mt-5 max-w-xl text-sm leading-6 text-ink/65">{c.caseStudies.body}</p></div><Link to={lp('/case-studies')} className="editorial-focus inline-flex min-h-12 items-center gap-2 border-2 border-ink px-5 text-sm font-bold hover:bg-ink hover:text-white">{c.caseStudies.ctaLabel}<ArrowRight size={16} /></Link></div><div className="mt-8 grid items-stretch gap-5 lg:grid-cols-3">{featuredCases.map((item) => <Link key={item.slug} to={lp(`/case-studies/${item.slug}`)} className="group editorial-focus border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-2"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.12em] text-signal">Case study · {item.niche}</span><ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></div><div className="mt-8"><DecorativeChart color="#FF5A1F" /><div className="mt-4 text-[clamp(2.75rem,4vw,3.5rem)] font-display font-bold tracking-[-.045em] text-signal">{item.metric}</div><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-ink/50">{item.metricSub}</p></div><h3 className="mt-7 font-display text-2xl font-bold leading-tight">{item.title}</h3><p className="mt-3 line-clamp-4 text-[15px] leading-6 text-ink/65">{item.result}</p><span className="mt-8 inline-flex items-center gap-2 border-t-2 border-ink/10 pt-4 text-sm font-bold text-signal">{c.caseStudies.readLabel}<ArrowRight size={14} /></span></Link>)}</div></div></section>

      <ReviewsSection />

      <section id="faq" className="scroll-mt-20 bg-[#D94712] py-[88px] md:py-28"><div className="mx-auto max-w-[1120px] px-5 sm:px-8"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-white/75">05 / FAQ</p><h2 className="font-display max-w-[620px] text-[clamp(2.75rem,3.6vw,4.25rem)] font-bold leading-[.96] tracking-[-.045em] text-[#FFFDF8]">{c.faq.heading}</h2></div><div className="mt-8 grid gap-0 md:grid-cols-2"><FAQ faqs={c.faq.items.slice(0, 3)} compact orange /><FAQ faqs={c.faq.items.slice(3)} compact orange /></div></div></section>
    </main>
    <Footer />
    <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
  </div>;
}
