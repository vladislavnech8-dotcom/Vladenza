import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { type Placement, SERVICE_TYPE_LABELS, formatTraffic } from '../data/placements';
import { trackEvent } from '../lib/analytics';

export default function PlacementCard({ p }: { p: Placement }) {
  const [imgError, setImgError] = useState(false);
  const primaryScreenshot = p.screenshots?.length > 0 ? p.screenshots[0] : p.screenshot_url;
  const hasScreenshot = primaryScreenshot && !imgError;

  return (
    <a
      href={p.placement_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('view_placement', { domain: p.domain, service_type: p.service_type })}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50">
        {hasScreenshot ? (
          <img
            src={primaryScreenshot}
            alt={`${SERVICE_TYPE_LABELS[p.service_type]} placement on ${p.domain}`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 via-orange-50/40 to-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-sm font-medium">{p.domain}</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>{SERVICE_TYPE_LABELS[p.service_type]}</span>
          <span className="text-gray-200">·</span>
          <span>{p.niche}</span>
        </div>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 group-hover:text-[#F97316] transition-colors truncate">
              {p.domain} ↗
            </div>
            {p.title && (
              <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.title}</div>
            )}
          </div>
          <ArrowUpRight size={14} className="text-gray-300 group-hover:text-[#F97316] transition-colors flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-4 pt-3 border-t border-gray-100 mt-auto">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">DR</div>
            <div className={`text-lg font-black ${p.dr >= 60 ? 'text-emerald-500' : p.dr >= 50 ? 'text-[#F97316]' : 'text-blue-500'}`}>{p.dr}</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Traffic</div>
            <div className="text-sm font-bold text-gray-800">{formatTraffic(p.traffic)}</div>
          </div>
          {p.keywords != null && (
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide">Keywords</div>
              <div className="text-sm font-bold text-gray-800">{p.keywords}</div>
            </div>
          )}
        </div>
        <span className="text-sm font-semibold text-[#F97316] group-hover:text-[#EA580C] flex items-center gap-1.5 transition-colors">
          View Live Placement <ArrowUpRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </a>
  );
}
