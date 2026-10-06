import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import PlacementCard from './PlacementCard';
import Pagination from './Pagination';
import { fetchPlacements, SERVICE_TYPE_LABELS, type Placement, type PlacementServiceType, getPlacementNiches } from '../data/placements';
import { useLocale } from '../context/LocaleContext';

const DR_FILTERS = ['Any', 'DR20+', 'DR30+', 'DR40+', 'DR50+', 'DR60+'] as const;
const TRAFFIC_FILTERS = [
  { label: 'Any', min: 0 },
  { label: '1K+', min: 1000 },
  { label: '5K+', min: 5000 },
  { label: '10K+', min: 10000 },
  { label: '50K+', min: 50000 },
];

const NICHE_TRANSLATIONS: Record<string, string> = {
  'Health': 'Здоров\'я',
  'Insurance': 'Страхування',
  'Marketing': 'Маркетинг',
  'Proxy': 'Проксі',
  'Tech': 'Технології',
  'Traffic': 'Трафік',
};

const SERVICE_TYPE_UK: Record<string, string> = {
  'Niche Edit': 'Розміщення посилань',
  'Guest Post': 'Гостьова публікація',
  'Crowd Link': 'Крауд-посилання',
};

const PAGE_SIZE = 6;

export default function PlacementExplorer({ serviceType, showServiceTypeFilters = false }: { serviceType?: PlacementServiceType; showServiceTypeFilters?: boolean }) {
  const { locale } = useLocale();
  const uk = locale === 'uk';
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);
  const niches = useMemo(() => ['All', ...getPlacementNiches(placements)], [placements]);
  const [activeNiche, setActiveNiche] = useState('All');
  const [activeServiceType, setActiveServiceType] = useState<PlacementServiceType | 'all'>('all');
  const [activeDr, setActiveDr] = useState<string>('Any');
  const [activeTraffic, setActiveTraffic] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const t = {
    niche: uk ? 'Ніша' : 'Niche',
    all: uk ? 'Усі' : 'All',
    searchPlaceholder: uk ? 'Пошук домену або ніші' : 'Search domain or niche',
    noResults: uk ? 'Розміщень не знайдено.' : 'No placements match these filters.',
    metricsNote: uk
      ? 'Метрики з Ahrefs, можуть змінюватися з часом. DR = Domain Rating. Трафік = оцінка органічних відвідувань на місяць.'
      : 'Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.',
  };

  const localizeNiche = (n: string) => {
    if (n === 'All') return t.all;
    return uk ? (NICHE_TRANSLATIONS[n] ?? n) : n;
  };

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
      if (activeServiceType !== 'all' && p.service_type !== activeServiceType) return false;
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
      {/* Filter toolbar */}
      <div className="mb-8 flex flex-col gap-4 border-b-2 border-ink/10 pb-6">
        {showServiceTypeFilters && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{uk ? 'Сервіс' : 'Service'}</span>
            {(['all', 'guest_post', 'niche_edit', 'crowd_link'] as const).map((type) => (
              <button key={type} type="button" onClick={() => { setActiveServiceType(type); setPage(1); }} className={`border-2 px-3 py-1.5 text-xs font-bold transition-all duration-150 ${activeServiceType === type ? 'border-signal bg-signal text-white' : 'border-ink/15 bg-white text-ink/50 hover:border-ink/40 hover:text-ink'}`}>
                {type === 'all' ? t.all : (uk ? ({ guest_post: 'Гостьові публікації', niche_edit: 'Розміщення посилань', crowd_link: 'Крауд-маркетинг' }[type]) : SERVICE_TYPE_LABELS[type])}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{t.niche}</span>
          {niches.map((n) => (
            <button
              key={n}
              onClick={() => { setActiveNiche(n); setPage(1); }}
              className={`border-2 px-3 py-1.5 text-xs font-bold transition-all duration-150 ${
                activeNiche === n
                  ? 'border-signal bg-signal text-white'
                  : 'border-ink/15 bg-white text-ink/50 hover:border-ink/40 hover:text-ink'
              }`}
            >
              {localizeNiche(n)}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">DR</span>
            {DR_FILTERS.map((d) => (
              <button
                key={d}
                onClick={() => { setActiveDr(d); setPage(1); }}
                className={`border-2 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                  activeDr === d
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{uk ? 'Трафік' : 'Traffic'}</span>
            {TRAFFIC_FILTERS.map((tf) => (
              <button
                key={tf.label}
                onClick={() => { setActiveTraffic(tf.min); setPage(1); }}
                className={`border-2 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                  activeTraffic === tf.min
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="relative ml-auto min-w-[160px] flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t.searchPlaceholder}
              className="w-full border-2 border-ink/15 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder-ink/35 focus:border-signal focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <span className="h-6 w-6 border-2 border-ink/15 border-t-signal animate-spin" />
        </div>
      ) : shown.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-semibold text-ink/40">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <PlacementCard key={p.id} p={p} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      <p className="mt-6 text-center text-xs text-ink/35">
        {t.metricsNote}
      </p>
    </div>
  );
}
