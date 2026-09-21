import { Users, MessageSquare, Globe, Globe as Globe2, TrendingUp, CheckCircle, ArrowRight, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import PlacementExplorer from '../components/PlacementExplorer';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'Buy Crowd Links — Forum Marketing Service | Vladenza',
      description: 'Buy crowd links — natural forum, Reddit, and Quora placements from aged accounts. Spam-safe crowd marketing service across 50+ platforms.',
    },
    hero: {
      badge: 'Link Building Service',
      title: 'Crowd Link Building',
      subtitle: 'Forum & community links built at scale, done right.',
      desc: 'Crowd marketing links from forums, Q&A platforms, and niche communities — posted naturally by real account operators to build referral trust and domain diversity.',
      fromPrice: 'From $290',
      delivery: '5–10 day delivery',
      platforms: '50+ platforms',
      cta: 'Choose Your Market',
      ctaBox: 'From $290 · Delivered in 5–10 days',
    },
    features: [
      { icon: MessageSquare, title: 'Niche-Topic Content', desc: 'Every placement is wrapped in a relevant topic that matches your target keywords — so links reinforce keyword visibility, not just pass equity.' },
      { icon: Globe, title: 'Large Forum Database', desc: 'We maintain a large, constantly updated base of forums and community platforms across all major niches — giving your campaign genuine placement variety.' },
      { icon: Users, title: 'Keyword Visibility Focus', desc: 'Crowd links are placed in topically relevant threads and discussions specifically chosen to support your target search terms and improve their rankings.' },
      { icon: Shield, title: 'Spam-Safe Placement', desc: 'Contributions are written to add real value to the conversation, not just drop links. This reduces removal rates and protects your brand.' },
      { icon: TrendingUp, title: 'Referral Traffic Bonus', desc: 'Quality crowd links often drive direct referral traffic in addition to passing link equity — a dual benefit for competitive niches.' },
      { icon: Zap, title: 'Fast Turnaround', desc: 'Crowd campaigns are deployed within 5–10 days. No outreach cycles, no waiting on editorial approvals.' },
    ],
    featuresSection: {
      badge: 'How We Do It',
      title: 'Not spam — genuine community presence',
      desc: 'Anyone can blast links. We build credibility through context-appropriate contributions that survive moderation and earn referrals.',
    },
    packages: {
      badge: 'Packages',
      title: 'Choose your language market',
      desc: 'Each market has its own platforms, moderation norms, and conversational tone. Pick yours to see packages, pricing, and details.',
      markets: [
        { code: 'english', label: 'English', note: 'US, UK & global — deepest inventory' },
        { code: 'spanish', label: 'Spanish', note: 'Spain & Latin America' },
        { code: 'german', label: 'German', note: 'DACH region — quality-first' },
        { code: 'french', label: 'French', note: 'France, Belgium & Quebec' },
        { code: 'portuguese', label: 'Portuguese (Brazil)', note: 'Fast-growing, high engagement' },
        { code: 'korean', label: 'Korean', note: 'Naver Cafe & Korean communities' },
      ],
      fromPrice: 'From $290',
      viewPackages: 'View Packages',
      includedLabel: "What's included in every market's packages",
      included: [
        'Indexator processing (~60% avg index rate)',
        'Manual review of every single link before delivery',
        'One unique domain per link — no domain repeats',
        'Niche-matched topics only — no off-topic placements',
        'Full detailed report with all URLs and anchors',
        'Replacement guarantee for removed links',
        'Natural even placement over the campaign period',
        'Tier-2 links as an additional layer of link equity',
      ],
      footer: 'Works for all niches · Best for link profile diversification & early-stage link building',
      resultsNote: 'Results typically visible within 2–3 weeks of delivery.',
    },
    useCases: {
      badge: 'Niches',
      title: 'Niche-matched topics by vertical',
      desc: 'Every placement is wrapped in a relevant topic context — so links reinforce your target keywords, not just pass equity.',
      cases: [
        { niche: 'iGaming & Betting', desc: 'Topics around casino strategies, sports betting picks, affiliate comparisons, and bonus reviews — to rank iGaming money pages.' },
        { niche: 'SaaS & Tech', desc: 'Topics covering tool comparisons, productivity workflows, software recommendations, and integration guides — to lift non-brand SaaS keywords.' },
        { niche: 'Health & Wellness', desc: 'Topics on supplement stacks, fitness protocols, wellness routines, and product comparisons — to push health and review pages up.' },
        { niche: 'Finance & Crypto', desc: 'Topics on DeFi strategies, trading platforms, personal finance tips, and crypto project reviews — to rank finance and crypto landing pages.' },
        { niche: 'Automotive', desc: 'Topics on car care, model comparisons, aftermarket parts, and detailing guides — to rank automotive service and review pages.' },
        { niche: 'E-commerce', desc: 'Topics on product reviews, buying guides, deal roundups, and brand comparisons — to push category and product pages higher.' },
      ],
    },
    placements: {
      title: 'Real Crowd Link Examples',
      desc: 'Examples from completed orders across forums and community platforms.',
      viewAll: 'View All Crowd Link Examples',
    },
    seoBlock: {
      heading: 'Crowd links: natural signals from forums and communities',
      intro: 'Crowd marketing places your brand inside real conversations on forums, Q&A sites, and communities like Reddit and Quora. These links diversify your profile with the kind of organic, user-generated signals that look natural to Google — and increasingly help AI search engines understand how real people discuss your brand.',
      body: [
        "The value of crowd links is not raw authority — it is diversity, referral traffic, and context. We post from aged, trusted accounts and contribute genuinely useful answers, so mentions are accepted and stick instead of being removed as spam. Coverage spans 50+ relevant platforms per niche.",
        "Crowd links work best as a support layer beneath stronger placements. Combine them with [guest posting](/services/guest-posting) and [niche edits](/services/niche-edits) for a balanced, penalty-safe profile. Learn how we [scale crowd marketing without penalties](/blog/crowd-marketing-scale-without-penalty) in our guide.",
        "Curious about results? Our [case studies](/case-studies) show how diversified link profiles — including crowd signals — supported ranking and traffic growth across competitive niches.",
      ],
      faqs: [
        { q: 'What are crowd links?', a: 'Crowd links are backlinks and brand mentions placed within forums, Q&A platforms, and online communities as part of natural, helpful discussion — a technique often called crowd marketing.' },
        { q: 'Are crowd links safe for SEO?', a: 'Yes. Because they are placed as genuine contributions from aged accounts across many platforms, they create a natural, diversified signal rather than a spammy footprint.' },
        { q: 'Do crowd links pass authority?', a: 'Their main value is profile diversity, referral traffic, and contextual relevance rather than raw link equity. They complement high-authority placements like guest posts and niche edits.' },
        { q: 'How many platforms do you cover?', a: 'We work across 50+ relevant platforms per niche, choosing communities where your audience is genuinely active.' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'Купити крауд-посилання — Форум-маркетинг | Vladenza',
      description: 'Купіть крауд-посилання — натуральні розміщення на форумах, Reddit та Quora з вікових акаунтів. Безпечна крауд-маркетинг послуга на 50+ платформах.',
    },
    hero: {
      badge: 'Послуга лінкбілдингу',
      title: 'Лінкбілдинг через крауд-посилання',
      subtitle: 'Форумні та спільнотні посилання масштабно, але якісно.',
      desc: 'Крауд-маркетинг посилання з форумів, Q&A-платформ та нішевих спільнот — розміщені органічно реальними операторами акаунтів для довіри та різноманітності доменів.',
      fromPrice: 'Від $290',
      delivery: 'Доставка 5–10 днів',
      platforms: '50+ платформ',
      cta: 'Оберіть ваш ринок',
      ctaBox: 'Від $290 · Доставка 5–10 днів',
    },
    features: [
      { icon: MessageSquare, title: 'Нішевий контент', desc: 'Кожне розміщення обгорнуто релевантною темою, що відповідає вашим цільовим ключовим словам — щоб посилання посилювали видимість за ключовими словами, а не лише передавали вагу.' },
      { icon: Globe, title: 'Велика база форумів', desc: 'Ми підтримуємо велику, оновлювану базу форумів та спільнотних платформ у всіх основних нішах — забезпечуючи справжню різноманітність розміщень.' },
      { icon: Users, title: 'Фокус на видимості ключових слів', desc: 'Крауд-посилання розміщуються в тематично релевантних тредах та обговореннях, спеціально обраних для підтримки ваших цільових пошукових термінів.' },
      { icon: Shield, title: 'Безпечне від спаму розміщення', desc: 'Внески пишуться, щоб додати реальну цінність обговоренню, а не лише лишити посилання. Це знижує рівень видалень і захищає ваш бренд.' },
      { icon: TrendingUp, title: 'Реферальний трафік', desc: 'Якісні крауд-посилання часто генерують прямий реферальний трафік додатково до передачі лінк-ваги — подвійна вигода для конкурентних ніш.' },
      { icon: Zap, title: 'Швидке виконання', desc: 'Крауд-кампанії розгортаються за 5–10 днів. Без циклів аутрічу, без очікування редакторських погоджень.' },
    ],
    featuresSection: {
      badge: 'Як ми це робимо',
      title: 'Не спам — справжня присутність у спільноті',
      desc: 'Будь-хто може розсипати посилання. Ми будуємо довіру через контекстні внески, які проходять модерацію і заробляють реферали.',
    },
    packages: {
      badge: 'Пакети',
      title: 'Оберіть мовний ринок',
      desc: 'Кожен ринок має власні платформи, норми модерації та тон спілкування. Оберіть свій, щоб побачити пакети, ціни та деталі.',
      markets: [
        { code: 'english', label: 'Англійська', note: 'США, Велика Британія та глобал — найбільший вибір' },
        { code: 'spanish', label: 'Іспанська', note: 'Іспанія та Латинська Америка' },
        { code: 'german', label: 'Німецька', note: 'Регіон DACH — фокус на якість' },
        { code: 'french', label: 'Французька', note: 'Франція, Бельгія та Квебек' },
        { code: 'portuguese', label: 'Португальська (Бразилія)', note: 'Швидкозростаюча, висока залученість' },
        { code: 'korean', label: 'Корейська', note: 'Naver Cafe та корейські спільноти' },
      ],
      fromPrice: 'Від $290',
      viewPackages: 'Переглянути пакети',
      includedLabel: 'Що входить у пакети кожного ринку',
      included: [
        'Обробка через Indexator (~60% середня індексація)',
        'Ручна перевірка кожного посилання перед доставкою',
        'Один унікальний домен на посилання — без повторів',
        'Лише нішеві теми — без нерелевантних розміщень',
        'Повний детальний звіт з усіма URL та анкорами',
        'Гарантія заміни видалених посилань',
        'Натуральний рівномірний розподіл протягом кампанії',
        'Tier-2 посилання як додатковий шар лінк-ваги',
      ],
      footer: 'Працює для всіх ніш · Найкраще для диверсифікації профілю посилань та раннього лінкбілдингу',
      resultsNote: 'Результати зазвичай видно протягом 2–3 тижнів після доставки.',
    },
    useCases: {
      badge: 'Ніші',
      title: 'Нішеві теми за вертикалями',
      desc: 'Кожне розміщення обгорнуто релевантним контекстом теми — щоб посилання посилювали цільові ключові слова, а не лише передавали вагу.',
      cases: [
        { niche: 'iGaming та ставки', desc: 'Теми про казино-стратегії, спортивні прогнози, порівняння афіліатів та огляди бонусів — для ранжування iGaming-сторінок.' },
        { niche: 'SaaS та Tech', desc: 'Теми про порівняння інструментів, робочі процеси, рекомендації ПЗ та гайди з інтеграцій — для підняття небрендових SaaS-ключових слів.' },
        { niche: 'Health та Wellness', desc: 'Теми про добавки, фітнес-протоколи, рутини та порівняння продуктів — для просування health та review-сторінок.' },
        { niche: 'Фінанси та Crypto', desc: 'Теми про DeFi-стратегії, торгові платформи, фінпоради та огляди криптопроєктів — для ранжування фінансових та crypto-сторінок.' },
        { niche: 'Автомобілі', desc: 'Теми про догляд за авто, порівняння моделей, тюнінг та гайди з детейлінгу — для ранжування автомобільних сторінок.' },
        { niche: 'E-commerce', desc: 'Теми про огляди продуктів, гайди з покупки, добірки знижок та порівняння брендів — для просування категорійних сторінок.' },
      ],
    },
    placements: {
      title: 'Реальні приклади крауд-посилань',
      desc: 'Приклади з виконаних замовлень на форумах та спільнотних платформах.',
      viewAll: 'Усі приклади крауд-посилань',
    },
    seoBlock: {
      heading: 'Крауд-посилання: натуральні сигнали з форумів та спільнот',
      intro: 'Крауд-маркетинг розміщує ваш бренд усередині реальних обговорень на форумах, Q&A-сайтах та спільнотах на кшталт Reddit і Quora. Ці посилання диверсифікують ваш профіль органічними, користувацькими сигналами, які виглядають натуральними для Google — і дедалі більше допомагають AI-пошуковикам розуміти, як реальні люди обговорюють ваш бренд.',
      body: [
        "Цінність крауд-посилань — не в сирий авторитетності, а в різноманітті, реферальному трафіку та контексті. Ми пишемо з вікових, довірених акаунтів і даємо дійсно корисні відповіді, тож згадки приймаються та залишаються, а не видаляються як спам. Покриття — 50+ релевантних платформ на нішу.",
        "Крауд-посилання працюють найкраще як підтримуючий шар під сильнішими розміщеннями. Поєднуйте їх із [гостьовими публікаціями](/services/guest-posting) та [нішевими едитами](/services/niche-edits) для збалансованого, безпечного профілю. Дивіться наш гайд, [як масштабувати крауд-маркетинг без штрафів](/blog/crowd-marketing-scale-without-penalty).",
        "Цікаво про результати? Наші [кейс-стаді](/case-studies) показують, як диверсифіковані профілі посилань — включно з крауд-сигналами — підтримали зростання ранжування та трафіку в конкурентних нішах.",
      ],
      faqs: [
        { q: 'Що таке крауд-посилання?', a: 'Крауд-посилання — це беклінки та згадки бренду, розміщені на форумах, Q&A-платформах та онлайн-спільнотах як частина натурального, корисного обговорення — техніка, яку часто називають крауд-маркетингом.' },
        { q: 'Чи безпечні крауд-посилання для SEO?', a: 'Так. Оскільки вони розміщуються як реальні внески з вікових акаунтів на багатьох платформах, вони створюють натуральний, диверсифікований сигнал, а не спам-слід.' },
        { q: 'Чи передають крауд-посилання авторитетність?', a: 'Їхня головна цінність — різноманітність профілю, реферальний трафік та контекстна релевантність, а не сирий лінк-еквітет. Вони доповнюють авторитетні розміщення на кшталт гостьових публікацій та нішевих едитів.' },
        { q: 'Скільки платформ ви покриваєте?', a: 'Ми працюємо на 50+ релевантних платформах на нішу, обираючи спільноти, де ваша аудиторія дійсно активна.' },
      ],
    },
  },
} as const;

export default function CrowdLinksPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/\]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/crowd-links')}`,
  });

  return (
    <ServicePageLayout>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-10 lg:pt-12 lg:pb-12">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">{c.hero.badge}</p>
            <h1 className="text-[28px] md:text-4xl lg:text-[40px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-4">
              {c.hero.title}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed mb-2 font-semibold">
              {c.hero.subtitle}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-lg">
              {c.hero.desc}
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="text-sm font-bold text-gray-900">{c.hero.fromPrice}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-500">{c.hero.delivery}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="text-sm text-gray-500">{c.hero.platforms}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="#languages"
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                {c.hero.cta} <ArrowRight size={14} />
              </a>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
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

      {/* Packages — by language market */}
      <section id="languages" className="py-20 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-4">
              {c.packages.badge}
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">{c.packages.title}</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">{c.packages.desc}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.packages.markets.map((l) => (
              <a
                key={l.code}
                href={lp(`/services/crowd-links/${l.code}`)}
                className="group bg-[#161616] border border-white/10 hover:border-[#F97316]/50 rounded-2xl p-6 flex flex-col transition-all duration-200"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Globe2 size={16} className="text-[#F97316]" />
                  <h3 className="text-lg font-bold text-white">{l.label}</h3>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-5 flex-1">{l.note}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{c.packages.fromPrice}</span>
                  <span className="text-[#F97316] text-xs font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                    {c.packages.viewPackages} <ArrowRight size={12} />
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* What's included checklist */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-7">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">{c.packages.includedLabel}</p>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-3">
              {c.packages.included.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={14} className="flex-shrink-0 text-[#F97316] mt-0.5" />
                  <span className="text-sm text-gray-300 leading-snug">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <span className="text-xs text-gray-500">{c.packages.footer}</span>
            </div>
          </div>

          <p className="text-center text-gray-600 text-xs mt-6">{c.packages.resultsNote}</p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.useCases.badge}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.useCases.title}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto">{c.useCases.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.useCases.cases.map((uc) => (
              <div key={uc.niche} className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                  <h4 className="text-gray-900 font-semibold text-sm">{uc.niche}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Examples */}
      <section id="placements" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.placements.title}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            {c.placements.desc}
          </p>
          <PlacementExplorer serviceType="crowd_link" />
          <div className="mt-8">
            <Link to={lp('/placements')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {c.placements.viewAll} <ArrowRight size={14} />
            </Link>
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
