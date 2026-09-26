import { useState, useEffect } from 'react';
import {
  Search, AlertTriangle, TrendingUp, CheckCircle, FileText, Zap,
  BarChart2, ArrowRight, Clock, Eye, Layers, Target,
  Link2, Monitor, ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'SEO Audit Service — Full-Site Analysis | Vladenza',
      description: 'Full-site SEO audit covering UX, technical SEO, architecture, keywords, and competitors — plus a 6-month link building roadmap. From $300.',
    },
    hero: {
      badge: 'Service — SEO Audit',
      title1: 'Full-Site SEO Audit',
      title2: 'With a Clear Growth Plan',
      desc: 'Not just a list of issues. We audit your UX, on-page SEO, site structure, keywords, competitors, and backlink profile — and deliver a prioritised action plan with a 6-month link building roadmap.',
      cta: 'Order Audit — from $300',
      ctaBox: 'Delivered in 5–7 days',
      sampleLink: 'See a sample audit report',
    },
    auditModules: [
      { icon: Eye, title: 'Visual & UX Review', desc: 'Hero section messaging, conversion flow, CTA placement, trust signal visibility, banner usage, and first-screen impact on bounce rate and CTR.' },
      { icon: Monitor, title: 'On-Page & Technical SEO', desc: 'H1 / title / meta audit, PageSpeed (Core Web Vitals), indexation, canonical tags, structured data, internal linking gaps, and duplicate content.' },
      { icon: Layers, title: 'Site Architecture Plan', desc: 'Full silo structure recommendation — service hubs, sub-service pages, location pages, and Service + Location combinations with internal linking model.' },
      { icon: Target, title: 'Keyword Strategy (5 Tiers)', desc: 'Keyword clustering by intent and competition tier — from core brand terms through service + location combinations to long-tail high-intent queries.' },
      { icon: BarChart2, title: 'Competitor Analysis', desc: 'Side-by-side comparison with top competitors — indexation, page count, content strategy, backlink profile, and exploitable gaps in their approach.' },
      { icon: Link2, title: 'Link Building Roadmap', desc: 'A 6-month off-page plan with phase-by-phase targets, link mix ratios, DR ranges, and volume guidelines calibrated to the site\'s current authority.' },
    ],
    modulesSection: {
      badge: 'What\'s Covered',
      title: 'Six audit modules — full picture',
      desc: 'Most audits stop at technical issues. Ours covers everything that affects rankings, conversions, and organic growth.',
    },
    deliverables: [
      'Full written audit report (PDF)',
      'Visual & UX review with annotated screenshots',
      'On-page issues prioritized by impact',
      'Full site structure plan with URL map',
      'Keyword matrix across 5 tiers (Excel)',
      'Competitor gap analysis',
      'Backlink profile review with recommendations',
      '6-month link building roadmap',
      '30-minute strategy call to walk through findings',
    ],
    deliverablesSection: {
      title: 'What you receive',
      price: '$300',
      priceLabel: 'starting price',
      desc: 'Everything is documented, actionable, and explained in plain language.',
      cta: 'Order Audit',
      sampleLink: 'See sample report',
    },
    process: [
      { num: '01', title: 'Kickoff & Access', desc: 'We collect GSC, GA4, and Ahrefs data. Every insight is backed by real numbers, not assumptions.' },
      { num: '02', title: 'Full-Site Crawl', desc: 'Technical crawl of every URL to surface indexation blocks, on-page issues, and structural gaps.' },
      { num: '03', title: 'Competitor Research', desc: 'We analyse the top SERP competitors to map exactly what it takes to outrank them — page count, content depth, links.' },
      { num: '04', title: 'Report & Call', desc: 'You receive a prioritised action plan, a keyword matrix, a site structure map, and a link building roadmap — then we walk through it live.' },
    ],
    processSection: {
      badge: 'Process',
      title1: 'How the audit',
      title2: 'actually works',
      desc: 'Every audit is manual and niche-specific. No automated tools generating 200-page PDFs — real analysis, real prioritization.',
    },
    differentSection: {
      badge: 'Why This Audit',
      title: 'Not a generic crawl report',
      desc: "Automated tools can't tell you why your competitor ranks with fewer pages, or why your conversion flow is losing leads before users even read your offer.",
      items: [
        { icon: Search, title: 'UX review first', desc: 'We start where users start — the first screen. Hero messaging, CTA placement, trust signal visibility, and conversion flow are audited before touching a single meta tag.' },
        { icon: Layers, title: 'Architecture over keywords', desc: 'We deliver a full URL structure plan — not just a keyword list. You get a blueprint for how pages should be built, connected, and expanded as the site grows.' },
        { icon: TrendingUp, title: 'Link strategy included', desc: 'Most audits stop at "you need more links." Ours includes a 6-month roadmap: which pages to build links to first, what DR range to target, and what link mix ratio to maintain.' },
        { icon: BarChart2, title: 'Competitor-calibrated', desc: 'We benchmark against actual SERP competitors — not generic best practices. Every recommendation is grounded in what your specific competitive landscape requires.' },
        { icon: AlertTriangle, title: 'Prioritised by impact', desc: 'Issues are ranked by the damage they cause — not by how easy they are to fix. You know exactly what to address first to get the fastest improvement.' },
        { icon: Zap, title: 'Actionable from day one', desc: 'The report is structured so your dev team or SEO manager can start immediately. No interpretation required — each finding comes with a clear recommendation.' },
      ],
    },
    faqSection: {
      title: 'Common questions',
      desc: 'Everything you need to know before ordering.',
      faqs: [
        { q: 'How long does a full SEO audit take?', a: 'Standard audits are delivered within 5–7 business days. For larger sites (5k+ pages) allow up to 10–14 days.' },
        { q: 'Do I need to give you access to Google Search Console?', a: 'GSC read-only access dramatically improves the quality of findings. We also work with Ahrefs, Semrush, and GA4 data.' },
        { q: 'Will you fix the issues or just report them?', a: 'The audit covers reporting and the strategy plan. Implementation is available separately — many clients use the audit report as the brief for their dev team.' },
        { q: 'What does the site structure plan include?', a: 'A full URL map for the recommended silo architecture — service hubs, sub-service pages, location pages, and Service + Location combinations — with internal linking logic.' },
        { q: 'What niches do you specialise in?', a: 'Local services, SaaS, iGaming, crypto, fintech, health, and e-commerce. We understand competitive verticals where generic advice fails.' },
        { q: 'What is included in the link building roadmap?', a: 'A phase-by-phase 6-month plan with monthly link volume targets, DR ranges, link type mix ratios, and page-level prioritization — so you know exactly where to invest and in what order.' },
      ],
    },
    faqCta: 'Order Audit — from $300',
    seoBlock: {
      heading: 'A full SEO audit that turns findings into a growth plan',
      intro: 'An SEO audit is only useful if it ends with action. Our audit goes beyond a list of errors: we review technical health, site architecture, on-page factors, UX, and your competitive landscape, then hand you a prioritised roadmap — including a 6-month link building plan tuned to your niche.',
      body: [
        "We start with the fundamentals — crawlability, indexation, Core Web Vitals, internal linking, and content gaps — then benchmark you against the competitors actually winning your keywords. Every finding is scored by impact and effort so you know exactly what to fix first.",
        "Want to see the depth before you commit? Review our [sample audit report](/seo-audit-sample) or work through the [2025 SEO audit checklist](/blog/seo-audit-checklist-2025) we use internally. When the audit points to off-page gaps, we can execute directly with [guest posting](/services/guest-posting) and [niche edits](/services/niche-edits).",
        "See how audit-led strategies performed in our [case studies](/case-studies) across multiple industries.",
      ],
      faqs: [
        { q: 'What does the SEO audit include?', a: 'A full technical review, site architecture and internal linking analysis, on-page and content evaluation, UX review, competitor benchmarking, and a prioritised 6-month roadmap with a link building plan.' },
        { q: 'How long does the audit take?', a: 'Most audits are delivered within 5–10 business days depending on site size and complexity. You receive a clear, actionable report — not just raw crawler output.' },
        { q: 'Can I see an example first?', a: 'Yes. View our [sample audit report](/seo-audit-sample) to see the exact structure, depth, and recommendations you will receive.' },
        { q: 'Do you implement the recommendations?', a: 'We can. Many clients follow the audit with our link building services so the roadmap is executed end to end.' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'SEO-аудит сайту — Повний аналіз | Vladenza',
      description: 'Повний SEO-аудит: UX, технічне SEO, архітектура, ключові слова та конкуренти — плюс 6-місячна дорожня карта лінкбілдингу. Від $300.',
    },
    hero: {
      badge: 'Послуга — SEO-аудит',
      title1: 'Повний SEO-аудит сайту',
      title2: 'з чітким планом зростання',
      desc: 'Не просто список проблем. Ми аудитуємо UX, on-page SEO, структуру сайту, ключові слова, конкурентів та беклінк-профіль — і доставляємо пріоритезований план дій із 6-місячною дорожньою картою лінкбілдингу.',
      cta: 'Замовити аудит — від $300',
      ctaBox: 'Доставка 5–7 днів',
      sampleLink: 'Подивитись зразок звіту',
    },
    auditModules: [
      { icon: Eye, title: 'Візуальний та UX-огляд', desc: 'Меседжинг hero-секції, конверсійний потік, розміщення CTA, видимість довірених сигналів, використання банерів та вплив першого екрана на bounce rate та CTR.' },
      { icon: Monitor, title: 'On-page та технічне SEO', desc: 'Аудит H1 / title / meta, PageSpeed (Core Web Vitals), індексація, canonical-теги, структуровані дані, прогалини внутрішнього лінкінгу та дублікатний контент.' },
      { icon: Layers, title: 'План архітектури сайту', desc: 'Повна рекомендація silo-структури — сервісні хаби, під-сервісні сторінки, локаційні сторінки та комбінації Послуга + Локація з моделлю внутрішнього лінкінгу.' },
      { icon: Target, title: 'Стратегія ключових слів (5 рівнів)', desc: 'Кластеризація ключових слів за інтентом та рівнем конкуренції — від базових брендових термінів до комбінацій послуга + локація та long-tail high-intent запитів.' },
      { icon: BarChart2, title: 'Аналіз конкурентів', desc: 'Порівняння пліч-о-пліч із топ-конкурентами — індексація, кількість сторінок, контент-стратегія, беклінк-профіль та прогалини, які можна використати.' },
      { icon: Link2, title: 'Дорожня карта лінкбілдингу', desc: '6-місячний off-page план з поетапними цілями, співвідношеннями міксу посилань, DR-діапазонами та обʼємними орієнтирами, відкаліброваними під поточний авторитет сайту.' },
    ],
    modulesSection: {
      badge: 'Що покривається',
      title: 'Шість модулів аудиту — повна картина',
      desc: 'Більшість аудитів зупиняються на технічних проблемах. Наш охоплює все, що впливає на ранжування, конверсії та органічне зростання.',
    },
    deliverables: [
      'Повний письмовий звіт аудиту (PDF)',
      'Візуальний та UX-огляд з анотованими скріншотами',
      'On-page проблеми, пріоритезовані за впливом',
      'Повний план структури сайту з URL-мапою',
      'Матриця ключових слів у 5 рівнях (Excel)',
      'Аналіз розривів конкурентів',
      'Огляд беклінк-профілю з рекомендаціями',
      '6-місячна дорожня карта лінкбілдингу',
      '30-хв стратегічний дзвінок для розбору знахідок',
    ],
    deliverablesSection: {
      title: 'Що ви отримуєте',
      price: '$300',
      priceLabel: 'стартова ціна',
      desc: 'Усе задокументовано, дієво та пояснено простою мовою.',
      cta: 'Замовити аудит',
      sampleLink: 'Зразок звіту',
    },
    process: [
      { num: '01', title: 'Запуск та доступ', desc: 'Ми збираємо дані GSC, GA4 та Ahrefs. Кожен інсайт підтверджений реальними цифрами, а не припущеннями.' },
      { num: '02', title: 'Повний краул сайту', desc: 'Технічний краул кожного URL для виявлення блоків індексації, on-page проблем та структурних прогалин.' },
      { num: '03', title: 'Дослідження конкурентів', desc: 'Ми аналізуємо топ-SERP конкурентів, щоб скласти мапу того, що потрібно для їх обігнання — кількість сторінок, глибина контенту, посилання.' },
      { num: '04', title: 'Звіт та дзвінок', desc: 'Ви отримуєте пріоритезований план дій, матрицю ключових слів, мапу структури сайту та дорожню карту лінкбілдингу — а потім ми розбираємо це наживо.' },
    ],
    processSection: {
      badge: 'Процес',
      title1: 'Як працює аудит',
      title2: 'насправді',
      desc: 'Кожен аудит ручний і нішево-специфічний. Без автоматизованих інструментів, що генерують 200-сторінкові PDF — реальний аналіз, реальна пріоритезація.',
    },
    differentSection: {
      badge: 'Чому цей аудит',
      title: 'Не звичайний краул-звіт',
      desc: 'Автоматизовані інструменти не скажуть, чому конкурент ранжується з меншою кількістю сторінок, або чому ваш конверсійний потік втрачає ліди ще до того, як користувач прочитає вашу пропозицію.',
      items: [
        { icon: Search, title: 'Спершу UX-огляд', desc: 'Ми починаємо там, де починають користувачі — перший екран. Меседжинг hero, розміщення CTA, видимість довірених сигналів та конверсійний потік аудитуються ще до дотику до жодного meta-тегу.' },
        { icon: Layers, title: 'Архітектура важливіша за ключові слова', desc: 'Ми доставляємо повний план URL-структури — а не лише список ключових слів. Ви отримуєте креслення того, як сторінки мають бути побудовані, повʼязані та розширені зі зростанням сайту.' },
        { icon: TrendingUp, title: 'Лінк-стратегія включена', desc: 'Більшість аудитів зупиняються на «вам потрібно більше посилань». Наш включає 6-місячну дорожню карту: до яких сторінок спершу будувати посилання, який DR-діапазон цілити та якого співвідношення міксу триматись.' },
        { icon: BarChart2, title: 'Калібровано під конкурентів', desc: 'Ми бенчмаркаємо проти реальних SERP-конкурентів — а не загальних best practices. Кожна рекомендація базується на тому, що вимагає ваш конкретний конкурентний ландшафт.' },
        { icon: AlertTriangle, title: 'Пріоритезовано за впливом', desc: 'Проблеми ранжуються за шкодою, яку вони завдають — а не за тим, наскільки їх легко виправити. Ви точно знаєте, за що братись спершу для найшвидшого покращення.' },
        { icon: Zap, title: 'Дієво з першого дня', desc: 'Звіт структурований так, що ваша dev-команда чи SEO-менеджер можуть почати негайно. Без інтерпретації — кожна знахідка йде з чіткою рекомендацією.' },
      ],
    },
    faqSection: {
      title: 'Поширені питання',
      desc: 'Усе, що потрібно знати перед замовленням.',
      faqs: [
        { q: 'Скільки часу займає повний SEO-аудит?', a: 'Стандартні аудитти доставляються за 5–7 робочих днів. Для більших сайтів (5k+ сторінок) — до 10–14 днів.' },
        { q: 'Чи потрібно давати доступ до Google Search Console?', a: 'GSC read-only доступ значно підвищує якість знахідок. Ми також працюємо з даними Ahrefs, Semrush та GA4.' },
        { q: 'Ви виправляєте проблеми чи лише звітуєте?', a: 'Аудит охоплює звітність та стратегічний план. Впровадження доступне окремо — багато клієнтів використовують звіт аудиту як бриф для своєї dev-команди.' },
        { q: 'Що включає план структури сайту?', a: 'Повна URL-мапа рекомендованої silo-архітектури — сервісні хаби, під-сервісні сторінки, локаційні сторінки та комбінації Послуга + Локація — з логікою внутрішнього лінкінгу.' },
        { q: 'Якими нішами ви спеціалізуєтесь?', a: 'Локальні послуги, SaaS, iGaming, crypto, fintech, health та e-commerce. Ми розуміємо конкурентні вертикалі, де загальна порада не працює.' },
        { q: 'Що входить у дорожню карту лінкбілдингу?', a: 'Поетапний 6-місячний план із щомісячними цільовими обсягами посилань, DR-діапазонами, співвідношеннями міксу типів посилань та пріоритезацією на рівні сторінок — щоб ви точно знали, куди інвестувати і в якому порядку.' },
      ],
    },
    faqCta: 'Замовити аудит — від $300',
    seoBlock: {
      heading: 'Повний SEO-аудит, що перетворює знахідки на план зростання',
      intro: 'SEO-аудит корисний лише тоді, коли він закінчується діями. Наш аудит виходить за межі списку помилок: ми оглядаємо технічне здоровʼя, архітектуру сайту, on-page фактори, UX та конкурентний ландшафт, а потім передаємо вам пріоритезовану дорожню карту — включно з 6-місячним планом лінкбілдингу під вашу нішу.',
      body: [
        "Ми починаємо з основ — краулабельність, індексація, Core Web Vitals, внутрішній лінкінг та контентні прогалини — а потім бенчмаркаємо вас проти конкурентів, які реально виграють ваші ключові слова. Кожна знахідка оцінюється за впливом та зусиллями, щоб ви точно знали, що виправляти спершу.",
        "Хочете побачити глибину перед замовленням? Ознайомтесь із нашим [зразком звіту аудиту](/seo-audit-sample) або пройдіть [SEO-аудит чекліст 2025](/blog/seo-audit-checklist-2025), який ми використовуємо внутрішньо. Коли аудит вказує на off-page прогалини, ми можемо виконати безпосередньо через [гостьові публікації](/services/guest-posting) та [нішеві едити](/services/niche-edits).",
        "Дивіться, як стратегії на основі аудиту показали себе в наших [кейс-стаді](/case-studies) у різних галузях.",
      ],
      faqs: [
        { q: 'Що включає SEO-аудит?', a: 'Повний технічний огляд, аналіз архітектури сайту та внутрішнього лінкінгу, on-page та контентна оцінка, UX-огляд, бенчмаркінг конкурентів та пріоритезована 6-місячна дорожня карта з планом лінкбілдингу.' },
        { q: 'Скільки часу займає аудит?', a: 'Більшість аудитів доставляються за 5–10 робочих днів залежно від розміру та складності сайту. Ви отримуєте чіткий, дієвий звіт — а не лише сирий вихід краулера.' },
        { q: 'Чи можна спершу побачити приклад?', a: 'Так. Подивіться наш [зразок звіту аудиту](/seo-audit-sample), щоб побачити точну структуру, глибину та рекомендації, які ви отримаєте.' },
        { q: 'Ви впроваджуєте рекомендації?', a: 'Можемо. Багато клієнтів після аудиту замовляють наші послуги лінкбілдингу, щоб дорожня карта була виконана від початку до кінця.' },
      ],
    },
  },
} as const;

const AUDIT_PKG: Package = { name: 'SEO Audit', price: 'From $300', links: 'Full-site analysis', service: 'SEO Audit' };

function FAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="flex flex-col gap-3">
      {faqs.map((item, i) => (
        <div key={item.q} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center justify-between gap-3 px-6 py-4 text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-semibold text-gray-900">{item.q}</span>
            {open === i
              ? <ChevronUp size={15} className="text-gray-400 flex-shrink-0" />
              : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
          </button>
          {open === i && (
            <div className="px-6 pb-5 pt-0 text-sm text-gray-500 leading-relaxed border-t border-gray-100">
              <p className="pt-4">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SeoAuditPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/\]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);
  const auditPackage: Package = locale === 'uk'
    ? { name: 'SEO-аудит', price: 'Від $300', links: 'Повний аналіз сайту', service: 'SEO-аудит' }
    : AUDIT_PKG;
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/seo-audit')}/`,
    noindex: true,
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
      serviceType: locale === 'uk' ? 'SEO-аудит' : 'SEO Audit',
      provider: { '@type': 'Organization', name: 'Vladenza', url: 'https://vladenza.com' },
      areaServed: 'Worldwide',
      offers: { '@type': 'Offer', priceCurrency: 'USD', price: '300', url: `https://vladenza.com${lp('/services/seo-audit')}/` },
    });
    return () => {
      document.getElementById(id)?.remove();
    };
  }, [locale, lp]);

  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28" style={{ background: 'linear-gradient(160deg, #fff7f0 0%, #ffffff 60%)' }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <circle cx="1200" cy="100" r="380" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
          <circle cx="1200" cy="100" r="260" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
          <circle cx="1200" cy="100" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.15"/>
          {Array.from({ length: 7 }).map((_, row) =>
            Array.from({ length: 5 }).map((_, col) => (
              <circle key={`h-${row}-${col}`} cx={col * 44 + 20} cy={row * 44 + 200} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
            ))
          )}
          <path d="M 30 30 L 30 80 L 80 80" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/20 bg-[#F97316]/8 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <FileText size={12} />
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
              <button
                onClick={() => setSelectedPkg(auditPackage)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                {c.hero.cta} <ArrowRight size={14} />
              </button>
              <div className="flex items-center gap-2 border border-gray-200 px-5 py-3 rounded-lg text-sm text-gray-600">
                <Clock size={14} className="text-[#F97316]" />
                {c.hero.ctaBox}
              </div>
            </div>
            <div className="mt-6">
              <a
                href={lp('/seo-audit-sample')}
                className="inline-flex items-center gap-1.5 text-sm text-[#F97316] hover:text-[#EA580C] font-medium transition-colors"
              >
                <ExternalLink size={13} />
                {c.hero.sampleLink}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modules ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.modulesSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.modulesSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              {c.modulesSection.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.auditModules.map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <item.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process + Deliverables ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
                {c.processSection.badge}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
                {c.processSection.title1}<br /><span className="text-[#F97316]">{c.processSection.title2}</span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {c.processSection.desc}
              </p>
              <div className="flex flex-col gap-6">
                {c.process.map((step) => (
                  <div key={step.num} className="flex gap-5">
                    <div className="w-10 h-10 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center flex-shrink-0 text-[#F97316] font-black text-xs">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="text-gray-900 font-semibold text-sm mb-1">{step.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables + price */}
            <div className="bg-gray-950 rounded-2xl p-8">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-white font-bold text-lg">{c.deliverablesSection.title}</h3>
                <div className="text-right">
                  <div className="text-[#F97316] font-black text-2xl leading-none">{c.deliverablesSection.price}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{c.deliverablesSection.priceLabel}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">{c.deliverablesSection.desc}</p>
              <div className="flex flex-col gap-3">
                {c.deliverables.map((d) => (
                  <div key={d} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-[#F97316] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{d}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
                <button
                  onClick={() => setSelectedPkg(auditPackage)}
                  className="w-full flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold py-3 rounded-lg text-sm transition-all duration-200"
                >
                  {c.deliverablesSection.cta} <ArrowRight size={14} />
                </button>
                <a
                  href={lp('/seo-audit-sample')}
                  className="w-full flex items-center justify-center gap-2 border border-white/15 hover:border-white/30 text-gray-300 hover:text-white font-medium py-3 rounded-lg text-sm transition-all duration-200"
                >
                  <ExternalLink size={13} />
                  {c.deliverablesSection.sampleLink}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What makes this different ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.differentSection.badge}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.differentSection.title}</h2>
            <p className="text-gray-500 text-sm max-w-lg mx-auto leading-relaxed">
              {c.differentSection.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {c.differentSection.items.map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <item.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.faqSection.title}</h2>
            <p className="text-gray-500 text-sm">{c.faqSection.desc}</p>
          </div>
          <FAQ faqs={c.faqSection.faqs} />
          <div className="mt-10 text-center">
            <button
              onClick={() => setSelectedPkg(auditPackage)}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2"
            >
              {c.faqCta} <ArrowRight size={14} />
            </button>
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
