import { ArrowRight } from 'lucide-react';
import { cases } from '../data/cases';

const featured = cases.slice(0, 3);

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-20 md:py-24 bg-white">
      <div className="max-w-xl mx-auto px-4 sm:px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 rounded-full bg-[#F97316]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">Case Studies</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-[1.1] tracking-tight">
              Results We're<br />
              <span className="text-[#F97316]">Proud to Show</span>
            </h2>
            <p className="text-gray-500 mt-4 text-[15px] max-w-md leading-relaxed">
              Real client campaigns. Documented metrics. No stock screenshots.
            </p>
          </div>
          <a
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 px-5 py-2.5 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shrink-0"
          >
            All case studies <ArrowRight size={13} />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {featured.map((c) => (
            <a
              key={c.slug}
              href={`/case-studies/${c.slug}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100/80 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
            >
              <div className="h-1 w-full" style={{ backgroundColor: c.color }} />

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c.color }}>
                    {c.niche}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.14em]">
                    · {c.service}
                  </span>
                </div>

                <h3 className="text-gray-900 font-bold text-[16px] leading-snug mb-3 group-hover:text-gray-700 transition-colors">
                  {c.title}
                </h3>

                <p className="text-gray-500 text-[13px] leading-relaxed mb-5 flex-1 line-clamp-3">
                  {c.challenge}
                </p>

                <div className="border-t border-gray-100 pt-4 mb-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Key result</div>
                      <div className="text-2xl font-black leading-none" style={{ color: c.color }}>{c.metric}</div>
                      <div className="text-[11px] text-gray-500 mt-1">{c.metricSub}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Timeline</div>
                      <div className="text-sm font-semibold text-gray-700">{c.period}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {c.stats.slice(0, 2).map((s) => (
                    <div key={s.label} className="bg-gray-50 rounded-lg px-3 py-2.5">
                      <div className="text-[13px] font-bold text-gray-900">{s.value}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold mt-auto" style={{ color: c.color }}>
                  Read full case
                  <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="bg-gray-950 rounded-2xl px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex gap-6 sm:gap-8 text-center sm:text-left">
            <div>
              <div className="text-2xl font-black text-white">840+</div>
              <div className="text-gray-500 text-[11px] mt-0.5">campaigns delivered</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#F97316]">94%</div>
              <div className="text-gray-500 text-[11px] mt-0.5">hit KPIs</div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">4.8×</div>
              <div className="text-gray-500 text-[11px] mt-0.5">avg traffic growth</div>
            </div>
          </div>
          <a
            href="/case-studies"
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md hover:shadow-orange-300/30 shrink-0"
          >
            View all 6 case studies <ArrowRight size={13} />
          </a>
        </div>

      </div>
    </section>
  );
}
