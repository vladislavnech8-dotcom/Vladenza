import { useState, useEffect } from 'react';
import { FileText, Globe, TrendingUp, CheckCircle, Star, ArrowRight, Clock, Shield, Search } from 'lucide-react';
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
      ctaBox: 'From $100 per placement',
      trafficLabel: 'traffic',
      serviceName: 'Guest Posting',
    },
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
      title: 'How it works',
      desc: 'End-to-end managed. You approve domains, we handle everything else.',
    },
    placements: {
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
      ctaBox: 'Від $100 за розміщення',
      trafficLabel: 'трафіку',
      serviceName: 'Гостьові публікації',
    },
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
      title: 'Як це працює',
      desc: 'Під ключ. Ви погоджуєте домени — ми беремо на себе все інше.',
    },
    placements: {
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
              <span className="text-sm text-gray-500">{c.hero.manualReview}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg({ name: c.hero.serviceName, price: c.hero.fromPrice, links: 'DR 30–90+', service: c.hero.serviceName })}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
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
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <f.icon size={18} className="text-[#F97316]" />
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
          <div className="grid md:grid-cols-3 gap-6">
            {c.tiers.map((tier) => (
              <div key={tier.name} className={`rounded-2xl p-7 border ${tier.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10'}`}>
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>{tier.dr}</div>
                <h3 className={`text-2xl font-bold mb-1 ${tier.highlight ? 'text-white' : 'text-white'}`}>{tier.name}</h3>
                <p className={`text-sm mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>{tier.traffic} {c.hero.trafficLabel}</p>
                <div className={`text-2xl font-black mb-6 mt-4 ${tier.highlight ? 'text-white' : 'text-white'}`}>{tier.price}</div>
                <div className="flex flex-col gap-2.5 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={tier.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${tier.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: tier.name, price: tier.price, links: tier.dr, service: c.hero.serviceName })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${tier.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  {c.tiersSection.cta} <ArrowRight size={13} />
                </button>
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

      {/* Placement Examples */}
      <section id="placements" className="py-16 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.placements.title}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            {c.placements.desc}
          </p>
          <PlacementExplorer serviceType="guest_post" />
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
        faqs={c.seoBlock.faqs}
      />
    </ServicePageLayout>
  );
}
