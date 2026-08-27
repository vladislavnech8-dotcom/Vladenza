import { useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import { supabase } from '../lib/supabase';
import { useSEO } from '../hooks/useSEO';

interface CasePreview {
  slug: string;
  title: string;
  niche: string;
  service: string;
  period: string;
  metric: string;
  metric_sub: string;
  color: string;
  challenge: string;
}

export default function CaseStudiesPage() {
  useSEO({
    title: 'SEO Case Studies — Real Results from Link Building Campaigns | Vladenza',
    description: 'Browse 840+ client campaigns. See how Vladenza delivers measurable SEO results — traffic growth, ranking improvements, and ROI across iGaming, SaaS, health, fintech, and more.',
    canonical: 'https://vladenza.com/case-studies',
  });

  const [cases, setCases] = useState<CasePreview[]>([]);
  const [activeNiche, setActiveNiche] = useState<string>('All');

  useEffect(() => {
    supabase
      .from('case_studies')
      .select('slug,title,niche,service,period,metric,metric_sub,color,challenge')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setCases(data as CasePreview[]); });
  }, []);

  const niches = ['All', ...Array.from(new Set(cases.map(c => c.niche).filter(Boolean)))];
  const filtered = activeNiche === 'All' ? cases : cases.filter(c => c.niche === activeNiche);

  return (
    <ServicePageLayout>

      {/* Hero */}
      <section className="pt-20 pb-14 lg:pt-28 lg:pb-20" style={{ background: 'linear-gradient(160deg,#fff8f3 0%,#ffffff 55%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-5 h-0.5 rounded-full bg-[#F97316]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">Case Studies</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-5">
              Real campaigns.<br />
              <span className="text-[#F97316]">Documented results.</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed max-w-xl mb-8">
              Every case below is a real client — actual metrics, honest timelines, and the specific tactics used to get there.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#cases" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md">
                Browse Cases <ArrowRight size={14} />
              </a>
              <a href="/#contact" className="inline-flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50">
                Start Your Campaign
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-gray-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '840+', label: 'Client campaigns' },
              { value: '4.8×', label: 'Avg traffic growth' },
              { value: '94%', label: 'Campaigns hit KPIs' },
              { value: '200+', label: 'Active clients' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section id="cases" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {niches.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {niches.map((n) => (
                <button
                  key={n}
                  onClick={() => setActiveNiche(n)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                    activeNiche === n
                      ? 'bg-[#F97316] border-[#F97316] text-white shadow-sm'
                      : 'border-gray-200 text-gray-500 hover:border-[#F97316]/40 hover:text-[#F97316] hover:bg-orange-50'
                  }`}
                >
                  {n}
                  {n !== 'All' && (
                    <span className="ml-1.5 opacity-60">
                      {cases.filter(c => c.niche === n).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {cases.length === 0 ? (
            <div className="flex justify-center py-20">
              <span className="w-6 h-6 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((c) => (
                <a
                  key={c.slug}
                  href={`/case-studies/${c.slug}`}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="h-1 w-full" style={{ backgroundColor: c.color }} />
                  <div className="p-6 flex flex-col flex-1 gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] truncate" style={{ color: c.color }}>
                          {c.niche}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-[0.14em] truncate">
                          · {c.service}
                        </span>
                      </div>
                      <ArrowUpRight size={16} className="flex-shrink-0 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 mt-0.5" />
                    </div>

                    <h2 className="text-[16px] font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                      {c.title}
                    </h2>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{c.challenge}</p>

                    <div className="pt-4 mt-auto border-t border-gray-100 flex items-end justify-between gap-4">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Key result</div>
                        <div className="text-2xl font-black leading-none" style={{ color: c.color }}>{c.metric}</div>
                        <div className="text-xs text-gray-500 mt-1">{c.metric_sub}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                        <div className="text-sm font-semibold text-gray-700">{c.period}</div>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Your results could be<br />
            <span className="text-[#F97316]">on this page next</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg mx-auto">
            Tell us your niche and goals — we'll build the strategy and show you what's realistic.
          </p>
          <a href="/#contact" className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20">
            Get a Free Strategy Session <ArrowRight size={14} />
          </a>
        </div>
      </section>

    </ServicePageLayout>
  );
}
