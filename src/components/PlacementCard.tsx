import { useState } from 'react';
import { ArrowUpRight, ZoomIn } from 'lucide-react';
import { type Placement, SERVICE_TYPE_LABELS, formatTraffic } from '../data/placements';
import { trackEvent } from '../lib/analytics';
import Lightbox from './Lightbox';

export default function PlacementCard({ p }: { p: Placement }) {
  const [imgError, setImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const screenshots = p.screenshots?.length > 0 ? p.screenshots : (p.screenshot_url ? [p.screenshot_url] : []);
  const hasScreenshot = screenshots.length > 0 && !imgError;
  const primaryScreenshot = screenshots[0];
  const extraCount = screenshots.length - 1;

  const openLightbox = () => {
    setLightboxIndex(0);
    setLightboxOpen(true);
    trackEvent('view_screenshot', { domain: p.domain, service_type: p.service_type, count: screenshots.length });
  };

  return (
    <>
      <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#F97316]/30 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300 flex flex-col">
        {/* Screenshot preview — only rendered when a screenshot exists */}
        {hasScreenshot && (
          <div
            className="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 cursor-pointer"
            onClick={openLightbox}
          >
            <img
              src={primaryScreenshot}
              alt={`${SERVICE_TYPE_LABELS[p.service_type]} placement on ${p.domain}`}
              className="w-full h-full object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <ZoomIn size={18} className="text-gray-800" />
                </div>
                <span className="text-white text-xs font-semibold bg-black/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {screenshots.length > 1 ? `View ${screenshots.length} screenshots` : 'View full screenshot'}
                </span>
              </div>
            </div>
            {/* Extra screenshots badge */}
            {extraCount > 0 && (
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-2 py-1 rounded-lg">
                +{extraCount}
              </div>
            )}
          </div>
        )}

        {/* Info section */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          {/* Type + niche */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
            <span>{SERVICE_TYPE_LABELS[p.service_type]}</span>
            <span className="text-gray-200">·</span>
            <span>{p.niche}</span>
          </div>

          {/* Domain */}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">
              {p.domain}
            </div>
            {p.title && (
              <div className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.title}</div>
            )}
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
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

          {/* View placement link */}
          <a
            href={p.placement_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('view_placement', { domain: p.domain, service_type: p.service_type })}
            className="text-sm font-semibold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors mt-auto"
          >
            View Placement <ArrowUpRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && hasScreenshot && (
        <Lightbox
          images={screenshots}
          startIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
