import { ArrowLeft, ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ServicePageLayout from '../components/ServicePageLayout';
import { type CaseSection, type CaseStudy } from '../data/cases';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

function RenderSection({ section, color }: { section: CaseSection; color: string }) {
  switch (section.type) {
    case 'intro':
      return (
        <p className="text-lg text-gray-600 leading-[1.8] border-l-[3px] pl-5 my-8" style={{ borderColor: color }}>
          {section.text}
        </p>
      );
    case 'h2':
      return <h2 className="text-2xl font-bold text-gray-900 mt-14 mb-4 leading-snug tracking-tight">{section.text}</h2>;
    case 'h3':
      return <h3 className="text-base font-bold text-gray-900 mt-8 mb-3 leading-snug">{section.text}</h3>;
    case 'p':
      return <p className="text-gray-600 leading-[1.8] my-4 text-[15px]">{section.text}</p>;
    case 'ul':
      return (
        <ul className="my-5 flex flex-col gap-2.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-[15px]">
              <span className="mt-[9px] w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol className="my-5 flex flex-col gap-2.5">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-[15px]">
              <span className="flex-shrink-0 w-5 h-5 rounded-md text-white text-xs font-bold flex items-center justify-center mt-0.5" style={{ backgroundColor: color }}>
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'blockquote':
      return (
        <blockquote className="my-10 bg-gray-50 rounded-2xl p-6 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
          <p className="text-gray-700 text-[17px] leading-relaxed italic pl-3">{section.text}</p>
        </blockquote>
      );
    case 'callout':
      return (
        <div className="my-6 rounded-xl p-5 border-l-[3px] bg-gray-50" style={{ borderColor: color }}>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{section.label}</div>
          <p className="text-gray-700 text-sm leading-relaxed">{section.text}</p>
        </div>
      );
    case 'table':
      return (
        <div className="my-6 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-950 text-left">
                {(section.headers ?? []).map((h) => (
                  <th key={h} className="px-4 py-3 text-white text-xs font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(section.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`px-4 py-3 text-gray-600 leading-snug ${ci === 0 ? 'font-medium text-gray-900' : ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function dbToCase(d: Record<string, unknown>): CaseStudy {
  return {
    id: 0,
    slug: d.slug as string,
    published: d.published as boolean,
    metric: d.metric as string,
    metricSub: d.metric_sub as string,
    period: d.period as string,
    title: d.title as string,
    niche: d.niche as string,
    service: d.service as string,
    image: d.image_url as string,
    challenge: d.challenge as string,
    solution: d.solution as string,
    result: d.result as string,
    tags: (d.tags as string[]) ?? [],
    bars: (d.bars as number[]) ?? [1,2,3,4,5,6,7,8,9],
    color: d.color as string,
    stats: (d.stats as { label: string; value: string }[]) ?? [],
    screenshots: (d.screenshots as string[]) ?? [],
    placementReport: (d.placement_report as Record<string, string>[]) ?? [],
    body: (d.body as CaseSection[]) ?? [],
  };
}

export default function CaseStudyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const preloaded = typeof window === 'undefined'
    ? (globalThis as Record<string, unknown>).__SSR_PRELOADED_CASE__ as Record<string, unknown> | undefined
    : undefined;
  const [c, setC] = useState<CaseStudy | undefined>(preloaded ? dbToCase(preloaded) : undefined);
  const [otherCases, setOtherCases] = useState<{ slug: string; niche: string; title: string; metric: string; metric_sub: string; period: string; color: string }[]>([]);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      supabase.from('case_studies').select('*').eq('slug', slug!).maybeSingle(),
      supabase.from('case_studies').select('slug,niche,title,metric,metric_sub,period,color').eq('published', true).neq('slug', slug!).limit(3),
    ]).then(([main, others]) => {
      if (main.data) setC(dbToCase(main.data as Record<string, unknown>));
      if (others.data) setOtherCases(others.data as typeof otherCases);
      setLoading(false);
    });
  }, [slug]);

  useSEO({
    title: c ? `${c.title} — SEO Case Study | Vladenza` : 'Case Study | Vladenza',
    description: c ? `${c.challenge.slice(0, 155)}` : 'SEO link building case study from Vladenza.',
    canonical: `https://vladenza.com/case-studies/${slug}`,
    ogImage: c?.image,
  });

  if (loading) {
    return (
      <ServicePageLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <span className="w-8 h-8 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
        </div>
      </ServicePageLayout>
    );
  }

  if (!c) {
    return (
      <ServicePageLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-sm">Case study not found.</p>
          <a href="/case-studies" className="text-[#F97316] text-sm font-semibold flex items-center gap-1.5 hover:underline">
            <ArrowLeft size={13} /> Back to all cases
          </a>
        </div>
      </ServicePageLayout>
    );
  }

  return (
    <ServicePageLayout>

      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-2 text-xs text-gray-400 overflow-hidden">
          <a href="/" className="hover:text-gray-700 transition-colors whitespace-nowrap">Home</a>
          <span className="text-gray-300">/</span>
          <a href="/case-studies" className="hover:text-gray-700 transition-colors whitespace-nowrap">Case Studies</a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 truncate">{c.title}</span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative pt-12 pb-14 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${c.color}08 0%, #ffffff 60%)` }}
      >
        <div className="absolute top-0 right-0 w-[480px] h-[280px] pointer-events-none opacity-[0.06]"
          style={{ background: `radial-gradient(ellipse at top right, ${c.color}, transparent 70%)` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <a href="/case-studies" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6">
            <ArrowLeft size={12} /> All cases
          </a>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c.color }}>
                {c.niche}
              </span>
            </div>
            <span className="text-xs text-gray-400">{c.service}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400">{c.period}</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-[44px] font-bold text-gray-900 leading-[1.1] tracking-tight max-w-3xl">
            {c.title}
          </h1>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {c.stats.map((s, i) => (
              <div key={s.label} className="py-7 px-4 sm:px-6 first:pl-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {i === 0 && <TrendingUp size={14} style={{ color: c.color }} />}
                  <div className="text-2xl font-black" style={{ color: i === 0 ? c.color : '#111827' }}>{s.value}</div>
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_280px] gap-14">

            {/* Article */}
            <article>
              {/* Summary cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-10 pb-10 border-b border-gray-100">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Challenge</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.challenge}</p>
                </div>
                <div className="rounded-2xl p-5 border-l-[3px] bg-gray-50" style={{ borderColor: c.color }}>
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: c.color }}>What We Did</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{c.solution}</p>
                </div>
                <div className="bg-gray-950 rounded-2xl p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Results</div>
                  <p className="text-gray-300 text-sm leading-relaxed">{c.result}</p>
                </div>
              </div>

              {/* Full body */}
              <div>
                {c.body.map((section, i) => (
                  <RenderSection key={i} section={section} color={c.color} />
                ))}
              </div>

              {/* Screenshots */}
              {c.screenshots && c.screenshots.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Results Screenshots</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {c.screenshots.map((src, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                        <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Placement report */}
              {c.placementReport && c.placementReport.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Report</h2>
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-950 text-left">
                          {Object.keys(c.placementReport[0]).map(h => (
                            <th key={h} className="px-4 py-3 text-white text-xs font-semibold capitalize whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {c.placementReport.map((row, ri) => (
                          <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'}>
                            {Object.values(row).map((cell, ci) => (
                              <td key={ci} className={`px-4 py-3 text-gray-600 leading-snug ${ci === 0 ? 'font-medium text-gray-900' : ''}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="px-3 py-1 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-md">
                    {t}
                  </span>
                ))}
              </div>
            </article>

            {/* Sidebar */}
            <aside>
              <div className="sticky top-[104px] flex flex-col gap-4">

                {/* Metrics */}
                <div className="border border-gray-200 rounded-2xl p-5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Key metrics</div>
                  <div className="flex flex-col gap-3.5">
                    {c.stats.map((s, i) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">{s.label}</span>
                        <span className="text-sm font-bold" style={{ color: i === 0 ? c.color : '#111827' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div
                  className="rounded-2xl p-5 border-l-[3px] bg-gray-50"
                  style={{ borderColor: c.color }}
                >
                  <div className="text-sm font-bold text-gray-900 mb-1">Want similar results?</div>
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed">Tell us your niche — we'll build the strategy.</p>
                  <a
                    href="/#contact"
                    className="flex items-center justify-center gap-2 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-200 hover:opacity-90 hover:shadow-md"
                    style={{ backgroundColor: c.color }}
                  >
                    Get a Free Proposal <ArrowRight size={13} />
                  </a>
                </div>

              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* More cases */}
      <section className="py-14 border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">More case studies</h2>
            <a href="/case-studies" className="text-sm font-semibold text-[#F97316] flex items-center gap-1.5 hover:underline">
              View all <ArrowRight size={13} />
            </a>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {otherCases.map((oc) => (
              <a
                key={oc.slug}
                href={`/case-studies/${oc.slug}`}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="h-[3px]" style={{ backgroundColor: oc.color }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-3 rounded-full" style={{ backgroundColor: oc.color }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: oc.color }}>
                        {oc.niche}
                      </span>
                    </div>
                    <ArrowUpRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors mb-3">
                    {oc.title}
                  </h3>
                  <div className="pt-3 border-t border-gray-100 flex items-end justify-between">
                    <div>
                      <div className="text-xl font-black leading-none" style={{ color: oc.color }}>{oc.metric}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{oc.metric_sub}</div>
                    </div>
                    <div className="text-[11px] text-gray-400">{oc.period}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </ServicePageLayout>
  );
}
