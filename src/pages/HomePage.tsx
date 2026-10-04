import { useEffect, useState } from 'react';
import { ArrowRight, Check, Eye, Link2, Search, ClipboardCheck, ExternalLink } from 'lucide-react';
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
      <section className="relative overflow-hidden bg-navy pt-24 text-white md:pt-28">
        <div className="paper-grain absolute inset-0 opacity-40" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-0 lg:pb-0">
          <div className="relative z-10 max-w-3xl py-12 lg:py-24">
            <h1 className="font-display text-[clamp(3.2rem,7.5vw,7.4rem)] font-bold leading-[.88] tracking-[-.065em]"><span className="block text-cream">{c.hero.h1First}</span><span className="mt-2 block text-signal">{c.hero.h1Second}</span></h1>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/75 md:text-lg">{c.hero.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={lp('/pricing')} className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 bg-signal px-6 text-sm font-bold text-white transition-transform hover:-translate-y-1">{c.hero.pricing}<ArrowRight size={16} /></Link>
              <Link to={lp('/placements')} className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 border-2 border-white/50 px-6 text-sm font-bold text-white transition-colors hover:border-white">{c.hero.placements}<ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="relative -mx-5 sm:-mx-8 lg:mx-0 lg:self-stretch">
            <VisualAsset src="/assets/visuals/vladenzaheroimage.png" alt="Marble hand pressing an orange keyboard key" width={1440} height={1024} priority tone="navy" className="border-0 lg:absolute lg:inset-y-0 lg:right-[-10vw] lg:w-[48vw] lg:max-w-none" objectPosition="center" />
          </div>
        </div>
      </section>

      <section className="border-b-2 border-ink/10 bg-white" aria-label="Verified proof">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 md:grid-cols-3 md:items-center">
          <p className="text-xs font-bold uppercase tracking-[.12em] text-ink/55">{c.proof.label}</p>
          <a className="editorial-focus text-sm font-bold text-ink transition-colors hover:text-signal" href="https://www.fiverr.com/fittranslate?public_mode=true" target="_blank" rel="noopener noreferrer">{c.proof.fiverr} <ExternalLink size={13} className="ml-1 inline" /></a>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold"><span>{c.proof.experience}</span><a className="editorial-focus text-signal" href="https://clutch.co/profile/vladenza" target="_blank" rel="noopener noreferrer">{c.proof.clutch} <ExternalLink size={13} className="ml-1 inline" /></a></div>
        </div>
      </section>

      <section className="bg-cream py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">01 / Services</p><h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em]">{c.services.heading}</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{c.services.items.map((item, index) => <Link key={item.name} to={lp(item.href)} className="group editorial-focus border-2 border-ink bg-white transition-transform hover:-translate-y-2"><VisualAsset src={item.visual} alt={item.alt} width={640} height={420} tone="cream" className="border-0 border-b-2 border-ink" /><div className="flex min-h-64 flex-col p-5"><span className="text-xs font-bold text-signal">0{index + 1}</span><h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{item.name}</h3><p className="mt-3 text-sm leading-6 text-ink/65">{item.description}</p><div className="mt-auto flex items-end justify-between gap-3 border-t-2 border-ink/10 pt-5"><span className="text-sm font-bold">{item.price}</span><ArrowRight size={18} className="text-signal transition-transform group-hover:translate-x-1" /></div></div></Link>)}</div>
        </div>
      </section>

      <section id="placements" className="scroll-mt-20 bg-navy py-20 text-white md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">02 / Proof</p><h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em]">{c.placements.heading}</h2><p className="mt-5 max-w-xl text-sm leading-6 text-white/65">{c.placements.body}</p></div><Link to={lp('/placements')} className="editorial-focus inline-flex min-h-12 items-center gap-2 border-2 border-signal px-5 text-sm font-bold text-white hover:bg-signal">{c.placements.ctaLabel}<ArrowRight size={16} /></Link></div>
          <div className="mt-10 flex flex-wrap gap-2">{tabs.map((tab) => <button key={tab.label} onClick={() => setActiveType(tab.type)} className={`editorial-focus min-h-11 border-2 px-4 text-sm font-bold transition-colors ${activeType === tab.type ? 'border-signal bg-signal text-white' : 'border-white/30 text-white/70 hover:border-white'}`}>{tab.label}</button>)}</div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">{visiblePlacements.length > 0 ? visiblePlacements.map((placement) => <PlacementCard key={placement.id} p={placement} />) : <div className="border-2 border-white/20 px-6 py-12 text-sm text-white/60 md:col-span-3">{c.placements.empty}</div>}</div><p className="mt-5 text-xs text-white/45">{c.placements.note}</p>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28"><div className="mx-auto max-w-6xl px-5 sm:px-8"><div className="text-center"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">03 / Process</p><h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em]">{c.process.heading}</h2></div><div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{c.process.steps.map((step, index) => { const Icon = processIcons[index]; return <div key={step.title} className="border-2 border-ink p-5 transition-transform hover:-translate-y-1"><div className="flex items-center justify-between"><span className="font-display text-4xl font-bold text-signal">0{index + 1}</span><Icon size={19} /></div><h3 className="mt-8 font-display text-xl font-bold">{step.title}</h3><p className="mt-3 text-sm leading-6 text-ink/60">{step.desc}</p><div className="mt-8 inline-flex h-10 min-w-20 items-center justify-center border-2 border-ink bg-cream px-3 text-xs font-bold transition-transform hover:translate-y-1">{step.title}</div></div>; })}</div></div></section>

      <section className="bg-[#ebe5d8] py-20 md:py-28"><div className="mx-auto max-w-7xl px-5 sm:px-8"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">04 / Case studies</p><h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em]">{c.caseStudies.heading}</h2><p className="mt-5 max-w-xl text-sm leading-6 text-ink/65">{c.caseStudies.body}</p></div><Link to={lp('/case-studies')} className="editorial-focus inline-flex min-h-12 items-center gap-2 border-2 border-ink px-5 text-sm font-bold hover:bg-ink hover:text-white">{c.caseStudies.ctaLabel}<ArrowRight size={16} /></Link></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{featuredCases.map((item) => <Link key={item.slug} to={lp(`/case-studies/${item.slug}`)} className="group editorial-focus border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-2"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[.12em] text-signal">Case study · {item.niche}</span><ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></div><div className="mt-10"><DecorativeChart color={item.color} /><div className="mt-4 text-5xl font-display font-bold tracking-[-.06em]" style={{ color: item.color }}>{item.metric}</div><p className="mt-1 text-xs font-bold uppercase tracking-[.1em] text-ink/50">{item.metricSub}</p></div><h3 className="mt-7 font-display text-2xl font-bold leading-tight">{item.title}</h3><p className="mt-3 text-sm leading-6 text-ink/60">{item.result}</p><span className="mt-8 inline-flex items-center gap-2 border-t-2 border-ink/10 pt-4 text-sm font-bold text-signal">{c.caseStudies.readLabel}<ArrowRight size={14} /></span></Link>)}</div></div></section>

      <ReviewsSection />

      <section id="faq" className="scroll-mt-20 bg-cream py-20 md:py-28"><div className="mx-auto max-w-5xl px-5 sm:px-8"><div className="flex items-end justify-between gap-6"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-signal">05 / FAQ</p><h2 className="font-display text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[.92] tracking-[-.05em]">{c.faq.heading}</h2></div><div className="hidden h-16 w-16 rotate-6 border-2 border-ink bg-signal sm:block" /></div><div className="mt-10 grid gap-3 md:grid-cols-2"><FAQ faqs={c.faq.items.slice(0, 3)} compact /><FAQ faqs={c.faq.items.slice(3)} compact /></div></div></section>

      <section className="bg-signal py-20 md:py-28"><div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-8 px-5 sm:px-8 md:flex-row md:items-end"><div className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-white/65">06 / Next step</p><h2 className="font-display text-[clamp(2.6rem,6vw,6rem)] font-bold leading-[.88] tracking-[-.06em] text-white">{c.finalCta.heading}</h2><p className="mt-6 max-w-xl text-base leading-7 text-white/80">{c.finalCta.body}</p></div><div className="flex shrink-0 flex-col items-start gap-3"><button onClick={openLinkPlan} className="editorial-focus inline-flex min-h-14 items-center gap-2 border-2 border-ink bg-ink px-6 text-sm font-bold text-white transition-transform hover:-translate-y-1">{c.finalCta.cta}<ArrowRight size={17} /></button><span className="text-xs font-semibold text-white/70">{c.finalCta.reassurance}</span></div></div></section>
    </main>
    <Footer />
    <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
  </div>;
}
