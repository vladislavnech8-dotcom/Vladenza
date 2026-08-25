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
  challenge: string;
}

export default function CaseStudyCards({ cases }: { cases: RelatedCase[] }) {
  if (cases.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {cases.map((c) => (
        <a
          key={c.slug}
          href={`/case-studies/${c.slug}`}
          className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
        >
          <div className="h-1 w-full" style={{ backgroundColor: c.color }} />
          <div className="p-6 flex flex-col flex-1 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: c.color }}>
                {c.niche}
              </span>
            </div>

            <div className="text-xs text-gray-400 font-medium">{c.service}</div>

            <h3 className="text-[15px] font-bold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors flex-1">
              {c.title}
            </h3>

            <div className="flex items-end justify-between gap-4 pt-4 mt-auto border-t border-gray-100">
              <div>
                <div className="text-2xl font-black leading-none" style={{ color: c.color }}>{c.metric}</div>
                <div className="text-xs text-gray-400 mt-1">{c.metric_sub}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">Timeline</div>
                <div className="text-sm font-semibold text-gray-700">{c.period}</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 group-hover:text-[#F97316] transition-colors">
              View Campaign
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
