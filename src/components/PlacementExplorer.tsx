import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import PlacementCard from './PlacementCard';
import Pagination from './Pagination';
import { fetchPlacements, type Placement, type PlacementServiceType, getPlacementNiches } from '../data/placements';

const DR_FILTERS = ['Any', 'DR20+', 'DR30+', 'DR40+', 'DR50+', 'DR60+'] as const;
const TRAFFIC_FILTERS = [
  { label: 'Any', min: 0 },
  { label: '1K+', min: 1000 },
  { label: '5K+', min: 5000 },
  { label: '10K+', min: 10000 },
  { label: '50K+', min: 50000 },
];

const PAGE_SIZE = 6;

export default function PlacementExplorer({ serviceType }: { serviceType?: PlacementServiceType }) {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const niches = useMemo(() => ['All', ...getPlacementNiches(placements)], [placements]);
  const [activeNiche, setActiveNiche] = useState('All');
  const [activeDr, setActiveDr] = useState<string>('Any');
  const [activeTraffic, setActiveTraffic] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const filters: Parameters<typeof fetchPlacements>[0] = { status: 'active' };
    if (serviceType) filters.service_type = serviceType;
    fetchPlacements(filters).then((data) => {
      setPlacements(data);
      setLoading(false);
    });
  }, [serviceType]);

  const filtered = useMemo(() => {
    return placements.filter((p) => {
      if (activeNiche !== 'All' && p.niche !== activeNiche) return false;
      if (activeDr !== 'Any') {
        const minDr = parseInt(activeDr.replace('DR', '').replace('+', ''), 10);
        if (p.dr < minDr) return false;
      }
      if (p.traffic < activeTraffic) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.domain.toLowerCase().includes(q) &&
            !p.niche.toLowerCase().includes(q) &&
            !(p.title ?? '').toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [placements, activeNiche, activeDr, activeTraffic, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goToPage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div>
      {/* Filters — compact toolbar */}
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Niche</span>
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => { setActiveNiche(n); setPage(1); }}
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
                onClick={() => { setActiveDr(d); setPage(1); }}
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
                onClick={() => { setActiveTraffic(t.min); setPage(1); }}
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search domain or niche"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="w-6 h-6 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
        </div>
      ) : shown.length === 0 ? (
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

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      <p className="text-center text-xs text-gray-400 mt-6">
        Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.
      </p>
    </div>
  );
}
