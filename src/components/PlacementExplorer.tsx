import { useState, useMemo } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { nicheEditPlacements, getPlacementNiches } from '../data/nicheEditPlacements';
import { trackEvent } from '../lib/analytics';

const DR_FILTERS = ['Any', 'DR20+', 'DR30+', 'DR40+', 'DR50+', 'DR60+'] as const;
const TRAFFIC_FILTERS = [
  { label: 'Any', min: 0 },
  { label: '1K+', min: 1000 },
  { label: '5K+', min: 5000 },
  { label: '10K+', min: 10000 },
  { label: '50K+', min: 50000 },
];

const INITIAL_COUNT = 9;
const LOAD_BATCH = 9;

function formatTraffic(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toLocaleString();
}

function PlacementCard({ p }: { p: typeof nicheEditPlacements[number] }) {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('view_placement', { domain: p.domain })}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#F97316]/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50">
        {imgError ? (
          <div className="w-full h-full bg-gradient-to-br from-orange-50 via-orange-50/40 to-gray-100 flex items-center justify-center">
            <span className="text-gray-300 text-sm font-medium">{p.domain}</span>
          </div>
        ) : (
          <img
            src={p.screenshot}
            alt={`Niche edit placement on ${p.domain}`}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-800 group-hover:text-[#F97316] transition-colors truncate">{p.domain}</div>
            <div className="text-xs text-gray-400 mt-0.5">{p.niche}</div>
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
      </div>
    </a>
  );
}

export default function PlacementExplorer() {
  const niches = useMemo(() => ['All', ...getPlacementNiches()], []);
  const [activeNiche, setActiveNiche] = useState('All');
  const [activeDr, setActiveDr] = useState<string>('Any');
  const [activeTraffic, setActiveTraffic] = useState(0);
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(INITIAL_COUNT);

  const filtered = useMemo(() => {
    return nicheEditPlacements.filter((p) => {
      if (activeNiche !== 'All' && p.niche !== activeNiche) return false;
      if (activeDr !== 'Any') {
        const minDr = parseInt(activeDr.replace('DR', '').replace('+', ''), 10);
        if (p.dr < minDr) return false;
      }
      if (p.traffic < activeTraffic) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.domain.toLowerCase().includes(q) && !p.niche.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [activeNiche, activeDr, activeTraffic, search]);

  const shown = filtered.slice(0, visible);

  return (
    <div>
      {/* Filters — compact toolbar */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Niche</span>
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => { setActiveNiche(n); setVisible(INITIAL_COUNT); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                activeNiche === n
                  ? 'bg-[#F97316] border-[#F97316] text-white'
                  : 'border-gray-200 text-gray-500 hover:border-[#F97316]/40 hover:text-[#F97316]'
              }`}
            >
              {n}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">DR</span>
            {DR_FILTERS.map((d) => (
              <button
                key={d}
                onClick={() => { setActiveDr(d); setVisible(INITIAL_COUNT); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  activeDr === d
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Traffic</span>
            {TRAFFIC_FILTERS.map((t) => (
              <button
                key={t.label}
                onClick={() => { setActiveTraffic(t.min); setVisible(INITIAL_COUNT); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                  activeTraffic === t.min
                    ? 'bg-gray-900 border-gray-900 text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 min-w-[160px] max-w-xs ml-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setVisible(INITIAL_COUNT); }}
              placeholder="Search domain or niche"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm">No placements match these filters.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shown.map((p) => (
            <PlacementCard key={p.id} p={p} />
          ))}
        </div>
      )}

      {/* Show More */}
      {visible < filtered.length && (
        <div className="text-center mt-8">
          <button
            onClick={() => setVisible((v) => v + LOAD_BATCH)}
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#F97316]/40 text-gray-600 hover:text-[#F97316] font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200"
          >
            Show More Placements ({filtered.length - visible} remaining)
          </button>
        </div>
      )}

      <p className="text-center text-xs text-gray-400 mt-6">
        Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.
      </p>
    </div>
  );
}
