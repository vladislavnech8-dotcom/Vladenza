import { useState } from 'react';
import {
  Search, FileText, Link2, Users, Cpu, MapPin,
  Linkedin, Building2, Lock, ArrowRight, CheckCircle, Zap,
} from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

interface ServicePricing {
  icon: typeof Search;
  name: string;
  href: string;
  tagline: string;
  tiers: { label: string; price: string; desc: string; features: string[]; highlight: boolean }[];
}

const services: ServicePricing[] = [
  {
    icon: Search,
    name: 'SEO Audit',
    href: '/services/seo-audit',
    tagline: 'Full technical & strategic audit',
    tiers: [
      { label: 'Standard', price: 'From $500', desc: 'Technical SEO audit with actionable recommendations.', features: ['100+ page audit', 'Technical issues report', 'Content gap analysis', 'Competitor overview', '30-min strategy call'], highlight: false },
      { label: 'Advanced', price: 'From $1,200', desc: 'Deep audit with link profile and penalty check.', features: ['Everything in Standard', 'Backlink profile audit', 'Penalty risk assessment', 'Content strategy roadmap', 'Priority delivery (5 days)'], highlight: true },
    ],
  },
  {
    icon: FileText,
    name: 'Guest Posting',
    href: '/services/guest-posting',
    tagline: 'Editorial links on real traffic sites',
    tiers: [
      { label: 'Starter', price: 'From $80', desc: 'DR 30–50 placements with 800+ word articles.', features: ['Niche-relevant domain', 'Manual QC check', '800+ word article', 'Permanent placement', 'Report with live URL'], highlight: false },
      { label: 'Authority', price: 'From $180', desc: 'DR 50–70 high-traffic editorial sites.', features: ['High-traffic editorial sites', '1,200+ word content', 'Strategic anchor mapping', 'Priority support', 'Full placement report'], highlight: true },
      { label: 'Premium', price: 'From $380', desc: 'DR 70–90+ industry publications.', features: ['Industry publication placements', 'Expert-level content', 'Editor-reviewed copy', 'Dedicated account manager', 'Custom anchor planning'], highlight: false },
    ],
  },
  {
    icon: Link2,
    name: 'Link Insertions',
    href: '/services/niche-edits',
    tagline: 'Links inserted in aged, indexed content',
    tiers: [
      { label: 'Essential', price: 'From $80', desc: 'DR 20–40+ contextual placements.', features: ['Contextual placement', 'Manual QC', 'Custom anchor', 'Permanent link', 'Report with URL'], highlight: false },
      { label: 'Growth', price: 'From $120', desc: 'DR 30–50+ high-relevance placements.', features: ['All in Essential', 'High-relevance articles', 'Traffic-verified domains', 'Strategic anchor mapping', 'Priority queue'], highlight: true },
      { label: 'Power', price: 'From $220', desc: 'DR 50–80+ premium aged content.', features: ['All in Growth', 'Premium publisher network', 'Editor-level placements', 'Anchor strategy session', 'Dedicated account manager'], highlight: false },
    ],
  },
  {
    icon: Users,
    name: 'Crowd Marketing',
    href: '/services/crowd-links',
    tagline: 'Forum & community link building',
    tiers: [
      { label: '30 Links', price: '$290', desc: '$9.67 per link — starter package.', features: ['30 crowd links', 'Niche-relevant forums', 'Natural placement', '5–10 day delivery', 'Full report'], highlight: false },
      { label: '60 Links', price: '$520', desc: '$8.67 per link — best value.', features: ['60 crowd links', 'All in 30 Links', 'Priority forums', 'Diversified anchors', '10–14 day delivery'], highlight: true },
      { label: '120 Links', price: '$940', desc: '$7.83 per link — bulk discount.', features: ['120 crowd links', 'All in 60 Links', 'Premium forum access', 'Custom anchor strategy', 'Dedicated manager'], highlight: false },
    ],
  },
  {
    icon: Cpu,
    name: 'AI & LLM SEO',
    href: '/services/ai-llm',
    tagline: 'Get cited by ChatGPT & Perplexity',
    tiers: [
      { label: 'GEO Starter', price: 'From $1,500', desc: 'Entity optimization & AI visibility baseline.', features: ['Entity & schema audit', 'Content optimization for AI', '3 target AI engines', 'Monthly visibility report', 'Strategy call'], highlight: false },
      { label: 'GEO Pro', price: 'From $3,500', desc: 'Full GEO campaign with content & monitoring.', features: ['Everything in Starter', 'AI content optimization', '6 target AI engines', 'Bi-weekly reporting', 'Dedicated specialist'], highlight: true },
      { label: 'Enterprise', price: 'Custom', desc: 'Multi-brand AI visibility at scale.', features: ['Everything in Pro', 'Multi-brand strategy', 'All major AI engines', 'Custom KPI dashboard', 'Priority delivery'], highlight: false },
    ],
  },
  {
    icon: MapPin,
    name: 'Local SEO Links',
    href: '/services/local-seo-links',
    tagline: 'Map pack & local organic rankings',
    tiers: [
      { label: 'Local Starter', price: 'From $600', desc: 'Citations & local link foundation.', features: ['50 local citations', '10 local directory links', 'Google Business optimization', 'Monthly report'], highlight: false },
      { label: 'Local Pro', price: 'From $1,200', desc: 'Full local SEO link campaign.', features: ['Everything in Starter', '30 local links', 'Local PR placements', 'Review generation strategy', 'Bi-weekly calls'], highlight: true },
    ],
  },
  {
    icon: Linkedin,
    name: 'LinkedIn Personal',
    href: '/services/linkedin-personal',
    tagline: 'Personal brand & profile growth',
    tiers: [
      { label: 'Profile Boost', price: 'From $400', desc: 'Profile optimization & content strategy.', features: ['Profile optimization', 'Content calendar', '10 posts/month', 'Engagement strategy', 'Monthly report'], highlight: false },
      { label: 'Authority Builder', price: 'From $900', desc: 'Full personal branding campaign.', features: ['Everything in Boost', '20 posts/month', 'LinkedIn SEO', 'Connection strategy', 'Dedicated writer'], highlight: true },
    ],
  },
  {
    icon: Building2,
    name: 'LinkedIn Company',
    href: '/services/linkedin-company',
    tagline: 'Company page management & B2B leads',
    tiers: [
      { label: 'Page Starter', price: 'From $700', desc: 'Company page setup & content.', features: ['Page optimization', '8 posts/month', 'Employee advocacy kit', 'Monthly analytics', 'Strategy call'], highlight: false },
      { label: 'B2B Growth', price: 'From $1,500', desc: 'Full LinkedIn lead generation.', features: ['Everything in Starter', '16 posts/month', 'Lead gen campaigns', 'Sales Navigator setup', 'Dedicated manager'], highlight: true },
    ],
  },
  {
    icon: Lock,
    name: 'White Label',
    href: '/services/white-label',
    tagline: 'Silent fulfilment for agencies',
    tiers: [
      { label: 'Partner', price: 'From $1K', desc: 'Reseller link building packages.', features: ['Branded reports', 'Volume discounts', 'Dedicated portal', 'Priority delivery', 'Monthly billing'], highlight: false },
      { label: 'Agency Partner', price: 'From $3K', desc: 'Full white-label fulfillment.', features: ['Everything in Partner', 'Custom SLA', 'Bulk pricing', 'Account manager', 'Quarterly strategy reviews'], highlight: true },
    ],
  },
];

const pricingUk: Record<string, string> = {
  'SEO Audit': 'SEO-аудит', 'Guest Posting': 'Гостьові публікації', 'Link Insertions': 'Розміщення посилань у готових статтях', 'Crowd Marketing': 'Крауд-маркетинг', 'AI & LLM SEO': 'SEO для AI та LLM', 'Local SEO Links': 'Локальні SEO-посилання', 'LinkedIn Personal': 'Особистий LinkedIn', 'LinkedIn Company': 'LinkedIn для компаній', 'White Label': 'White Label',
  'Full technical & strategic audit': 'Повний технічний та стратегічний аудит', 'Editorial links on real traffic sites': 'Редакційні посилання на сайтах з реальним трафіком', 'Links inserted in aged, indexed content': 'Посилання в готових проіндексованих статтях', 'Forum & community link building': 'Лінкбілдинг на форумах і в спільнотах', 'Get cited by ChatGPT & Perplexity': 'Цитування в ChatGPT та Perplexity', 'Map pack & local organic rankings': 'Просування на картах і в локальній видачі', 'Personal brand & profile growth': 'Розвиток особистого бренду та профілю', 'Company page management & B2B leads': 'Ведення сторінки компанії та B2B-ліди', 'Silent fulfilment for agencies': 'Тиха реалізація для агенцій',
  Standard: 'Стандарт', Advanced: 'Розширений', Starter: 'Стартовий', Authority: 'Авторитетний', Premium: 'Преміум', Essential: 'Базовий', Growth: 'Розвиток', Power: 'Потужний', '30 Links': '30 посилань', '60 Links': '60 посилань', '120 Links': '120 посилань', 'GEO Starter': 'GEO Starter', 'GEO Pro': 'GEO Pro', Enterprise: 'Корпоративний', 'Local Starter': 'Локальний старт', 'Local Pro': 'Локальний Pro', 'Profile Boost': 'Покращення профілю', 'Authority Builder': 'Розвиток авторитету', 'Page Starter': 'Старт сторінки', 'B2B Growth': 'B2B-розвиток', Partner: 'Партнер', 'Agency Partner': 'Партнер агенції',
  'From $500': 'Від $500', 'From $1,200': 'Від $1 200', 'From $80': 'Від $80', 'From $180': 'Від $180', 'From $380': 'Від $380', 'From $1,500': 'Від $1 500', 'From $3,500': 'Від $3 500', 'From $600': 'Від $600', 'From $900': 'Від $900', 'From $700': 'Від $700', 'From $1K': 'Від $1K', 'From $3K': 'Від $3K', Custom: 'Індивідуально',
  'No hidden fees. No long-term lock-ins. Pick a service, choose a tier, and start your campaign within 5 business days.': 'Без прихованих платежів і довгострокових зобов’язань. Оберіть послугу та пакет — і запустіть кампанію протягом 5 робочих днів.',
  'Pricing': 'Ціни', 'Details': 'Детальніше', Popular: 'Популярний', 'Get Started': 'Почати', 'Not sure which service fits?': 'Не знаєте, яка послуга вам підходить?', "Tell us about your goals and we'll recommend the right mix of services for your campaign.": 'Розкажіть про свої цілі — ми порекомендуємо оптимальне поєднання послуг для вашої кампанії.', 'Get a Custom Proposal': 'Отримати індивідуальну пропозицію', 'See service page': 'Переглянути сторінку послуги', 'Get a quote': 'Отримати пропозицію', 'Custom Package': 'Індивідуальний пакет', 'General Inquiry': 'Загальний запит',
  'Technical SEO audit with actionable recommendations.': 'Технічний SEO-аудит із практичними рекомендаціями.', 'Deep audit with link profile and penalty check.': 'Глибокий аудит профілю посилань і перевірка ризиків санкцій.', 'DR 30–50 placements with 800+ word articles.': 'Розміщення на сайтах DR 30–50 зі статтями від 800 слів.', 'DR 50–70 high-traffic editorial sites.': 'Редакційні сайти DR 50–70 із високим трафіком.', 'DR 70–90+ industry publications.': 'Галузеві видання DR 70–90+.', 'DR 20–40+ contextual placements.': 'Контекстні розміщення DR 20–40+.', 'DR 30–50+ high-relevance placements.': 'Релевантні розміщення DR 30–50+.', 'DR 50–80+ premium aged content.': 'Преміум-розміщення в готовому контенті DR 50–80+.', '$9.67 per link — starter package.': '$9,67 за посилання — стартовий пакет.', '$8.67 per link — best value.': '$8,67 за посилання — найкраща ціна.', '$7.83 per link — bulk discount.': '$7,83 за посилання — знижка за обсяг.', 'Entity optimization & AI visibility baseline.': 'Оптимізація сутностей і базова видимість в AI.', 'Full GEO campaign with content & monitoring.': 'Повна GEO-кампанія з контентом і моніторингом.', 'Multi-brand AI visibility at scale.': 'Масштабна AI-видимість для кількох брендів.', 'Citations & local link foundation.': 'Цитування та основа локальних посилань.', 'Full local SEO link campaign.': 'Повна кампанія локальних SEO-посилань.', 'Profile optimization & content strategy.': 'Оптимізація профілю та контент-стратегія.', 'Full personal branding campaign.': 'Повна кампанія розвитку особистого бренду.', 'Company page setup & content.': 'Налаштування сторінки компанії та контент.', 'Full LinkedIn lead generation.': 'Повна генерація лідів у LinkedIn.', 'Reseller link building packages.': 'Пакети лінкбілдингу для реселерів.', 'Full white-label fulfillment.': 'Повна white-label реалізація.', '100+ page audit': 'Аудит понад 100 сторінок', 'Technical issues report': 'Звіт про технічні проблеми', 'Content gap analysis': 'Аналіз прогалин у контенті', 'Competitor overview': 'Огляд конкурентів', '30-min strategy call': '30-хвилинний стратегічний дзвінок', 'Everything in Standard': 'Усе зі Standard', 'Backlink profile audit': 'Аудит профілю зворотних посилань', 'Penalty risk assessment': 'Оцінка ризику санкцій', 'Content strategy roadmap': 'План розвитку контент-стратегії', 'Priority delivery (5 days)': 'Пріоритетна реалізація (5 днів)', 'Niche-relevant domain': 'Домен, релевантний ніші', 'Manual QC check': 'Ручна перевірка якості', 'Permanent placement': 'Постійне розміщення', 'Report with live URL': 'Звіт із робочим URL', 'High-traffic editorial sites': 'Редакційні сайти з високим трафіком', '1,200+ word content': 'Контент від 1 200 слів', 'Strategic anchor mapping': 'Стратегічна карта анкорів', 'Priority support': 'Пріоритетна підтримка', 'Full placement report': 'Повний звіт про розміщення', 'Industry publication placements': 'Розміщення в галузевих виданнях', 'Expert-level content': 'Експертний контент', 'Editor-reviewed copy': 'Текст, перевірений редактором', 'Dedicated account manager': 'Персональний менеджер', 'Custom anchor planning': 'Індивідуальне планування анкорів', 'Contextual placement': 'Контекстне розміщення', 'Manual QC': 'Ручна перевірка якості', 'Custom anchor': 'Індивідуальний анкор', 'Permanent link': 'Постійне посилання', 'Report with URL': 'Звіт із URL', 'All in Essential': 'Усе з Essential', 'High-relevance articles': 'Високорелевантні статті', 'Traffic-verified domains': 'Домени з підтвердженим трафіком', 'Priority queue': 'Пріоритетна черга', 'All in Growth': 'Усе з Growth', 'Premium publisher network': 'Преміум-мережа видавців', 'Editor-level placements': 'Розміщення на рівні редакції', 'Anchor strategy session': 'Сесія зі стратегії анкорів', '30 crowd links': '30 крауд-посилань', '60 crowd links': '60 крауд-посилань', '120 crowd links': '120 крауд-посилань', 'Niche-relevant forums': 'Форуми, релевантні ніші', 'Natural placement': 'Природне розміщення', 'Full report': 'Повний звіт', 'All in 30 Links': 'Усе з пакета 30 посилань', 'Priority forums': 'Пріоритетні форуми', 'Diversified anchors': 'Різноманітні анкори', 'All in 60 Links': 'Усе з пакета 60 посилань', 'Premium forum access': 'Доступ до преміум-форумів', 'Custom anchor strategy': 'Індивідуальна стратегія анкорів', 'Dedicated manager': 'Персональний менеджер', 'Entity & schema audit': 'Аудит сутностей і Schema', 'Content optimization for AI': 'Оптимізація контенту для AI', '3 target AI engines': '3 цільові AI-системи', 'Monthly visibility report': 'Щомісячний звіт про видимість', 'Strategy call': 'Стратегічний дзвінок', 'Everything in Starter': 'Усе зі Starter', 'AI content optimization': 'Оптимізація AI-контенту', '6 target AI engines': '6 цільових AI-систем', 'Bi-weekly reporting': 'Звіти раз на два тижні', 'Dedicated specialist': 'Персональний спеціаліст', 'Everything in Pro': 'Усе з Pro', 'Multi-brand strategy': 'Стратегія для кількох брендів', 'All major AI engines': 'Усі основні AI-системи', 'Custom KPI dashboard': 'Індивідуальний KPI-дашборд', '50 local citations': '50 локальних цитувань', '10 local directory links': '10 посилань із локальних каталогів', 'Google Business optimization': 'Оптимізація Google Business', '30 local links': '30 локальних посилань', 'Local PR placements': 'Локальні PR-розміщення', 'Review generation strategy': 'Стратегія отримання відгуків', 'Bi-weekly calls': 'Дзвінки раз на два тижні', 'Profile optimization': 'Оптимізація профілю', 'Content calendar': 'Контент-календар', '10 posts/month': '10 дописів на місяць', 'Engagement strategy': 'Стратегія залучення', 'Everything in Boost': 'Усе з Boost', '20 posts/month': '20 дописів на місяць', 'LinkedIn SEO': 'SEO для LinkedIn', 'Connection strategy': 'Стратегія розвитку мережі контактів', 'Dedicated writer': 'Персональний автор', 'Page optimization': 'Оптимізація сторінки', '8 posts/month': '8 дописів на місяць', 'Employee advocacy kit': 'Набір для адвокації співробітників', 'Monthly analytics': 'Щомісячна аналітика', '16 posts/month': '16 дописів на місяць', 'Lead gen campaigns': 'Кампанії генерації лідів', 'Sales Navigator setup': 'Налаштування Sales Navigator', 'Branded reports': 'Брендовані звіти', 'Volume discounts': 'Знижки за обсяг', 'Dedicated portal': 'Персональний портал', 'Priority delivery': 'Пріоритетна реалізація', 'Monthly billing': 'Щомісячна оплата', 'Everything in Partner': 'Усе з Partner', 'Custom SLA': 'Індивідуальний SLA', 'Bulk pricing': 'Оптові ціни', 'Account manager': 'Менеджер акаунта', 'Quarterly strategy reviews': 'Щоквартальні стратегічні огляди',
};
const pt = (value: string, locale: string) => locale === 'uk' ? (pricingUk[value] ?? value) : value;

export default function PricingPage() {
  const { locale, localizePath: lp } = useLocale();
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: locale === 'uk' ? 'Ціни — вартість усіх послуг | Vladenza' : 'Pricing — All Service Prices | Vladenza',
    description: locale === 'uk' ? 'Прозорі ціни на всі послуги Vladenza: SEO-аудити, гостьові публікації, розміщення посилань, крауд-маркетинг, AI/LLM SEO, локальне SEO, LinkedIn і white-label пакети.' : 'Transparent pricing for every Vladenza service: SEO audits, guest posting, niche edits, crowd links, AI/LLM SEO, local SEO, LinkedIn, and white-label packages.',
    canonical: `https://vladenza.com${lp('/pricing')}`,
  });

  function openModal(service: string, price: string) {
    setSelectedPkg({ name: pt(service, locale), price: pt(price, locale), links: pt('See service page', locale), service: pt(service, locale) });
  }

  function openGenericModal() {
    setSelectedPkg({ name: pt('Custom Package', locale), price: pt('Custom', locale), links: pt('Get a quote', locale), service: pt('General Inquiry', locale) });
  }

  return (
    <>
      <Navigation onOpenModal={openGenericModal} />
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
            <Zap size={12} />
            {pt('Pricing', locale)}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
            {locale === 'uk' ? <>Усі послуги,<br /><span className="text-[#F97316]">один зрозумілий прайс</span></> : <>Every Service,<br /><span className="text-[#F97316]">One Clear Price List</span></>}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {pt('No hidden fees. No long-term lock-ins. Pick a service, choose a tier, and start your campaign within 5 business days.', locale)}
          </p>
        </div>
      </section>

      {/* Service pricing sections */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-16">
          {services.map((svc) => (
            <div key={svc.name} id={svc.name.toLowerCase().replace(/\s+/g, '-')}>
              {/* Service header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <svc.icon size={20} className="text-[#F97316]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{pt(svc.name, locale)}</h2>
                  <p className="text-gray-400 text-sm">{pt(svc.tagline, locale)}</p>
                </div>
                <a
                  href={lp(svc.href)}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
                >
                  {pt('Details', locale)} <ArrowRight size={13} />
                </a>
              </div>

              {/* Tiers */}
              <div className={`grid gap-5 ${svc.tiers.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
                {svc.tiers.map((tier) => (
                  <div
                    key={tier.label}
                    className={`rounded-2xl p-6 border transition-all duration-300 flex flex-col ${
                      tier.highlight
                        ? 'bg-white border-2 border-[#F97316]/40 shadow-lg shadow-[#F97316]/10 hover:shadow-xl hover:shadow-[#F97316]/15'
                        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    {tier.highlight && (
                      <div className="mb-4">
                        <span className="bg-[#F97316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {pt('Popular', locale)}
                        </span>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{pt(tier.label, locale)}</h3>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed">{pt(tier.desc, locale)}</p>
                    <div className="text-2xl font-black text-gray-900 mb-5">{pt(tier.price, locale)}</div>
                    <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                          <CheckCircle size={13} className="text-[#F97316] flex-shrink-0" />
                          {pt(f, locale)}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => openModal(svc.name, tier.price)}
                      className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        tier.highlight
                          ? 'bg-[#F97316] text-white hover:bg-[#EA580C] hover:shadow-md hover:shadow-orange-200'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {pt('Get Started', locale)}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {pt('Not sure which service fits?', locale)}
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            {pt("Tell us about your goals and we'll recommend the right mix of services for your campaign.", locale)}
          </p>
          <a
            href={lp('/#contact')}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-orange-900/30"
          >
            {pt('Get a Custom Proposal', locale)} <ArrowRight size={14} />
          </a>
        </div>
      </section>

      <Footer onOpenModal={openGenericModal} />
    </>
  );
}
