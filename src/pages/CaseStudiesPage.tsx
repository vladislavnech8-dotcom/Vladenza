import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import { cases as staticCases, casesUk } from '../data/cases';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

type CasePreview = {
  slug: string;
  title: string;
  niche: string;
  service: string;
  period: string;
  metric: string;
  metric_sub: string;
  color: string;
  challenge: string;
};

function staticPreviews(): CasePreview[] {
  return staticCases.map((item) => ({ slug: item.slug, title: item.title, niche: item.niche, service: item.service, period: item.period, metric: item.metric, metric_sub: item.metricSub, color: item.color, challenge: item.challenge }));
}

export default function CaseStudiesPage() {
  const { locale, localizePath: lp } = useLocale();
  const uk = locale === 'uk';
  const [cases, setCases] = useState<CasePreview[]>([]);
  const [activeNiche, setActiveNiche] = useState('All');

  useSEO({
    title: uk ? 'SEO-кейси — реальні результати лінкбілдингу | Vladenza' : 'SEO Case Studies — Real Results from Link Building Campaigns | Vladenza',
    description: uk ? 'Реальні кейси клієнтів Vladenza з перевіреними метриками, тактиками та результатами.' : 'Real Vladenza client case studies with documented metrics, tactics and outcomes.',
    canonical: `https://vladenza.com${lp('/case-studies')}`,
    schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', inLanguage: uk ? 'uk' : 'en', name: uk ? 'SEO-кейси Vladenza' : 'Vladenza SEO Case Studies', url: `https://vladenza.com${lp('/case-studies')}` },
  });

  useEffect(() => {
    let active = true;
    supabase.from('case_studies').select('slug,title,niche,service,period,metric,metric_sub,color,challenge').eq('published', true).order('created_at', { ascending: false }).then(({ data }) => {
      if (!active) return;
      const dbCases = (data as CasePreview[] | null) ?? [];
      setCases(dbCases.length > 0 ? dbCases : staticPreviews());
    });
    return () => { active = false; };
  }, []);

  const localizedCases = useMemo(() => cases.map((item) => {
    const tr = uk ? casesUk[item.slug] : undefined;
    return tr ? { ...item, title: tr.title ?? item.title, niche: tr.niche ?? item.niche, service: tr.service ?? item.service, period: tr.period ?? item.period, metric_sub: tr.metricSub ?? item.metric_sub, challenge: tr.challenge ?? item.challenge } : item;
  }), [cases, uk]);
  const niches = ['All', ...Array.from(new Set(localizedCases.map((item) => item.niche).filter(Boolean)))];
  const filtered = activeNiche === 'All' ? localizedCases : localizedCases.filter((item) => item.niche === activeNiche);

  return (
    <ServicePageLayout>
      <main className="bg-cream text-ink">
        <section className="bg-navy py-16 text-white md:py-24"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">{uk ? 'КЕЙСИ' : 'CASE STUDIES'}</p><h1 className="max-w-4xl font-display text-[clamp(3rem,6vw,6rem)] font-bold leading-[.92] tracking-[-.05em] text-cream">{uk ? <>Реальні кампанії.<br /><span className="text-signal">Підтверджені результати.</span></> : <>Real campaigns.<br /><span className="text-signal">Documented results.</span></>}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{uk ? 'Кожен кейс — реальний клієнт, фактичні показники та конкретні тактики, які дали результат.' : 'Every case is a real client, documented metrics and the specific tactics used to get there.'}</p></div></section>
        <section id="cases" className="scroll-mt-20 bg-cream py-12 md:py-16"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="mb-8 flex flex-wrap gap-2">{niches.map((niche) => <button key={niche} type="button" onClick={() => setActiveNiche(niche)} className={`editorial-focus min-h-10 border-2 px-4 text-xs font-bold transition-colors ${activeNiche === niche ? 'border-signal bg-signal text-white' : 'border-ink/20 bg-white text-ink/60 hover:border-ink hover:text-ink'}`}>{niche === 'All' ? (uk ? 'Усі' : 'All') : niche}{niche !== 'All' && <span className="ml-1.5 text-ink/40">{localizedCases.filter((item) => item.niche === niche).length}</span>}</button>)}</div>{filtered.length === 0 ? <div className="border-2 border-ink bg-white px-6 py-20 text-center text-sm text-ink/55">{uk ? 'Кейсів не знайдено.' : 'No case studies found.'}</div> : <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <Link key={item.slug} to={lp(`/case-studies/${item.slug}`)} className="group editorial-focus flex min-h-[390px] flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.15em] text-signal">{item.niche}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.1em] text-ink/45">{item.service}</p></div><ArrowUpRight size={18} className="shrink-0 text-ink/35 transition-colors group-hover:text-signal" /></div><div className="mt-10 border-y-2 border-ink/10 py-5"><p className="font-display text-[clamp(2.75rem,5vw,4rem)] font-bold leading-none" style={{ color: item.color }}>{item.metric}</p><p className="mt-2 text-xs font-bold uppercase tracking-[.12em] text-ink/50">{item.metric_sub}</p></div><h2 className="mt-6 font-display text-2xl font-bold leading-tight">{item.title}</h2><p className="mt-3 line-clamp-3 text-[15px] leading-6 text-ink/65">{item.challenge}</p><div className="mt-auto flex items-center justify-between border-t-2 border-ink/10 pt-4"><span className="text-xs font-bold uppercase tracking-[.12em] text-ink/45">{item.period}</span><span className="inline-flex items-center gap-1 text-sm font-bold text-signal">{uk ? 'Читати кейс' : 'Read case'} <ArrowRight size={14} /></span></div></Link>)}</div>}</div></section>
      </main>
    </ServicePageLayout>
  );
}
