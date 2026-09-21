import { useState } from 'react';
import { Building2, TrendingUp, Star, ArrowRight, Clock, CheckCircle, PenTool, BarChart2, Users, Megaphone } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import OrderModal, { Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'LinkedIn Company Page Management — B2B Brand Growth | Vladenza',
      description: 'Professional LinkedIn company page management: content strategy, follower growth, and thought leadership. Turn your company page into a B2B lead generation engine.',
    },
    hero: {
      badge: 'Service — LinkedIn Company',
      title1: 'Turn Your Company Page',
      title2: 'Into a B2B Growth Engine',
      desc: 'Full-service LinkedIn company page management — from strategy and content to follower growth and lead generation.',
      cta: 'Get a Proposal',
      ctaBox: 'From $900/month',
    },
    stats: [
      { val: '5×', label: 'Avg. follower growth in 6 months' },
      { val: '200+', label: 'Company pages managed' },
      { val: '45 days', label: 'Average time to first inbound leads' },
      { val: '4.9★', label: 'Client satisfaction score' },
    ],
    features: [
      { icon: Building2, title: 'Company Page Optimisation', desc: 'Full audit and rewrite of your company page: tagline, about section, specialties, and visual assets — aligned with LinkedIn SEO best practices.' },
      { icon: PenTool, title: 'Content & Editorial Calendar', desc: 'Monthly content plan with company updates, product spotlights, industry news, and employee-spotlight posts to keep your page active and growing.' },
      { icon: Users, title: 'Follower Growth Campaigns', desc: 'Strategic employee advocacy, LinkedIn ads consultation, and organic promotion tactics to grow your company follower count with the right audience.' },
      { icon: Megaphone, title: 'Thought Leadership Posts', desc: 'Long-form articles and carousels published from the company page, positioning your brand as the go-to authority in your niche.' },
      { icon: BarChart2, title: 'Performance Reporting', desc: 'Monthly dashboards covering follower growth, post impressions, engagement rate, and audience demographics with actionable recommendations.' },
      { icon: TrendingUp, title: 'LinkedIn Ads Strategy', desc: 'Paid campaign strategy and creative briefs to amplify organic content, promote lead-gen forms, and retarget engaged followers.' },
    ],
    featuresSection: {
      badge: 'What\'s Included',
      title: 'End-to-end company page management',
      desc: 'We run your entire LinkedIn presence so your team can focus on closing deals.',
    },
    tiers: [
      {
        name: 'Foundation',
        subtitle: 'Establish your brand',
        price: '$900',
        period: '/month',
        features: [
          'Full company page optimisation',
          '8 branded posts per month',
          'Follower growth strategy',
          'Monthly analytics report',
          'Employee advocacy setup',
        ],
        highlight: false,
        popular: false,
      },
      {
        name: 'Scale',
        subtitle: 'Grow market presence',
        price: '$2,000',
        period: '/month',
        features: [
          'Everything in Foundation',
          '16 posts per month',
          'Carousel & document content',
          'Thought leadership articles',
          'Bi-weekly strategy calls',
          'LinkedIn Ads creative briefs',
        ],
        highlight: true,
        popular: true,
      },
      {
        name: 'Enterprise',
        subtitle: 'Dominate your industry',
        price: '$4,000',
        period: '/month',
        features: [
          'Everything in Scale',
          '24+ posts per month',
          'Newsletter management',
          'Live event promotion',
          'Full LinkedIn Ads management',
          'Dedicated account team',
        ],
        highlight: false,
        popular: false,
      },
    ],
    tiersSection: {
      badge: 'Packages',
      title: 'Plans for every stage of growth',
      desc: 'No long-term lock-ins. Start with what fits your budget, scale as results come in.',
      mostPopular: 'Most Popular',
      cta: 'Get Started',
    },
    process: [
      { num: '01', title: 'Brand Audit', desc: 'We analyse your current page, competitor presence, and target audience to build a tailored LinkedIn strategy.' },
      { num: '02', title: 'Page Overhaul', desc: 'Complete rewrite and visual refresh of your company page to maximise first impressions and search visibility.' },
      { num: '03', title: 'Content Launch', desc: 'We produce and publish branded content on a consistent schedule — no missed posts, no off-brand messaging.' },
      { num: '04', title: 'Growth & Optimise', desc: 'Continuous A/B testing of content formats, posting times, and targeting — with clear monthly reporting.' },
    ],
    processSection: {
      title: 'How it works',
      desc: 'Fully managed. You stay focused on your business — we handle everything on LinkedIn.',
    },
    testimonials: [
      { text: 'Our LinkedIn went from 800 followers to 6,000 in 5 months. The quality of inbound inquiries has been outstanding.', name: 'David M.', role: 'CEO, B2B SaaS' },
      { text: 'Vladenza made our company page look like a proper media brand. We get weekly messages from potential partners now.', name: 'Sarah L.', role: 'Head of Marketing, FinTech' },
      { text: 'We were invisible on LinkedIn before. Now we consistently rank in our niche and close deals sourced from the platform.', name: 'Tom B.', role: 'Founder, Consulting Firm' },
    ],
  },
  uk: {
    seo: {
      title: 'Просування сторінки компанії в LinkedIn — Зростання B2B-бренду | Vladenza',
      description: 'Професійне управління сторінкою компанії в LinkedIn: контент-стратегія, зростання підписників та thought leadership. Перетворіть вашу сторінку на B2B-двигун генерації лідів.',
    },
    hero: {
      badge: 'Послуга — LinkedIn Company',
      title1: 'Перетворіть сторінку компанії',
      title2: 'на B2B-двигун зростання',
      desc: 'Повне управління сторінкою компанії в LinkedIn — від стратегії та контенту до зростання підписників і генерації лідів.',
      cta: 'Отримати пропозицію',
      ctaBox: 'Від $900/місяць',
    },
    stats: [
      { val: '5×', label: 'Середнє зростання підписників за 6 місяців' },
      { val: '200+', label: 'Сторінок компаній під управлінням' },
      { val: '45 днів', label: 'Середній час до перших вхідних лідів' },
      { val: '4.9★', label: 'Оцінка задоволеності клієнтів' },
    ],
    features: [
      { icon: Building2, title: 'Оптимізація сторінки компанії', desc: 'Повний аудит та переписування сторінки компанії: теглайн, розділ «Про нас», спеціалізації та візуальні матеріали — за best practices LinkedIn SEO.' },
      { icon: PenTool, title: 'Контент та редакційний календар', desc: 'Щомісячний контент-план з оновленнями компанії, промо продуктів, галузевими новинами та дописами про співробітників для активності та зростання сторінки.' },
      { icon: Users, title: 'Кампанії зростання підписників', desc: 'Стратегічна адвокація співробітників, консультації з LinkedIn Ads та органічні тактики просування для зростання підписників з правильною аудиторією.' },
      { icon: Megaphone, title: 'Thought leadership дописи', desc: 'Довгі статті та каруселі, опубліковані зі сторінки компанії, що позиціонують ваш бренд як авторитет у ніші.' },
      { icon: BarChart2, title: 'Звітність про результати', desc: 'Щомісячні дашборди: зростання підписників, покази дописів, рівень взаємодії та демографія аудиторії з практичними рекомендаціями.' },
      { icon: TrendingUp, title: 'Стратегія LinkedIn Ads', desc: 'Стратегія платних кампаній та креативні брифи для підсилення органічного контенту, просування лід-форм та ретаргетингу залучених підписників.' },
    ],
    featuresSection: {
      badge: 'Що входить',
      title: 'Комплексне управління сторінкою компанії',
      desc: 'Ми ведемо всю вашу присутність у LinkedIn, щоб ваша команда могла зосередитись на закритті угод.',
    },
    tiers: [
      {
        name: 'Foundation',
        subtitle: 'Закріпіть ваш бренд',
        price: '$900',
        period: '/місяць',
        features: [
          'Повна оптимізація сторінки компанії',
          '8 брендованих дописів на місяць',
          'Стратегія зростання підписників',
          'Щомісячний аналітичний звіт',
          'Налаштування адвокації співробітників',
        ],
        highlight: false,
        popular: false,
      },
      {
        name: 'Scale',
        subtitle: 'Зростайте ринкову присутність',
        price: '$2,000',
        period: '/місяць',
        features: [
          'Усе з Foundation',
          '16 дописів на місяць',
          'Контент карусель та документи',
          'Thought leadership статті',
          'Двотижневі стратегічні дзвінки',
          'Креативні брифи LinkedIn Ads',
        ],
        highlight: true,
        popular: true,
      },
      {
        name: 'Enterprise',
        subtitle: 'Домінуйте у вашій галузі',
        price: '$4,000',
        period: '/місяць',
        features: [
          'Усе з Scale',
          '24+ дописів на місяць',
          'Управління розсилкою',
          'Промо живих івентів',
          'Повне управління LinkedIn Ads',
          'Виділена команда акаунту',
        ],
        highlight: false,
        popular: false,
      },
    ],
    tiersSection: {
      badge: 'Пакети',
      title: 'Плани для кожного етапу зростання',
      desc: 'Без довгострокових зобовʼязань. Почніть з того, що підходить вашому бюджету, масштабуйтесь, коли приййдуть результати.',
      mostPopular: 'Найпопулярніший',
      cta: 'Почати',
    },
    process: [
      { num: '01', title: 'Аудит бренду', desc: 'Ми аналізуємо вашу поточну сторінку, присутність конкурентів та цільову аудиторію для побудови індивідуальної LinkedIn-стратегії.' },
      { num: '02', title: 'Оновлення сторінки', desc: 'Повне переписування та візуальне оновлення сторінки компанії для максимального першого враження та пошукової видимості.' },
      { num: '03', title: 'Запуск контенту', desc: 'Ми створюємо та публікуємо брендований контент за стабільним графіком — без пропущених дописів, без поза-брендових меседжів.' },
      { num: '04', title: 'Зростання та оптимізація', desc: 'Безперервне A/B-тестування форматів контенту, часу публікації та таргетингу — із чіткою щомісячною звітністю.' },
    ],
    processSection: {
      title: 'Як це працює',
      desc: 'Повністю під управлінням. Ви зосереджені на бізнесі — ми беремо на себе все в LinkedIn.',
    },
    testimonials: [
      { text: 'Наш LinkedIn зріс з 800 підписників до 6,000 за 5 місяців. Якість вхідних запитів була видатною.', name: 'David M.', role: 'CEO, B2B SaaS' },
      { text: 'Vladenza зробив нашу сторінку компанії схожою на справжній медіа-бренд. Тепер щотижня отримуємо повідомлення від потенційних партнерів.', name: 'Sarah L.', role: 'Head of Marketing, FinTech' },
      { text: 'Раніше ми були невидимі в LinkedIn. Тепер стабільно ранжуємо в нашій ніші та закриваємо угоди з платформи.', name: 'Tom B.', role: 'Засновник, консалтингова фірма' },
    ],
  },
} as const;

export default function LinkedInCompanyPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/linkedin-company')}`,
  });

  function openTier(tier: typeof c.tiers[number]) {
    setSelectedPkg({
      name: tier.name,
      price: tier.price + tier.period,
      links: tier.subtitle,
      service: 'LinkedIn Company',
    });
  }

  function openDefault() {
    setSelectedPkg({
      name: locale === 'uk' ? 'Сторінка компанії в LinkedIn' : 'LinkedIn Company',
      price: locale === 'uk' ? 'Від $900/міс' : 'From $900/mo',
      links: locale === 'uk' ? 'Отримати пропозицію' : 'Get a proposal',
      service: 'LinkedIn Company',
    });
  }

  return (
    <ServicePageLayout defaultService="LinkedIn Company">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="400" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="280" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="160" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`lic-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Building2 size={12} />
              {c.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-gray-900 leading-[1.08] tracking-tight mb-6">
              {c.hero.title1}<br />
              <span className="text-[#F97316]">{c.hero.title2}</span>
            </h1>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-xl">
              {c.hero.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={openDefault} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-orange-200 flex items-center gap-2">
                {c.hero.cta} <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                <Clock size={14} className="text-[#F97316]" />
                {c.hero.ctaBox}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.featuresSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.featuresSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{c.featuresSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.features.map((f) => (
              <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-[#F97316]/20 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-[#F97316] transition-colors">
                  <f.icon size={18} className="text-[#F97316] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {c.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white mb-1">{s.val}</div>
                <div className="text-gray-400 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-4">
              {c.tiersSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{c.tiersSection.title}</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">{c.tiersSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {c.tiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-2xl border overflow-hidden ${tier.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-[#1a1a1a] border-white/10'}`}>
                {tier.popular && (
                  <div className="bg-white text-[#F97316] text-[10px] font-black uppercase tracking-widest text-center py-2 border-b border-[#F97316]/30">
                    {c.tiersSection.mostPopular}
                  </div>
                )}
                <div className="p-7">
                  <h3 className="text-2xl font-black text-white mb-1">{tier.name}</h3>
                  <p className={`text-sm mb-6 ${tier.highlight ? 'text-orange-100' : 'text-gray-400'}`}>{tier.subtitle}</p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-5xl font-black text-white">{tier.price}</span>
                    <span className={`text-sm ${tier.highlight ? 'text-orange-100' : 'text-gray-400'}`}>{tier.period}</span>
                  </div>
                  <div className={`h-px my-6 ${tier.highlight ? 'bg-white/30' : 'bg-white/10'}`} />
                  <div className="flex flex-col gap-3 mb-8">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${tier.highlight ? 'text-white' : 'text-[#F97316]'}`} />
                        <span className={`text-sm leading-snug ${tier.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => openTier(tier)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all duration-200 ${tier.highlight ? 'bg-white text-[#F97316] hover:bg-gray-50' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                  >
                    {c.tiersSection.cta} <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.processSection.title}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{c.processSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.process.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto mb-4 text-[#F97316] font-black text-sm">
                  {step.num}
                </div>
                <h4 className="text-gray-900 font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-5">
            {c.testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-[#F97316] text-[#F97316]" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
    </ServicePageLayout>
  );
}
