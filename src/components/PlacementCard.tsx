import { useState } from 'react';
import { ArrowUpRight, ZoomIn } from 'lucide-react';
import { type Placement, SERVICE_TYPE_LABELS, formatTraffic } from '../data/placements';
import { trackEvent } from '../lib/analytics';
import Lightbox from './Lightbox';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    viewFullScreenshot: 'View full screenshot',
    viewScreenshots: (n: number) => `View ${n} screenshots`,
    traffic: 'Traffic',
    keywords: 'Keywords',
    viewPlacement: 'View Placement',
  },
  uk: {
    viewFullScreenshot: 'Переглянути скріншот',
    viewScreenshots: (n: number) => `Переглянути ${n} скріншотів`,
    traffic: 'Трафік',
    keywords: 'Ключові слова',
    viewPlacement: 'Переглянути розміщення',
  },
};

const SERVICE_TYPE_UK: Record<string, string> = {
  'Niche Edit': 'Розміщення посилань',
  'Guest Post': 'Гостьова публікація',
  'Crowd Link': 'Крауд-посилання',
};

export default function PlacementCard({ p }: { p: Placement }) {
  const { locale } = useLocale();
  const uk = locale === 'uk';
  const c = content[locale];

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

  const serviceLabel = uk ? (SERVICE_TYPE_UK[SERVICE_TYPE_LABELS[p.service_type]] ?? SERVICE_TYPE_LABELS[p.service_type]) : SERVICE_TYPE_LABELS[p.service_type];

  return (
    <>
      <article className="group flex flex-col border-2 border-ink/15 bg-white transition-colors hover:border-signal">
        {/* Screenshot preview */}
        {hasScreenshot && (
          <div
            className="relative aspect-[16/10] w-full cursor-pointer overflow-hidden bg-navy"
            onClick={openLightbox}
          >
            <img
              src={primaryScreenshot}
              alt={`${serviceLabel} placement on ${p.domain}`}
              className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => setImgError(true)}
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/15">
              <div className="flex flex-col items-center gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center bg-white/90">
                  <ZoomIn size={18} className="text-gray-800" />
                </div>
                <span className="whitespace-nowrap bg-black/40 px-2.5 py-1 text-xs font-bold text-white">
                  {screenshots.length > 1 ? c.viewScreenshots(screenshots.length) : c.viewFullScreenshot}
                </span>
              </div>
            </div>
            {extraCount > 0 && (
              <div className="absolute right-2.5 top-2.5 bg-black/60 px-2 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                +{extraCount}
              </div>
            )}
          </div>
        )}

        {/* Info section */}
        <div className="flex flex-1 flex-col p-5">
          {/* Type + niche — editorial eyebrow */}
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.14em] text-ink/45">
            <span>{serviceLabel}</span>
            <span className="text-ink/20">·</span>
            <span>{p.niche}</span>
          </div>

          {/* Domain — strong typography focus */}
          <div className="mt-3 min-w-0">
            <div className="truncate font-display text-lg font-bold leading-tight text-ink">
              {p.domain}
            </div>
            {p.title && (
              <div className="mt-1 line-clamp-1 text-xs text-ink/50">{p.title}</div>
            )}
          </div>

          {/* Metrics — thin divider, restrained */}
          <div className="mt-4 flex items-center gap-5 border-t border-ink/10 pt-3.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">DR</span>
              <span className="font-display text-xl font-bold text-signal">{p.dr}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">{c.traffic}</span>
              <span className="text-sm font-bold text-ink/75">{formatTraffic(p.traffic)}</span>
            </div>
            {p.keywords != null && (
              <div className="flex items-baseline gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wide text-ink/35">{c.keywords}</span>
                <span className="text-sm font-bold text-ink/75">{p.keywords}</span>
              </div>
            )}
          </div>

          {/* View placement link */}
          <a
            href={p.placement_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('view_placement', { domain: p.domain, service_type: p.service_type })}
            className="editorial-focus mt-4 flex items-center gap-1.5 text-sm font-bold text-signal transition-colors hover:text-ink"
          >
            {c.viewPlacement}
            <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </article>

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
