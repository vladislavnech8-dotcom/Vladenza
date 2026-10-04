import { useState, useEffect } from 'react';
import { FileText, Globe, TrendingUp, CheckCircle, Star, ArrowRight, Shield, Search, Clock, ArrowDown, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import PlacementExplorer from '../components/PlacementExplorer';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'Buy Guest Posts — Guest Posting Service | Vladenza',
      description: 'Buy guest posts on DR 30–90+ real-traffic sites. Niche-matched, permanent links with native content. No PBNs — transparent reporting.',
    },
    hero: {
      badge: 'Link Building Service',
      title: 'Guest Post Link Building',
      subtitle: 'Editorial placements on real, traffic-driven sites.',
      desc: 'Expert-written content on niche-relevant domains — manually vetted, permanently placed, and fully reported.',
      fromPrice: 'From $100',
      delivery: '10–21 day delivery',
      manualReview: 'Manual review',
      cta: 'Start a Campaign',
      ctaSecondary: 'Explore Packages',
      serviceName: 'Guest Posting',
    },
    trustBar: [
      { value: '8+', label: 'Years Link-Building Experience' },
      { value: '100%', label: 'Real Organic Traffic Sites' },
      { value: 'DR 30–90+', label: 'Verified Placements' },
      { value: '0%', label: 'PBNs / Private Networks Only' },
    ],
    features: [
      { icon: Globe, title: 'Real Traffic Sites Only', desc: 'Every placement is on a verified, live website with genuine organic traffic — no PBNs, no link farms, no recycled placements.' },
      { icon: Shield, title: 'Manual Quality Review', desc: 'Our team manually checks every domain for traffic trends, niche relevance, spam score, and link profile health before outreach.' },
      { icon: FileText, title: 'Native Content Writing', desc: 'Expert writers craft articles that naturally fit the host site\'s voice while anchoring your link in a topically relevant context.' },
      { icon: TrendingUp, title: 'Niche-Matched Placements', desc: 'Links placed only on sites that are thematically relevant to your business — not generic "write for us" directories.' },
      { icon: Star, title: 'DR 30–90+ Options', desc: 'Packages from entry-level DR 30+ through to editorial placements on DR 70–90+ authority publications.' },
      { icon: Search, title: 'Anchor Text Strategy', desc: 'We map anchors according to your existing profile to maintain a natural ratio and avoid over-optimisation penalties.' },
    ],
    tiers: [
      {
        name: 'Starter',
        dr: 'DR 30–50',
        traffic: '1k–5k/mo',
        turnaround: '10–14 days',
        price: 'From $100',
        features: ['Niche-relevant domain', 'Manual QC check', '800+ word article', 'Permanent placement', 'Report with live URL'],
        highlight: false,
      },
      {
        name: 'Authority',
        dr: 'DR 50–70',
        traffic: '5k–30k/mo',
        turnaround: '10–14 days',
        price: 'From $180',
        features: ['High-traffic editorial sites', 'In-depth content (1,200+ words)', 'Strategic anchor mapping', 'Priority support', 'Full placement report'],
        highlight: true,
      },
      {
        name: 'Premium',
        dr: 'DR 70–90+',
        traffic: '30k+/mo',
        turnaround: '14–21 days',
        price: 'From $380',
        features: ['Industry publication placements', 'Expert-level content', 'Editor-reviewed copy', 'Dedicated account manager', 'Custom anchor planning'],
        highlight: false,
      },
    ],
    tiersSection: {
      badge: 'Packages',
      title: 'Guest Posting Packages & Pricing',
      desc: 'Mix tiers across your campaign for a natural, varied link profile.',
      cta: 'Get Started',
      popular: 'Most Popular',
    },
    featuresSection: {
      badge: 'Why It Works',
      title: 'Quality-first link acquisition',
      desc: 'We don\'t use link farms, PBNs, or recycled placements. Every link is built to last and built to rank.',
    },
    process: [
      { num: '01', title: 'Site Discovery', desc: 'We source domains from our private network and verified outreach — not public link marketplaces.' },
      { num: '02', title: 'Manual QC', desc: 'Each site passes traffic, spam, and relevance checks before being proposed to your campaign.' },
      { num: '03', title: 'Content Creation', desc: 'Our writers craft a piece that fits the host site while embedding your link naturally and contextually.' },
      { num: '04', title: 'Publication & Report', desc: 'Once live, you get the URL, DA/DR, traffic estimate, and anchor used — full transparency.' },
    ],
    processSection: {
      badge: 'Process',
      title: 'How it works',
      desc: 'End-to-end managed. You approve domains, we handle everything else.',
    },
    placements: {
      badge: 'Proof',
      title: 'Real Guest Post Examples',
      desc: 'Examples from completed orders, with Ahrefs DR and organic traffic metrics.',
      viewAll: 'View All Guest Post Examples',
    },
    seoBlock: {
      heading: 'Guest posting that builds real authority, not just links',
      intro: 'Guest posting remains one of the most reliable ways to earn contextual, editorial backlinks — but only when placements sit on real websites with genuine organic traffic. Our guest posting service focuses on niche relevance and editorial quality so every link strengthens your topical authority and helps you rank in competitive markets.',
      body: [
        "Unlike marketplaces that resell the same recycled domains, we source placements through private relationships and direct outreach. Every site passes a manual quality check for traffic trends, spam score, and link profile health before we propose it. That means your links are placed inside genuinely useful content that both Google and AI search engines can trust.",
        "Guest posts work best as part of a diversified profile. Many clients combine them with [niche edits](/services/niche-edits) for faster authority transfer into aged pages, and [crowd links](/services/crowd-links) for a natural, varied link footprint. If you operate in a specific vertical, our [niche link packages](/services/link-packages/saas) bundle guest posts with supporting placements tuned to your industry.",
        "See how guest posting helped [a SaaS client build non-brand organic traffic](/case-studies/saas-non-brand-traffic) — one of many campaigns in our [case studies](/case-studies) archive. Read the [2026 link building playbook](/blog/link-building-2026) to understand how editorial links now feed AI visibility too — see our [AI & LLM visibility service](/services/ai-llm) for how this fits into a broader strategy.",
        "We run guest posting campaigns across every major vertical — [SaaS](/services/link-packages/saas), [iGaming](/services/link-packages/igaming), [health](/services/link-packages/health), [automotive](/services/link-packages/auto), [proxy/VPN](/services/link-packages/proxy), and [home renovation](/services/link-packages/renovations) — with placements sourced from niche-specific publisher networks rather than generic directories.",
      ],
      faqs: [
        { q: 'Is guest posting still effective in 2026?', a: 'Yes, but only high-tier editorial guest posting — placements on real sites with genuine audiences and expert-authored content. Marketplace "write for us" links on sites that exist purely to sell placements can now do more harm than good. That distinction is exactly why we manually vet every domain before outreach.' },
        { q: 'What makes a guest post high quality?', a: 'A high-quality guest post lives on a niche-relevant site with real organic traffic, is written as genuinely useful editorial content, and embeds your link naturally with a sensible anchor. We avoid PBNs, link farms, and generic "write for us" directories entirely.' },
        { q: 'Are the links permanent?', a: 'Yes. Every placement is a permanent, indexed link. You receive the live URL, DR/DA, traffic estimate, and the anchor used in a full transparency report.' },
        { q: 'How do you choose the anchor text?', a: 'We map anchors against your existing backlink profile to maintain a natural ratio of branded, partial-match, and exact-match anchors — protecting you from over-optimisation penalties.' },
        { q: 'How long until I see results?', a: 'Guest posts are typically published within 10–21 days depending on tier. Ranking impact usually builds over several weeks as links are crawled and indexed. See our guide on [how long link building takes](/blog/how-long-does-link-building-take) for a realistic timeline.' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'Купити гостьові публікації — Послуга гостьового постингу | Vladenza',
      description: 'Купіть гостьові публікації на сайтах з DR 30–90+ та реальним трафіком. Нішеві, постійні посилання з авторським контентом. Без PBN — прозорі звіти.',
    },
    hero: {
      badge: 'Послуга лінкбілдингу',
      title: 'Лінкбілдинг через гостьові публікації',
      subtitle: 'Редакційні розміщення на реальних сайтах з трафіком.',
      desc: 'Контент від експертів на нішевих доменах — ручна перевірка, постійне розміщення та повна звітність.',
      fromPrice: 'Від $100',
      delivery: 'Доставка 10–21 днів',
      manualReview: 'Ручна перевірка',
      cta: 'Почати кампанію',
      ctaSecondary: 'Пакети',
      serviceName: 'Гостьові публікації',
    },
    trustBar: [
      { value: '8+', label: 'Років досвіду в лінкбілдингу' },
      { value: '100%', label: 'Сайти з реальним органічним трафіком' },
      { value: 'DR 30–90+', label: 'Перевірені розміщення' },
      { value: '0%', label: 'PBN / лише приватні мережі' },
    ],
    features: [
      { icon: Globe, title: 'Лише сайти з реальним трафіком', desc: 'Кожне розміщення — на перевіреному, живому сайті зі справжнім органічним трафіком. Без PBN, без лінк-ферм, без перепроданих майданчиків.' },
      { icon: Shield, title: 'Ручна перевірка якості', desc: 'Наша команда вручну перевіряє кожен домен на тенденції трафіку, релевантність ніші, спам-скор та стан профілю посилань перед аутрічем.' },
      { icon: FileText, title: 'Авторський контент', desc: 'Експертні копірайтери створюють статті, які природно вписуються в стиль сайту-майданчика та розміщують ваше посилання в релевантному контексті.' },
      { icon: TrendingUp, title: 'Нішеві розміщення', desc: 'Посилання розміщуємо лише на сайтах, тематично релевантних вашому бізнесу — а не в універсальних «write for us» каталогах.' },
      { icon: Star, title: 'Варіанти DR 30–90+', desc: 'Пакети від базового DR 30+ до редакційних розміщень на авторитетних виданнях з DR 70–90+.' },
      { icon: Search, title: 'Стратегія анкор-текстів', desc: 'Ми підбираємо анкори з урахуванням вашого поточного профілю, щоб зберегти натуральне співвідношення та уникнути надмірної оптимізації.' },
    ],
    tiers: [
      {
        name: 'Стартовий',
        dr: 'DR 30–50',
        traffic: '1k–5k/міс',
        turnaround: '10–14 днів',
        price: 'Від $100',
        features: ['Нішевий домен', 'Ручна перевірка QC', 'Стаття 800+ слів', 'Постійне розміщення', 'Звіт з живим URL'],
        highlight: false,
      },
      {
        name: 'Авторитетний',
        dr: 'DR 50–70',
        traffic: '5k–30k/міс',
        turnaround: '10–14 днів',
        price: 'Від $180',
        features: ['Високотрафікові редакційні сайти', 'Глибокий контент (1,200+ слів)', 'Стратегічне анкор-планування', 'Пріоритетна підтримка', 'Повний звіт про розміщення'],
        highlight: true,
      },
      {
        name: 'Преміум',
        dr: 'DR 70–90+',
        traffic: '30k+/міс',
        turnaround: '14–21 днів',
        price: 'Від $380',
        features: ['Розміщення в галузевих виданнях', 'Експертний контент', 'Текст після редакторської перевірки', 'Персональний акаунт-менеджер', 'Кастомне анкор-планування'],
        highlight: false,
      },
    ],
    tiersSection: {
      badge: 'Пакети',
      title: 'Пакети та ціни на гостьові публікації',
      desc: 'Поєднуйте пакети в межах кампанії для натурального, різноманітного профілю посилань.',
      cta: 'Почати',
      popular: 'Найпопулярніший',
    },
    featuresSection: {
      badge: 'Чому це працює',
      title: 'Лінкбілдинг з фокусом на якість',
      desc: 'Ми не використовуємо лінк-ферми, PBN чи перепродані розміщення. Кожне посилання створене, щоб служити довго і ранжити.',
    },
    process: [
      { num: '01', title: 'Пошук сайтів', desc: 'Ми шукаємо домени через нашу приватну мережу та перевірений аутріч — а не на публічних майданчиках посилань.' },
      { num: '02', title: 'Ручна перевірка', desc: 'Кожен сайт проходить перевірку трафіку, спаму та релевантності, перш ніж потрапити до вашої кампанії.' },
      { num: '03', title: 'Створення контенту', desc: 'Наші автори пишуть матеріал, який вписується в хост-сайт і природно містить ваше посилання.' },
      { num: '04', title: 'Публікація та звіт', desc: 'Після публікації ви отримуєте URL, DA/DR, оцінку трафіку та використаний анкор — повна прозорість.' },
    ],
    processSection: {
      badge: 'Процес',
      title: 'Як це працює',
      desc: 'Під ключ. Ви погоджуєте домени — ми беремо на себе все інше.',
    },
    placements: {
      badge: 'Доказ',
      title: 'Реальні приклади гостьових публікацій',
      desc: 'Приклади з виконаних замовлень, з метриками Ahrefs DR та органічним трафіком.',
      viewAll: 'Усі приклади гостьових публікацій',
    },
    seoBlock: {
      heading: 'Гостьові публікації, які будують справжній авторитет, а не лише посилання',
      intro: 'Гостьовий постинг залишається одним із найнадійніших способів здобути контекстні, редакційні беклінки — але лише коли розміщення знаходяться на реальних сайтах зі справжнім органічним трафіком. Наша послуга гостьового постингу фокусується на нішевій релевантності та редакційній якості, щоб кожне посилання посилювало ваш тематичний авторитет і допомагало ранжити в конкурентних ринках.',
      body: [
        "На відміну від майданчиків, які перепродають одні й ті ж домени, ми шукаємо розміщення через приватні зв'язки та прямий аутріч. Кожен сайт проходить ручну перевірку якості: тенденції трафіку, спам-скор та стан профілю посилань — ще до пропозиції. Це означає, що ваші посилання розміщуються в дійсно корисному контенті, якому довіряють і Google, і AI-пошуковики.",
        "Гостьові публікації працюють найкраще в складі різноманітного профілю. Багато клієнтів поєднують їх із [розміщенням посилань у готових статтях](/services/niche-edits) для швидшої передачі авторитету на індексовані сторінки, та [крауд-посиланнями](/services/crowd-links) для натурального, різноманітного профілю. Якщо ви працюєте в конкретній вертикалі, наші [нішеві пакети посилань](/services/link-packages/saas) об'єднують гостьові публікації з підтримуючими розміщеннями під вашу галузь.",
        "Дивіться, як гостьовий постинг допоміг [SaaS-клієнту наростити небрендовий органічний трафік](/case-studies/saas-non-brand-traffic) — одна з багатьох кампаній у нашому архіві [кейс-стаді](/case-studies). Прочитайте [довідник з лінкбілдингу 2026](/blog/link-building-2026), щоб зрозуміти, як редакційні посилання тепер впливають і на видимість в AI — дивіться нашу [послугу видимості в AI та LLM](/services/ai-llm), щоб побачити, як це поєднується в ширшу стратегію.",
        "Ми ведемо кампанії гостьового постингу в усіх основних вертикалях — [SaaS](/services/link-packages/saas), [iGaming](/services/link-packages/igaming), [health](/services/link-packages/health), [automotive](/services/link-packages/auto), [proxy/VPN](/services/link-packages/proxy) та [home renovation](/services/link-packages/renovations) — з розміщеннями з нішевих паблішер-мереж, а не з універсальних каталогів.",
      ],
      faqs: [
        { q: 'Чи ефективний гостьовий постинг у 2026 році?', a: 'Так, але лише якісний редакційний гостьовий постинг — розміщення на реальних сайтах зі справжньою аудиторією та експертним контентом. Посилання «write for us» з майданчиків, які існують виключно для продажу розміщень, тепер можуть шкодити. Саме тому ми вручну перевіряємо кожен домен перед аутрічем.' },
        { q: 'Що робить гостьову публікацію якісною?', a: 'Якісна гостьова публікація розміщена на нішевому сайті з реальним органічним трафіком, написана як дійсно корисний редакційний контент, і вміщує ваше посилання органічно з доречним анкором. Ми повністю уникаємо PBN, лінк-ферм та універсальних «write for us» каталогів.' },
        { q: 'Чи посилання постійні?', a: 'Так. Кожне розміщення — це постійне, індексоване посилання. Ви отримуєте живий URL, DR/DA, оцінку трафіку та використаний анкор у повному звіті.' },
        { q: 'Як ви обираєте анкор-текст?', a: 'Ми зіставляємо анкори з вашим поточним беклінк-профілем, щоб зберегти натуральне співвідношення брендових, часткових та точних анкорів — захищаючи вас від надмірної оптимізації.' },
        { q: 'За скільки часу побачу результати?', a: 'Гостьові публікації зазвичай виходять протягом 10–21 днів залежно від пакету. Ефект на ранжування наростає кілька тижнів, поки посилання скануються та індексуються. Дивіться наш гайд [скільки часу займає лінкбілдинг](/blog/how-long-does-link-building-take) для реалістичного таймлайну.' },
      ],
    },
  },
} as const;

function AuthorityDiagram() {
  return (
    <div className="relative flex aspect-square w-full max-w-[420px] items-center justify-center">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="200" cy="200" r="180" fill="none" stroke="#FF5A1F" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="#FF5A1F" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#FF5A1F" strokeOpacity="0.3" strokeWidth="1" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="#FF5A1F" strokeOpacity="0.5" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="36" fill="#FF5A1F" fillOpacity="0.08" stroke="#FF5A1F" strokeWidth="2" />
        {[0, 60, 120, 180, 240, 300].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x = 200 + Math.cos(rad) * 140;
          const y = 200 + Math.sin(rad) * 140;
          return <circle key={deg} cx={x} cy={y} r="6" fill="#FF5A1F" fillOpacity="0.7" />;
        })}
      </svg>
      <div className="relative z-10 text-center">
        <div className="font-display text-[clamp(2.5rem,6vw,3.5rem)] font-bold leading-none tracking-[-.055em] text-ink">DR 30–90+</div>
        <div className="mt-2 text-xs font-bold uppercase tracking-[.14em] text-signal">Verified Authority</div>
      </div>
    </div>
  );
}

export default function GuestPostingPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: locale === 'uk' ? 'https://vladenza.com/uk/services/guest-posting' : 'https://vladenza.com/services/guest-posting',
  });

  useEffect(() => {
    const id = 'service-schema';
    let el = document.getElementById(id) as HTMLScriptElement | null;
    if (!el) {
      el = document.createElement('script');
      el.id = id;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: locale === 'uk' ? 'Гостьові публікації / Лінкбілдинг' : 'Guest Posting / Link Building',
      provider: { '@type': 'Organization', name: 'Vladenza', url: 'https://vladenza.com' },
      areaServed: 'Worldwide',
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: '100', url: `https://vladenza.com${lp('/services/guest-posting')}` },
    });
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [locale, lp]);

  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* Hero — two-column split */}
      <section className="relative overflow-hidden bg-cream py-16 lg:py-24">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr] lg:gap-16">
            <div className="max-w-[640px]">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[.18em] text-signal">{c.hero.badge}</p>
              <h1 className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] font-bold leading-[.94] tracking-[-.05em] text-ink mb-5">{c.hero.title}</h1>
              <p className="text-lg font-semibold leading-[1.5] text-ink/80 mb-2">{c.hero.subtitle}</p>
              <p className="text-[17px] leading-[1.6] text-ink/60 mb-7 max-w-[560px]">{c.hero.desc}</p>
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-sm font-bold text-ink">{c.hero.fromPrice}</span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-sm font-medium text-ink/70"><Clock size={13} className="text-signal" />{c.hero.delivery}</span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-white px-3.5 py-2 text-sm font-medium text-ink/70"><CheckCircle size={13} className="text-signal" />{c.hero.manualReview}</span>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setSelectedPkg({ name: c.hero.serviceName, price: c.hero.fromPrice, links: 'DR 30–90+', service: c.hero.serviceName })}
                  className="editorial-focus inline-flex min-h-[52px] items-center gap-2 bg-signal px-7 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 lg:min-h-[56px]"
                >
                  {c.hero.cta} <ArrowRight size={16} />
                </button>
                <a
                  href="#packages"
                  className="editorial-focus inline-flex min-h-[52px] items-center gap-2 border-2 border-ink/20 bg-white px-7 text-sm font-bold text-ink transition-colors hover:border-signal hover:text-signal lg:min-h-[56px]"
                >
                  {c.hero.ctaSecondary} <ArrowDown size={15} />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <AuthorityDiagram />
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Metric Bar */}
      <section className="bg-[#0B1020] py-10">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
            {c.trustBar.map((item) => (
              <div key={item.label} className="flex flex-col items-center px-4 text-center lg:px-8">
                <span className="font-display text-[clamp(2rem,3vw,3rem)] font-bold leading-none tracking-[-.045em] text-signal">{item.value}</span>
                <span className="mt-2 text-xs font-medium leading-tight text-white/55 lg:text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why It Works — 6 cards */}
      <section className="bg-cream py-[88px] md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="mb-12 max-w-[620px]">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.16em] text-signal">{c.featuresSection.badge}</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[.96] tracking-[-.045em] text-ink mb-4">{c.featuresSection.title}</h2>
            <p className="text-[17px] leading-[1.6] text-ink/60">{c.featuresSection.desc}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {c.features.map((f) => (
              <div key={f.title} className="group rounded-2xl border border-ink/10 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-signal/30 hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-signal/20 bg-signal/5 transition-colors group-hover:bg-signal/10">
                  <f.icon size={20} className="text-signal" />
                </div>
                <h3 className="font-display text-lg font-bold tracking-tight text-ink mb-2">{f.title}</h3>
                <p className="text-[15px] leading-[1.6] text-ink/55">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages & Pricing */}
      <section id="packages" className="scroll-mt-20 bg-white py-[88px] md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.16em] text-signal">{c.tiersSection.badge}</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[.96] tracking-[-.045em] text-ink mb-4">{c.tiersSection.title}</h2>
            <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink/60">{c.tiersSection.desc}</p>
          </div>
          <div className="grid items-stretch gap-6 md:grid-cols-3">
            {c.tiers.map((tier) => (
              <div key={tier.name} className={`relative flex flex-col rounded-3xl border-2 p-8 ${tier.highlight ? 'border-signal bg-white shadow-[0_12px_40px_rgba(255,90,31,0.12)]' : 'border-ink/10 bg-white'}`}>
                {tier.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-signal px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">{c.tiersSection.popular}</span>
                )}
                <div className="mb-2 text-xs font-bold uppercase tracking-widest text-signal">{tier.dr}</div>
                <h3 className="font-display text-[26px] font-bold tracking-tight text-ink mb-1">{tier.name}</h3>
                <p className="text-sm text-ink/50 mb-5">{tier.traffic} · {tier.turnaround}</p>
                <div className="font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-none tracking-[-.045em] text-ink mb-6">{tier.price}</div>
                <div className="mb-8 flex flex-col gap-3">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <CheckCircle size={15} className="mt-0.5 flex-shrink-0 text-signal" />
                      <span className="text-[15px] leading-[1.5] text-ink/70">{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: tier.name, price: tier.price, links: tier.dr, service: c.hero.serviceName })}
                  className={`editorial-focus mt-auto flex min-h-[52px] w-full items-center justify-center gap-2 text-sm font-bold transition-all duration-200 ${tier.highlight ? 'bg-signal text-white hover:-translate-y-0.5' : 'border-2 border-ink text-ink hover:bg-ink hover:text-white'}`}
                >
                  {c.tiersSection.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works — process */}
      <section className="bg-cream py-[88px] md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.16em] text-signal">{c.processSection.badge}</p>
            <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[.96] tracking-[-.045em] text-ink mb-4">{c.processSection.title}</h2>
            <p className="mx-auto max-w-[520px] text-[17px] leading-[1.6] text-ink/60">{c.processSection.desc}</p>
          </div>
          <div className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-[10%] right-[10%] top-12 hidden h-px bg-ink/15 lg:block" />
            {c.process.map((step) => (
              <div key={step.num} className="relative z-10 flex min-h-[200px] flex-col rounded-2xl border border-ink/10 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-14 items-center justify-center border-2 border-ink bg-signal font-display text-lg font-bold text-white shadow-[3px_3px_0_#111111]">{step.num}</span>
                </div>
                <h3 className="font-display text-xl font-bold tracking-tight text-ink mb-2">{step.title}</h3>
                <p className="text-[15px] leading-[1.6] text-ink/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Guest Post Examples */}
      <section id="placements" className="scroll-mt-20 bg-white py-[88px] md:py-28">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.16em] text-signal">{c.placements.badge}</p>
              <h2 className="font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[.96] tracking-[-.045em] text-ink mb-3">{c.placements.title}</h2>
              <p className="max-w-[520px] text-[17px] leading-[1.6] text-ink/60">{c.placements.desc}</p>
            </div>
            <Link to={lp('/placements')} className="editorial-focus inline-flex min-h-12 shrink-0 items-center gap-2 border-2 border-ink px-5 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white">
              {c.placements.viewAll} <ArrowRight size={15} />
            </Link>
          </div>
          <PlacementExplorer serviceType="guest_post" />
        </div>
      </section>

      {/* SEO Content & FAQ */}
      <ServiceSeoBlock
        heading={c.seoBlock.heading}
        intro={c.seoBlock.intro}
        body={c.seoBlock.body.map(localizeLinks)}
        faqs={c.seoBlock.faqs}
      />
    </ServicePageLayout>
  );
}
