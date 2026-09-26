import { useState } from 'react';
import { Users, TrendingUp, Star, ArrowRight, Clock, CheckCircle, PenTool, BarChart2, MessageCircle, Award } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import OrderModal, { Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'LinkedIn Personal Branding Service — Profile Growth & Content | Vladenza',
      description: 'Grow your personal LinkedIn brand with expert profile optimisation, content strategy, and audience building. Become a recognised voice in your industry.',
    },
    hero: {
      badge: 'Service — LinkedIn Personal',
      title1: 'Build Your Personal',
      title2: 'LinkedIn Authority',
      desc: 'From profile optimisation to daily content — we turn your LinkedIn into a lead-generating personal brand that attracts the right people.',
      cta: 'Start Growing',
      ctaBox: 'From $700/month',
    },
    stats: [
      { val: '3×', label: 'Avg. profile view increase' },
      { val: '10k+', label: 'Followers grown for clients' },
      { val: '60 days', label: 'Average time to first leads' },
      { val: '4.9★', label: 'Client satisfaction score' },
    ],
    features: [
      { icon: PenTool, title: 'Profile Optimisation', desc: 'Keyword-rich headline, about section, and experience entries written by LinkedIn SEO specialists to maximise search visibility and profile views.' },
      { icon: TrendingUp, title: 'Content Strategy', desc: 'A bespoke monthly posting calendar with hooks, carousels, and thought-leadership posts crafted to grow your follower count and impressions.' },
      { icon: Users, title: 'Audience Building', desc: 'Targeted connection campaigns to relevant decision-makers, industry peers, and potential clients in your niche.' },
      { icon: MessageCircle, title: 'Engagement Management', desc: 'We comment, reply, and engage on your behalf to boost post reach and keep your profile algorithmically active.' },
      { icon: BarChart2, title: 'Monthly Analytics', desc: 'Clear reporting on profile views, post impressions, follower growth, and inbound connection quality every month.' },
      { icon: Award, title: 'Creator Mode Setup', desc: 'Full CreatorMode activation and optimisation including Featured section, link-in-bio, and hashtag strategy.' },
    ],
    featuresSection: {
      badge: 'What\'s Included',
      title: 'Everything your profile needs to grow',
      desc: 'A full-service LinkedIn growth system — we handle the strategy, content, and daily execution.',
    },
    tiers: [
      {
        name: 'Essential',
        subtitle: 'Profile + content foundation',
        price: '$700',
        period: '/month',
        features: [
          'Full profile overhaul — all sections',
          'Custom banner & featured section design',
          '2 posts per week with designed visuals',
          'Monthly content calendar (approval included)',
          'Basic keyword & hashtag optimisation',
          'Monthly performance report',
          'Async Slack / email communication',
        ],
        highlight: false,
        popular: false,
      },
      {
        name: 'Growth',
        subtitle: 'Full management + daily engagement',
        price: '$1,500',
        period: '/month',
        features: [
          'Everything in Essential',
          '3 posts per week with designed visuals',
          'Daily commenting on 10 targeted creators',
          'Personalised connection requests (15/day)',
          'Personalised DMs to new connections',
          'Replies to all post comments managed',
          'Bi-weekly strategy check-in call',
        ],
        highlight: true,
        popular: true,
      },
      {
        name: 'Authority',
        subtitle: 'Maximum reach & lead generation',
        price: '$3,000',
        period: '/month',
        features: [
          'Everything in Growth',
          '5 posts per week — text, carousel & video scripts',
          'Daily commenting on 25+ targeted creators',
          'Connection requests + InMail outreach (30/day)',
          'Lead tracking: who engaged, who connected',
          'Weekly performance report + strategy call',
          'Dedicated senior account manager',
        ],
        highlight: false,
        popular: false,
      },
    ],
    tiersSection: {
      badge: 'Packages',
      title: 'Pick your growth plan',
      desc: 'All plans include full profile optimisation and a dedicated content strategist.',
      mostPopular: 'Most Popular',
      cta: 'Get Started',
      footnote: 'All plans are monthly retainers. Cancel anytime with 30 days notice. Setup fee waived for annual plans.',
    },
    process: [
      { num: '01', title: 'Discovery Call', desc: 'We learn your goals, industry, target audience, and current LinkedIn standing in a 30-min onboarding session.' },
      { num: '02', title: 'Profile Overhaul', desc: 'Full rewrite of your profile to rank in LinkedIn search and convert visitors into connections and leads.' },
      { num: '03', title: 'Content Production', desc: 'Our writers produce scroll-stopping posts tailored to your voice, industry, and audience preferences.' },
      { num: '04', title: 'Growth & Reporting', desc: 'Daily publishing, engagement, and connection activity — with clear monthly reports on every metric that matters.' },
    ],
    processSection: {
      badge: 'How It Works',
      title: 'Fully managed from day one',
      desc: 'No briefings, no guesswork — we handle everything.',
    },
    testimonials: {
      title: 'What clients say',
      desc: 'Real results from real people.',
      items: [
        { text: 'Within 3 months my profile views tripled and I started getting inbound messages from Fortune 500 recruiters.', name: 'James R.', role: 'Founder, SaaS startup' },
        { text: 'Vladenza turned my dead LinkedIn into a consistent source of qualified leads. ROI was clear within 60 days.', name: 'Maria T.', role: 'B2B Consultant' },
        { text: 'The content quality is incredible — posts sound exactly like me but better. Follower count grew 4× in 4 months.', name: 'Alex K.', role: 'Executive Coach' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'Просування особистого бренду в LinkedIn — Зростання профілю та контент | Vladenza',
      description: 'Розвивайте свій особистий бренд у LinkedIn з експертною оптимізацією профілю, контент-стратегією та побудовою аудиторії. Станьте визнаним голосом у вашій галузі.',
    },
    hero: {
      badge: 'Послуга — LinkedIn Personal',
      title1: 'Будуйте ваш особистий',
      title2: 'авторитет у LinkedIn',
      desc: 'Від оптимізації профілю до щоденного контенту — ми перетворюємо ваш LinkedIn на генеруючий ліди особистий бренд, що приваблює потрібних людей.',
      cta: 'Почати зростання',
      ctaBox: 'Від $700/місяць',
    },
    stats: [
      { val: '3×', label: 'Середнє зростання переглядів профілю' },
      { val: '10k+', label: 'Підписників, вирощених для клієнтів' },
      { val: '60 днів', label: 'Середній час до перших лідів' },
      { val: '4.9★', label: 'Оцінка задоволеності клієнтів' },
    ],
    features: [
      { icon: PenTool, title: 'Оптимізація профілю', desc: 'Заголовок, розділ «Про себе» та опис досвіду, насичені ключовими словами, написані LinkedIn SEO-спеціалістами для максимальної пошукової видимості та переглядів профілю.' },
      { icon: TrendingUp, title: 'Контент-стратегія', desc: 'Індивідуальний місячний календар постингу з гачками, каруселями та thought-leadership дописами, розробленими для зростання підписників та показів.' },
      { icon: Users, title: 'Побудова аудиторії', desc: 'Цільові кампанії зʼєднань з релевантними приймачами рішень, колегами по галузі та потенційними клієнтами у вашій ніші.' },
      { icon: MessageCircle, title: 'Управління взаємодією', desc: 'Ми коментуємо, відповідаємо та взаємодієємо від вашого імені, щоб підняти охват дописів та тримати ваш профіль алгоритмічно активним.' },
      { icon: BarChart2, title: 'Щомісячна аналітика', desc: 'Чіткі звіти про перегляди профілю, покази дописів, зростання підписників та якість вхідних зʼєднань щомісяця.' },
      { icon: Award, title: 'Налаштування Creator Mode', desc: 'Повна активація та оптимізація CreatorMode, включно з розділом Featured, link-in-bio та стратегією хештегів.' },
    ],
    featuresSection: {
      badge: 'Що входить',
      title: 'Усе, що потрібно вашому профілю для зростання',
      desc: 'Повноцінна система зростання в LinkedIn — ми беремо на себе стратегію, контент та щоденне виконання.',
    },
    tiers: [
      {
        name: 'Essential',
        subtitle: 'Профіль + контентна основа',
        price: '$700',
        period: '/місяць',
        features: [
          'Повне оновлення профілю — усі розділи',
          'Кастомний банер та дизайн розділу Featured',
          '2 дописи на тиждень з дизайн-візуалами',
          'Щомісячний контент-календар (з погодженням)',
          'Базова оптимізація ключових слів та хештегів',
          'Щомісячний звіт про результати',
          'Асинхронна комунікація через Slack / email',
        ],
        highlight: false,
        popular: false,
      },
      {
        name: 'Growth',
        subtitle: 'Повне управління + щоденна взаємодія',
        price: '$1,500',
        period: '/місяць',
        features: [
          'Усе з Essential',
          '3 дописи на тиждень з дизайн-візуалами',
          'Щоденні коментарі на 10 цільових авторів',
          'Персоналізовані запити на зʼєднання (15/день)',
          'Персоналізовані DM новим зʼєднанням',
          'Відповіді на всі коментарі під дописами',
          'Двотижневий стратегічний дзвінок',
        ],
        highlight: true,
        popular: true,
      },
      {
        name: 'Authority',
        subtitle: 'Максимальний охват та генерація лідів',
        price: '$3,000',
        period: '/місяць',
        features: [
          'Усе з Growth',
          '5 дописів на тиждень — текст, карусель та відео-сценарії',
          'Щоденні коментарі на 25+ цільових авторів',
          'Запити на зʼєднання + InMail аутріч (30/день)',
          'Відстеження лідів: хто взаємодіяв, хто зʼєднався',
          'Щотижневий звіт + стратегічний дзвінок',
          'Персональний старший акаунт-менеджер',
        ],
        highlight: false,
        popular: false,
      },
    ],
    tiersSection: {
      badge: 'Пакети',
      title: 'Оберіть план зростання',
      desc: 'Усі плани включають повну оптимізацію профілю та виділеного контент-стратега.',
      mostPopular: 'Найпопулярніший',
      cta: 'Почати',
      footnote: 'Усі плани — щомісячні ретейнери. Скасування будь-коли за 30 днів. Плату за онбординг знижено для річних планів.',
    },
    process: [
      { num: '01', title: 'Ознайомчий дзвінок', desc: 'Ми вивчаємо ваші цілі, галузь, цільову аудиторію та поточний стан LinkedIn у 30-хв сесії онбордингу.' },
      { num: '02', title: 'Оновлення профілю', desc: 'Повне переписування профілю для ранжування в пошуку LinkedIn та конверсії відвідувачів у зʼєднання та ліди.' },
      { num: '03', title: 'Створення контенту', desc: 'Наші автори створюють дописи, що зупиняють скрол, під ваш голос, галузь та вподобання аудиторії.' },
      { num: '04', title: 'Зростання та звітність', desc: 'Щоденна публікація, взаємодія та активність зʼєднань — із чіткими щомісячними звітами по кожній важливій метриці.' },
    ],
    processSection: {
      badge: 'Як це працює',
      title: 'Повністю під управлінням з першого дня',
      desc: 'Без брифів, без вгадування — ми беремо на себе все.',
    },
    testimonials: {
      title: 'Що кажуть клієнти',
      desc: 'Реальні результати від реальних людей.',
      items: [
        { text: 'За 3 місяці перегляди мого профілю потроїлись, і я почав отримувати вхідні повідомлення від рекрутерів Fortune 500.', name: 'James R.', role: 'Засновник, SaaS-стартап' },
        { text: 'Vladenza перетворив мій мертвий LinkedIn на стабільне джерело кваліфікованих лідів. ROI став очевидним за 60 днів.', name: 'Maria T.', role: 'B2B-консультант' },
        { text: 'Якість контенту неймовірна — дописи звучать точно як я, але краще. Кількість підписників зросла в 4× за 4 місяці.', name: 'Alex K.', role: 'Executive Coach' },
      ],
    },
  },
} as const;

export default function LinkedInPersonalPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/linkedin-personal')}/`,
    noindex: true,
  });

  function openTier(tier: typeof c.tiers[number]) {
    setSelectedPkg({
      name: tier.name,
      price: tier.price + tier.period,
      links: tier.subtitle,
      service: 'LinkedIn Personal',
    });
  }

  function openDefault() {
    setSelectedPkg({
      name: locale === 'uk' ? 'LinkedIn Personal' : 'LinkedIn Personal',
      price: locale === 'uk' ? 'Від $700/міс' : 'From $700/mo',
      links: locale === 'uk' ? 'Отримати пропозицію' : 'Get a proposal',
      service: 'LinkedIn Personal',
    });
  }

  return (
    <ServicePageLayout defaultService="LinkedIn Personal">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="80" r="400" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="80" r="280" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="80" r="160" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`li-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 220} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Users size={12} />
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

      {/* Stats */}
      <section className="py-12 bg-gray-950 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {c.stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white mb-1">{s.val}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
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
          <p className="text-center text-gray-600 text-xs mt-8">{c.tiersSection.footnote}</p>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.processSection.badge}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.processSection.title}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{c.processSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.process.map((step, i) => (
              <div key={step.num} className="relative">
                {i < c.process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(50%+24px)] right-[-calc(50%-24px)] h-px bg-gray-100 w-[calc(100%-48px)]" />
                )}
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto mb-4 text-[#F97316] font-black text-sm relative z-10">
                    {step.num}
                  </div>
                  <h4 className="text-gray-900 font-semibold text-sm mb-2">{step.title}</h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{c.testimonials.title}</h2>
            <p className="text-gray-500 text-sm">{c.testimonials.desc}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {c.testimonials.items.map((t) => (
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
