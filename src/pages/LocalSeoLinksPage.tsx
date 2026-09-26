import { useState } from 'react';
import { MapPin, Globe, Star, Shield, TrendingUp, CheckCircle, ArrowRight, Zap, Building2, Search } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'Local SEO Link Building Service | Vladenza',
      description: 'Local SEO link building service for local businesses. Citations, NAP consistency, editorial links, and Google Maps Pack ranking signals.',
    },
    hero: {
      badge: 'Local SEO Links',
      title1: 'Local Link Building',
      title2: 'That Moves the Map Pack',
      subtitle: 'Geo-targeted links that drive map pack rankings and local organic traffic',
      desc: 'Local businesses win on Google through proximity, relevance, and authority — all three depend on the right links. We build geo-targeted, editorially-placed links that send the exact signals needed to rank in your city, compete in the map pack, and capture high-intent "near me" searches.',
      cta: 'Get a Local SEO Audit',
      ctaSecondary: 'View Packages',
    },
    stats: [
      { label: 'Avg. map pack improvement', value: 'Top 3 in 60 days' },
      { label: 'Link types', value: 'Citations, editorial, geo-niche' },
      { label: 'Delivery time', value: '10–18 days' },
      { label: 'Industries served', value: '30+ local verticals' },
    ],
    features: [
      { icon: MapPin, title: 'City & Region-Targeted Links', desc: 'Links placed on geo-relevant sites — local business directories, city news portals, and regional industry blogs — that send precise location signals to Google.' },
      { icon: Building2, title: 'NAP Consistency Audits', desc: 'We review your Name, Address, Phone citations across key directories and correct inconsistencies that dilute your map pack authority.' },
      { icon: Globe, title: 'Real-Traffic Local Domains', desc: 'Every placement is on a verified site with genuine local organic traffic — not placeholder directories or zero-traffic citation networks.' },
      { icon: Shield, title: 'Manual Outreach Only', desc: 'No automated submission tools. Every link is placed via manual editorial outreach, ensuring quality standards that automated tools can\'t match.' },
      { icon: TrendingUp, title: 'Map Pack Authority Building', desc: 'Strategy designed to strengthen your Google Business Profile signals through co-citation and proximity-relevance from local publisher links.' },
      { icon: Search, title: 'Hyperlocal Keyword Anchors', desc: 'Anchor text strategy calibrated for "service + city" queries — the highest-converting local search intent for service businesses.' },
    ],
    featuresSection: {
      badge: 'How It Works',
      title1: 'Local authority signals that',
      title2: 'Google actually trusts',
      desc: 'Every link we place for local clients is chosen for its geo-relevance, topical match, and ability to reinforce your service area authority.',
    },
    packages: [
      {
        name: 'Local Foundation',
        desc: 'For businesses entering a new market or building initial map pack presence.',
        price: 'From $490',
        links: '10 Links',
        dr: 'DR 20–45',
        features: ['City & region-targeted domains', 'Local directory placements', 'NAP-consistent content', 'Permanent live links', 'Full placement report'],
        highlight: false,
      },
      {
        name: 'Local Authority',
        desc: 'For competitive local markets with multiple ranking targets.',
        price: 'From $890',
        links: '20 Links',
        dr: 'DR 35–60',
        features: ['High-DR regional publishers', 'Guest post + citation mix', 'Multi-location anchor strategy', 'Priority delivery 10–14 days', 'Monthly performance report'],
        highlight: true,
      },
      {
        name: 'Multi-Location',
        desc: 'For franchise operators or agencies managing multiple service areas.',
        price: 'From $1,680',
        links: '40 Links',
        dr: 'DR 40–70+',
        features: ['Links across multiple geo targets', 'Local editorial placements', 'Dedicated account manager', 'Competitor citation gap analysis', 'Quarterly strategy review'],
        highlight: false,
      },
    ],
    packagesSection: {
      title: 'Local SEO link packages',
      desc: 'Tiered options for businesses of all sizes — from single-location service providers to multi-city franchise operations.',
      mostPopular: 'Most Popular',
      cta: 'Order Package',
    },
    industries: [
      'Plumbing & HVAC',
      'Law Firms & Attorneys',
      'Dental & Medical Clinics',
      'Contractors & Builders',
      'Real Estate Agents',
      'Auto Repair & Dealerships',
      'Restaurants & Hospitality',
      'Home Cleaning Services',
    ],
    industriesSection: {
      badge: 'Who We Help',
      title1: 'Built for businesses that',
      title2: 'depend on local search',
      desc: 'If your customers search for your services in a specific city or region, local link building is your highest-ROI SEO investment. We work across all service industries where proximity is a ranking factor.',
      whyLocalTitle: 'Why local links beat generic links',
      whyLocal: [
        { label: 'Geo-relevance signal', detail: 'Local links confirm your service area to Google\'s algorithms' },
        { label: 'Map pack influence', detail: 'Local citations and links directly impact 3-Pack rankings' },
        { label: 'Lower competition', detail: 'Most local competitors have weak link profiles — easy wins' },
        { label: 'Faster ROI', detail: 'Local SERP movements happen faster than national campaigns' },
      ],
      auditTitle: 'Free local SEO audit',
      auditDesc: 'Not sure where your local rankings stand? We\'ll review your Google Business Profile, citation consistency, and local link profile — free, within 24 hours.',
      auditCta: 'Request Free Audit',
    },
    seoBlock: {
      heading: 'Local SEO links that win the Map Pack and nearby searches',
      intro: 'Ranking locally takes different signals than national SEO. Google weighs proximity, prominence, and relevance — so local businesses need geo-targeted citations, NAP consistency, and editorial links from regionally relevant sources to climb the Map Pack and \'near me\' results.',
      body: [
        "We build a clean local footprint: consistent name, address, and phone data across authoritative directories, plus city- and region-relevant editorial placements that reinforce where you operate. Every citation is verified to avoid the duplicate and mismatched listings that quietly suppress local rankings.",
        "Local links pair naturally with broader authority building. Layer in [guest posting](/services/guest-posting) on industry sites and [niche edits](/services/niche-edits) to strengthen your domain overall, not just your local presence.",
        "Explore our [case studies](/case-studies) to see how targeted link building lifted visibility for location-dependent businesses.",
      ],
      faqs: [
        { q: 'What are local SEO links?', a: 'Local SEO links are geo-targeted citations and editorial backlinks from sources relevant to your city or region. They signal to Google where your business operates and boost Map Pack and local search visibility.' },
        { q: 'Why does NAP consistency matter?', a: 'Consistent Name, Address, and Phone details across the web help Google trust your business data. Mismatches and duplicate listings can confuse ranking signals and lower local visibility.' },
        { q: 'Do local links help national rankings too?', a: 'They strengthen your overall profile, but their primary benefit is local. For broader growth, combine them with guest posts and niche edits on higher-authority sites.' },
        { q: 'Which businesses benefit most?', a: 'Any business that serves a specific area — clinics, law firms, contractors, restaurants, and multi-location brands — benefits from a strong local link and citation profile.' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'Локальний лінкбілдинг для SEO | Vladenza',
      description: 'Послуга локального лінкбілдингу для місцевого бізнесу. Цитування, NAP-консистентність, редакційні посилання та сигнали для ранжування в Google Maps Pack.',
    },
    hero: {
      badge: 'Локальний лінкбілдинг',
      title1: 'Локальний лінкбілдинг',
      title2: 'що рухає Map Pack',
      subtitle: 'Гео-таргетовані посилання, що піднімають ранжування в map pack та локальний органічний трафік',
      desc: 'Місцевий бізнес перемагає в Google завдяки близькості, релевантності та авторитетності — усі три залежать від правильних посилань. Ми будуємо гео-таргетовані, редакційно розміщені посилання, що надсилають точні сигнали для ранжування у вашому місті, конкуренції в map pack та захоплення high-intent «near me» запитів.',
      cta: 'Отримати локальний SEO-аудит',
      ctaSecondary: 'Переглянути пакети',
    },
    stats: [
      { label: 'Середнє покращення map pack', value: 'Топ-3 за 60 днів' },
      { label: 'Типи посилань', value: 'Цитування, редакційні, гео-нішеві' },
      { label: 'Час доставки', value: '10–18 днів' },
      { label: 'Галузей обслуговано', value: '30+ локальних вертикалей' },
    ],
    features: [
      { icon: MapPin, title: 'Посилання з привʼязкою до міста та регіону', desc: 'Посилання на гео-релевантних сайтах — локальні бізнес-каталоги, міські новинні портали та регіональні галузеві блоги — що надсилають точні сигнали локації Google.' },
      { icon: Building2, title: 'Аудит NAP-консистентності', desc: 'Ми перевіряємо ваші цитування Name, Address, Phone у ключових каталогах та виправляємо невідповідності, що розмивають авторитет map pack.' },
      { icon: Globe, title: 'Локальні домени з реальним трафіком', desc: 'Кожне розміщення — на перевіреному сайті зі справжнім локальним органічним трафіком, а не в порожніх каталогах чи мережах цитувань без трафіку.' },
      { icon: Shield, title: 'Лише ручний аутріч', desc: 'Без автоматичних інструментів. Кожне посилання розміщується через ручний редакційний аутріч із стандартами якості, недосяжними для автоматизованих інструментів.' },
      { icon: TrendingUp, title: 'Побудова авторитету Map Pack', desc: 'Стратегія для посилення сигналів вашого Google Business Profile через ко-цитування та релевантність близькості від локальних паблішер-посилань.' },
      { icon: Search, title: 'Гіперлокальні анкори', desc: 'Стратегія анкор-текстів, відкалібрована під запити «послуга + місто» — найконверсійніший локальний пошуковий інтент для сервісного бізнесу.' },
    ],
    featuresSection: {
      badge: 'Як це працює',
      title1: 'Локальні сигнали авторитету,',
      title2: 'яким Google дійсно довіряє',
      desc: 'Кожне посилання, яке ми розміщуємо для локальних клієнтів, обирається за гео-релевантністю, тематичним збігом та здатністю посилити авторитет вашої зони обслуговування.',
    },
    packages: [
      {
        name: 'Локальна основа',
        desc: 'Для бізнесу, що виходить на новий ринок або будує початкову присутність у map pack.',
        price: 'Від $490',
        links: '10 посилань',
        dr: 'DR 20–45',
        features: ['Гео-таргетовані домени', 'Розміщення в локальних каталогах', 'NAP-консистентний контент', 'Постійні живі посилання', 'Повний звіт про розміщення'],
        highlight: false,
      },
      {
        name: 'Локальний авторитет',
        desc: 'Для конкурентних локальних ринків з кількома цілями ранжування.',
        price: 'Від $890',
        links: '20 посилань',
        dr: 'DR 35–60',
        features: ['Регіональні паблішери з високим DR', 'Мікс гостьових публікацій + цитувань', 'Мультилокальна анкор-стратегія', 'Пріоритетна доставка 10–14 днів', 'Щомісячний звіт про результати'],
        highlight: true,
      },
      {
        name: 'Кілька локацій',
        desc: 'Для франшиз або агенцій, що керують кількома зонами обслуговування.',
        price: 'Від $1,680',
        links: '40 посилань',
        dr: 'DR 40–70+',
        features: ['Посилання по кількох гео-цілях', 'Локальні редакційні розміщення', 'Персональний акаунт-менеджер', 'Аналіз розриву в цитуваннях конкурентів', 'Щоквартальний огляд стратегії'],
        highlight: false,
      },
    ],
    packagesSection: {
      title: 'Пакети локального SEO-лінкбілдингу',
      desc: 'Рівневі варіанти для бізнесу будь-якого розміру — від однолокаційних сервісних провайдерів до мульти-міських франшиз.',
      mostPopular: 'Найпопулярніший',
      cta: 'Замовити пакет',
    },
    industries: [
      'Сантехніка та HVAC',
      'Юридичні фірми та адвокати',
      'Стоматологічні та медичні клініки',
      'Підрядники та будівельники',
      'Рієлтори',
      'Автосервіс та дилершипи',
      'Ресторани та готельний бізнес',
      'Клінінгові послуги',
    ],
    industriesSection: {
      badge: 'Кому ми допомагаємо',
      title1: 'Створено для бізнесу, що',
      title2: 'залежить від локального пошуку',
      desc: 'Якщо ваші клієнти шукають ваші послуги в конкретному місті чи регіоні — локальний лінкбілдинг є вашою найприбутковішою SEO-інвестицією. Ми працюємо в усіх сервісних галузях, де близькість є фактором ранжування.',
      whyLocalTitle: 'Чому локальні посилання кращі за загальні',
      whyLocal: [
        { label: 'Сигнал гео-релевантності', detail: 'Локальні посилання підтверджують вашу зону обслуговування для алгоритмів Google' },
        { label: 'Вплив на map pack', detail: 'Локальні цитування та посилання прямо впливають на ранжування в 3-Pack' },
        { label: 'Менша конкуренція', detail: 'Більшість локальних конкурентів мають слабкі профілі посилань — легкі перемоги' },
        { label: 'Швидший ROI', detail: 'Локальні рухи в SERP відбуваються швидше, ніж національні кампанії' },
      ],
      auditTitle: 'Безкоштовний локальний SEO-аудит',
      auditDesc: 'Не впевнені, де ваші локальні позиції? Ми безкоштовно, за 24 години, оглянемо ваш Google Business Profile, консистентність цитувань та локальний профіль посилань.',
      auditCta: 'Запитати безкоштовний аудит',
    },
    seoBlock: {
      heading: 'Локальні SEO-посилання, що виграють Map Pack та пошук поблизу',
      intro: 'Локальне ранжування вимагає інших сигналів, ніж національне SEO. Google зважає близькість, помітність та релевантність — тож місцевому бізнесу потрібні гео-таргетовані цитування, NAP-консистентність та редакційні посилання з регіонально релевантних джерел, щоб піднятися в Map Pack та результатах «поблизу».',
      body: [
        "Ми будуємо чистий локальний слід: послідовні ім'я, адресу та телефон у авторитетних каталогах, плюс міські та регіональні редакційні розміщення, що підсилюють те, де ви працюєте. Кожне цитування перевіряється, щоб уникнути дублікатів та невідповідностей, які тихо пригнічують локальне ранжування.",
        "Локальні посилання природно поєднуються із ширшим побудовою авторитету. Додайте [гостьові публікації](/services/guest-posting) на галузевих сайтах та [нішеві едити](/services/niche-edits), щоб посилити ваш домен загалом, а не лише локальну присутність.",
        "Дослідіть наші [кейс-стаді](/case-studies), щоб побачити, як цільовий лінкбілдинг підняв видимість для бізнесу, залежного від локації.",
      ],
      faqs: [
        { q: 'Що таке локальні SEO-посилання?', a: 'Локальні SEO-посилання — це гео-таргетовані цитування та редакційні беклінки з джерел, релевантних вашому місту чи регіону. Вони сигналізують Google, де працює ваш бізнес, та підвищують видимість у Map Pack та локальному пошуку.' },
        { q: 'Чому NAP-консистентність важлива?', a: 'Послідовні Name, Address, Phone дані в інтернеті допомагають Google довіряти вашим бізнес-даним. Невідповідності та дублікати можуть плутати сигнали ранжування та знижувати локальну видимість.' },
        { q: 'Чи допомагають локальні посилання і на національному рівні?', a: 'Вони посилюють ваш загальний профіль, але їхня головна користь — локальна. Для ширшого зростання поєднуйте їх із гостьовими публікаціями та нішевими едитами на сайтах з вищим авторитетом.' },
        { q: 'Якому бізнесу це найкорисніше?', a: 'Будь-який бізнес, що обслуговує конкретну територію — клініки, юридичні фірми, підрядники, ресторани та мульти-локаційні бренди — виграє від сильного локального профілю посилань та цитувань.' },
      ],
    },
  },
} as const;

export default function LocalSeoLinksPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/\]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/local-seo-links')}/`,
    noindex: true,
  });
  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 lg:py-28"
        style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`lp-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <MapPin size={12} />
              {c.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-4">
              {c.hero.title1}<br />
              <span className="text-[#F97316]">{c.hero.title2}</span>
            </h1>
            <p className="text-[#F97316] font-semibold text-lg mb-4">
              {c.hero.subtitle}
            </p>
            <p className="text-gray-500 leading-relaxed mb-8 max-w-xl">
              {c.hero.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg({ name: locale === 'uk' ? 'Безкоштовний локальний SEO-аудит' : 'Local SEO Audit', price: locale === 'uk' ? 'Безкоштовно' : 'Free', links: locale === 'uk' ? 'Безкоштовний локальний аудит' : 'Free local audit', service: locale === 'uk' ? 'Локальні SEO-посилання' : 'Local SEO Links' })}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {c.hero.cta} <ArrowRight size={14} />
              </button>
              <a
                href="#packages"
                className="inline-flex items-center gap-2 border border-gray-200 hover:border-[#F97316]/40 text-gray-700 hover:text-[#F97316] font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200"
              >
                {c.hero.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs text-gray-400 font-medium uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-gray-900 font-bold text-sm">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.featuresSection.badge}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {c.featuresSection.title1}<br />
              <span className="text-[#F97316]">{c.featuresSection.title2}</span>
            </h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              {c.featuresSection.desc}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/25 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                  <f.icon size={17} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">{c.packagesSection.title}</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">
              {c.packagesSection.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {c.packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-2xl p-7 border flex flex-col ${pkg.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}
              >
                {pkg.highlight && (
                  <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 self-start">
                    <Star size={9} />
                    {c.packagesSection.mostPopular}
                  </div>
                )}
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{pkg.dr}</div>
                <h3 className="text-2xl font-bold text-white mb-1">{pkg.name}</h3>
                <p className={`text-sm mb-4 font-semibold ${pkg.highlight ? 'text-white/90' : 'text-[#F97316]'}`}>{pkg.links}</p>
                <div className="text-3xl font-black text-white mb-2">{pkg.price}</div>
                <p className={`text-xs mb-6 leading-relaxed ${pkg.highlight ? 'text-white/70' : 'text-gray-400'}`}>{pkg.desc}</p>
                <div className="flex flex-col gap-2.5 mb-8 flex-1">
                  {pkg.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={pkg.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${pkg.highlight ? 'text-white/90' : 'text-gray-300'}`}>{feat}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: pkg.name, price: pkg.price, links: pkg.links, service: locale === 'uk' ? 'Локальні SEO-посилання' : 'Local SEO Links' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${pkg.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  {c.packagesSection.cta} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries + why local links */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
                {c.industriesSection.badge}
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-tight">
                {c.industriesSection.title1}<br /><span className="text-[#F97316]">{c.industriesSection.title2}</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {c.industriesSection.desc}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {c.industries.map((ind) => (
                  <div key={ind} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-lg px-3.5 py-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                    <span className="text-gray-700 text-xs font-medium">{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="bg-gray-950 rounded-2xl p-7 text-white">
                <div className="flex items-center gap-2 mb-5">
                  <Zap size={14} className="text-[#F97316]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{c.industriesSection.whyLocalTitle}</span>
                </div>
                {c.industriesSection.whyLocal.map((item, i) => (
                  <div key={item.label} className={`flex items-start gap-3 py-3.5 ${i < 3 ? 'border-b border-white/[0.07]' : ''}`}>
                    <div className="w-5 h-5 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#F97316] text-[9px] font-black">{i + 1}</span>
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{item.label}</div>
                      <div className="text-gray-400 text-xs mt-0.5 leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={14} className="text-[#F97316]" />
                  <span className="text-[#F97316] font-bold text-sm">{c.industriesSection.auditTitle}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {c.industriesSection.auditDesc}
                </p>
                <button
                  onClick={() => setSelectedPkg({
                    name: locale === 'uk' ? 'Безкоштовний локальний SEO-аудит' : 'Free Local SEO Audit',
                    price: locale === 'uk' ? 'Безкоштовно' : 'Free',
                    links: locale === 'uk' ? 'Перевірка GBP та цитувань' : 'GBP + citation review',
                    service: locale === 'uk' ? 'Локальні SEO-посилання' : 'Local SEO Links',
                  })}
                  className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all duration-200"
                >
                  {c.industriesSection.auditCta} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ServiceSeoBlock
        heading={c.seoBlock.heading}
        intro={c.seoBlock.intro}
        body={c.seoBlock.body.map(localizeLinks)}
        faqs={c.seoBlock.faqs.map((faq) => ({ ...faq, a: localizeLinks(faq.a) }))}
      />
    </ServicePageLayout>
  );
}
