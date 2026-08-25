import { ArrowUpRight } from 'lucide-react';

export interface RelatedCase {
  slug: string;
  title: string;
  niche: string;
  service: string;
  period: string;
  metric: string;
  metric_sub: string;
  color: string;
  stats?: { label: string; value: string }[];
}

export default function CaseStudyCards({ cases }: { cases: RelatedCase[] }) {
  if (cases.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cases.map((c) => {
        const beforeAfter = c.stats?.find((s) => s.value.includes('→'));
        return (
          <a
            key={c.slug}
            href={`/case-studies/${c.slug}`}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col p-6"
          >
            {/* Niche + arrow */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c.color }}>
                {c.niche}
              </span>
              <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>

            {/* Metric — dominant element */}
            <div className="mb-4">
              <div className="text-4xl font-black leading-none transition-transform group-hover:scale-105 origin-left duration-300" style={{ color: c.color }}>
                {c.metric}
              </div>
              <div className="text-xs text-gray-400 mt-1.5 uppercase tracking-wide font-medium">{c.metric_sub}</div>
            </div>

            {/* Before/After if real data exists */}
            {beforeAfter && (
              <div className="flex items-center gap-2 mb-4 text-sm bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-gray-400 text-xs">{beforeAfter.label}:</span>
                <span className="font-bold text-gray-800 text-sm">{beforeAfter.value}</span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors mb-4 flex-1">
              {c.title}
            </h3>

            {/* Service mix + timeline */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mb-3">
              <span className="text-xs text-gray-400">{c.service}</span>
              <span className="text-xs font-bold text-gray-700">{c.period}</span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#F97316] transition-colors">
              See how we did it
              <ArrowUpRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        );
      })}
    </div>
  );
}
