import { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PlacementCard from '../components/PlacementCard';
import Pagination from '../components/Pagination';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';
import { fetchPlacements, type Placement, type PlacementServiceType, getPlacementNiches } from '../data/placements';

type ServiceFilter = 'all' | PlacementServiceType;
type SortKey = 'newest' | 'dr' | 'traffic' | 'sort_order';

const SERVICE_FILTERS: { value: ServiceFilter; labelEn: string; labelUk: string }[] = [
  { value: 'all', labelEn: 'All', labelUk: 'Усі' },
  { value: 'niche_edit', labelEn: 'Link Insertions', labelUk: 'Розміщення посилань' },
  { value: 'guest_post', labelEn: 'Guest Posts', labelUk: 'Гостьові публікації' },
  { value: 'crowd_link', labelEn: 'Crowd Marketing', labelUk: 'Крауд-маркетинг' },
];

const DR_FILTERS = ['Any', 'DR20+', 'DR30+', 'DR40+', 'DR50+', 'DR60+'] as const;
const TRAFFIC_FILTERS = [
  { label: 'Any', min: 0 },
  { label: '1K+', min: 1000 },
  { label: '5K+', min: 5000 },
  { label: '10K+', min: 10000 },
  { label: '50K+', min: 50000 },
];

const SORT_OPTIONS: { value: SortKey; labelEn: string; labelUk: string }[] = [
  { value: 'sort_order', labelEn: 'Manual Order', labelUk: 'Вручну' },
  { value: 'newest', labelEn: 'Newest', labelUk: 'Найновіші' },
  { value: 'dr', labelEn: 'Highest DR', labelUk: 'Найвищий DR' },
  { value: 'traffic', labelEn: 'Highest Traffic', labelUk: 'Найвищий трафік' },
];

const PAGE_SIZE = 6;

export default function PlacementsPage() {
  const { locale } = useLocale();
  const uk = locale === 'uk';
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
    title: uk ? 'Реальні розміщення посилань — готові статті, гостьові публікації та крауд-посилання | Vladenza' : 'Real Link Placements — Niche Edits, Guest Posts & Crowd Links | Vladenza',
    description: uk ? 'Перегляньте реальні приклади готових статей, гостьових публікацій і крауд-посилань у різних нішах, з різними показниками авторитетності та трафіку.' : 'Browse real examples of niche edits, guest posts and community links we have delivered across different industries, authority levels and traffic ranges.',
    canonical: `https://vladenza.com${uk ? '/uk/placements' : '/placements'}`,
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

  const t = {
    niche: uk ? 'Ніша' : 'Niche',
    sort: uk ? 'Сортування' : 'Sort',
    searchPlaceholder: uk ? 'Пошук за доменом, назвою або URL' : 'Search by domain, title or URL',
    noResults: uk ? 'За цими фільтрами розміщень не знайдено.' : 'No placements match these filters.',
    metricsNote: uk ? 'Метрики отримано з Ahrefs, вони можуть змінюватися. DR = рейтинг домену. Трафік = орієнтовна кількість органічних візитів на місяць.' : 'Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.',
    results: uk ? 'розміщень' : 'placements',
  };

  const nicheLabel = (n: string) => {
    if (n === 'All') return uk ? 'Усі' : 'All';
    return n;
  };

  return (
    <div className="bg-cream min-h-screen">
      <Navigation onOpenModal={() => {}} />

      <div className="pt-[88px]">
        {/* Header — navy editorial */}
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="paper-grain absolute inset-0 opacity-20" />
          <div className="relative z-10 mx-auto max-w-[1440px] px-5 py-14 sm:px-8 md:py-20 lg:px-16">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">
              {uk ? 'РОЗМИЩЕННЯ' : 'PLACEMENTS'}
            </p>
            <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[.95] tracking-[-.04em] text-cream">
              {uk ? <>Та частина, де ми <span className="text-signal">показуємо посилання.</span></> : <>The part where we <span className="text-signal">show the links.</span></>}
            </h1>
          </div>
        </section>

        {/* Filters + Results — single continuous section */}
        <section className="bg-cream">
          <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 md:py-14 lg:px-16">
            {/* Filter toolbar */}
            <div className="mb-8 flex flex-col gap-5 border-b-2 border-ink/10 pb-6">
              {/* Service filter row */}
              <div className="flex flex-wrap items-center gap-2">
                {SERVICE_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setServiceFilter(f.value); resetPage(); }}
                    className={`border-2 px-4 py-2 text-sm font-bold transition-all duration-150 ${
                      serviceFilter === f.value
                        ? 'border-signal bg-signal text-white'
                        : 'border-ink/15 bg-white text-ink/55 hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    {uk ? f.labelUk : f.labelEn}
                  </button>
                ))}
              </div>

              {/* Secondary filters row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                {/* Niche dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{t.niche}</span>
                  <select
                    value={nicheFilter}
                    onChange={(e) => { setNicheFilter(e.target.value); resetPage(); }}
                    className="appearance-none border-2 border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink focus:border-signal focus:outline-none"
                  >
                    {niches.map((n) => <option key={n} value={n}>{nicheLabel(n)}</option>)}
                  </select>
                </div>

                {/* DR filter group */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">DR</span>
                  {DR_FILTERS.map((d) => (
                    <button
                      key={d}
                      onClick={() => { setDrFilter(d); resetPage(); }}
                      className={`border-2 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                        drFilter === d
                          ? 'border-ink bg-ink text-white'
                          : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Traffic filter group */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{uk ? 'Трафік' : 'Traffic'}</span>
                  {TRAFFIC_FILTERS.map((tf) => (
                    <button
                      key={tf.label}
                      onClick={() => { setTrafficFilter(tf.min); resetPage(); }}
                      className={`border-2 px-2.5 py-1 text-xs font-bold transition-all duration-150 ${
                        trafficFilter === tf.min
                          ? 'border-ink bg-ink text-white'
                          : 'border-ink/15 text-ink/50 hover:border-ink/40 hover:text-ink'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {/* Sort + Search — right aligned */}
                <div className="flex flex-wrap items-center gap-3 ml-auto">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-[.14em] text-ink/40">{t.sort}</span>
                    <select
                      value={sort}
                      onChange={(e) => { setSort(e.target.value as SortKey); resetPage(); }}
                      className="appearance-none border-2 border-ink/15 bg-white px-3 py-1.5 text-sm font-semibold text-ink focus:border-signal focus:outline-none"
                    >
                      {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{uk ? s.labelUk : s.labelEn}</option>)}
                    </select>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                      placeholder={t.searchPlaceholder}
                      className="w-full border-2 border-ink/15 bg-white py-2 pl-9 pr-3 text-sm text-ink placeholder-ink/35 focus:border-signal focus:outline-none sm:w-64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results count */}
            {!loading && filtered.length > 0 && (
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-bold text-ink/50">
                  {filtered.length} {t.results}
                </p>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="h-6 w-6 border-2 border-ink/15 border-t-signal animate-spin" />
              </div>
            ) : shown.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm font-semibold text-ink/40">{t.noResults}</p>
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {shown.map((p) => (
                    <PlacementCard key={p.id} p={p} />
                  ))}
                </div>

                <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

                <p className="mt-6 text-center text-xs text-ink/35">
                  {t.metricsNote}
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
