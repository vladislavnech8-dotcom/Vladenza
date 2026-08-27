import { useState, useMemo, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PlacementCard from '../components/PlacementCard';
import Pagination from '../components/Pagination';
import { useSEO } from '../hooks/useSEO';
import { fetchPlacements, type Placement, type PlacementServiceType, getPlacementNiches } from '../data/placements';

type ServiceFilter = 'all' | PlacementServiceType;
type SortKey = 'newest' | 'dr' | 'traffic' | 'sort_order';

const SERVICE_FILTERS: { value: ServiceFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'niche_edit', label: 'Niche Edits' },
  { value: 'guest_post', label: 'Guest Posts' },
  { value: 'crowd_link', label: 'Crowd Links' },
];

const DR_FILTERS = ['Any', 'DR20+', 'DR30+', 'DR40+', 'DR50+', 'DR60+'] as const;
const TRAFFIC_FILTERS = [
  { label: 'Any', min: 0 },
  { label: '1K+', min: 1000 },
  { label: '5K+', min: 5000 },
  { label: '10K+', min: 10000 },
  { label: '50K+', min: 50000 },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'sort_order', label: 'Manual Order' },
  { value: 'newest', label: 'Newest' },
  { value: 'dr', label: 'Highest DR' },
  { value: 'traffic', label: 'Highest Traffic' },
];

const PAGE_SIZE = 6;

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [nicheFilter, setNicheFilter] = useState('All');
  const [drFilter, setDrFilter] = useState<string>('Any');
  const [trafficFilter, setTrafficFilter] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('sort_order');
  const [page, setPage] = useState(1);

  useSEO({
    title: 'Real Link Placements — Niche Edits, Guest Posts & Crowd Links | Vladenza',
    description: 'Browse real examples of niche edits, guest posts and community links we have delivered across different industries, authority levels and traffic ranges.',
    canonical: 'https://vladenza.com/placements',
  });

  useEffect(() => {
    fetchPlacements({ status: 'active' }).then((data) => {
      setPlacements(data);
      setLoading(false);
    });
  }, []);

  const niches = useMemo(() => {
    const fromData = getPlacementNiches(placements);
    return ['All', ...fromData];
  }, [placements]);

  const filtered = useMemo(() => {
    let result = placements.filter((p) => {
      if (serviceFilter !== 'all' && p.service_type !== serviceFilter) return false;
      if (nicheFilter !== 'All' && p.niche !== nicheFilter) return false;
      if (drFilter !== 'Any') {
        const minDr = parseInt(drFilter.replace('DR', '').replace('+', ''), 10);
        if (p.dr < minDr) return false;
      }
      if (p.traffic < trafficFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.domain.toLowerCase().includes(q) &&
            !p.niche.toLowerCase().includes(q) &&
            !(p.title ?? '').toLowerCase().includes(q) &&
            !p.placement_url.toLowerCase().includes(q)) return false;
      }
      return true;
    });

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'dr': return b.dr - a.dr;
        case 'traffic': return b.traffic - a.traffic;
        case 'sort_order': return a.sort_order - b.sort_order;
        default: return 0;
      }
    });

    return result;
  }, [placements, serviceFilter, nicheFilter, drFilter, trafficFilter, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const goToPage = (p: number) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const resetPage = () => setPage(1);

  return (
    <div className="bg-white min-h-screen">
      <Navigation onOpenModal={() => {}} />

      <div className="pt-[88px]">
        {/* Header */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Real Link Building Examples</h1>
            <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
              Browse real placements we've delivered across niche edits, guest posts and community links.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="py-6 bg-gray-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col gap-4">
              {/* Service filter tabs */}
              <div className="flex flex-wrap items-center gap-2">
                {SERVICE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setServiceFilter(f.value); resetPage(); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      serviceFilter === f.value
                        ? 'bg-[#F97316] text-white border border-[#F97316]'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Secondary filters */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Niche */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Niche</span>
                  <div className="relative">
                    <select
                      value={nicheFilter}
                      onChange={(e) => { setNicheFilter(e.target.value); resetPage(); }}
                      className="appearance-none text-sm bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]/40 text-gray-600"
                    >
                      {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                    <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* DR */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">DR</span>
                  {DR_FILTERS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDrFilter(d); resetPage(); }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                        drFilter === d
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Traffic */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Traffic</span>
                  {TRAFFIC_FILTERS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => { setTrafficFilter(t.min); resetPage(); }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                        trafficFilter === t.min
                          ? 'bg-gray-900 border-gray-900 text-white'
                          : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sort</span>
                  <select
                    value={sort}
                    onChange={(e) => { setSort(e.target.value as SortKey); resetPage(); }}
                    className="appearance-none text-sm bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]/40 text-gray-600"
                  >
                    {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  placeholder="Search by domain, title or URL"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#F97316]/60 focus:ring-2 focus:ring-[#F97316]/10 transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <span className="w-6 h-6 border-2 border-gray-200 border-t-[#F97316] rounded-full animate-spin" />
              </div>
            ) : shown.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-gray-400 text-sm">No placements match these filters.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {shown.map((p) => (
                    <PlacementCard key={p.id} p={p} />
                  ))}
                </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

                <p className="text-center text-xs text-gray-400 mt-6">
                  Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.
                </p>
              </>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
