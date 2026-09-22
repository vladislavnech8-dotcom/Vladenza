import { useState } from 'react';
import {
  Shield, EyeOff, Users, TrendingUp, CheckCircle, ArrowRight,
  Star, Clock, Zap, FileText, Lock, BarChart2, RefreshCw, Award,
  ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

/* ── Data ─────────────────────────────────────────────────── */

const content = {
  en: {
    seo: {
      title: 'White Label Link Building Service | Vladenza',
      description: 'White label link building service for SEO agencies. Guest posts, niche edits, crowd links — branded reports, NDA protected.',
    },
    hero: {
      badge: 'Service — White Label',
      title1: 'Link Building Your Clients',
      title2: 'Will Never Know You Outsourced',
      desc: 'Agency-grade link fulfilment under your brand. Guest posts, niche edits, crowd links — NDA-protected, white-label reported, and guaranteed for 12 months.',
      cta: 'Become a Partner',
      ctaSecondary: 'Get a Free Audit',
    },
    whyItMatters: [
      { stat: '80+', label: 'active agency partners trust us with their clients' },
      { stat: '9+', label: 'years delivering white-label link campaigns' },
      { stat: '100%', label: 'NDA protection — clients never see our name' },
      { stat: '12mo', label: 'link replacement guarantee on every placement' },
    ],
    benefits: [
      { icon: EyeOff, title: 'Completely invisible', desc: 'We operate as your in-house team. Reports arrive in your branding, all communication goes through you — your clients never see our name.' },
      { icon: Shield, title: 'NDA signed as standard', desc: 'Every partner signs an NDA before we start. Your client list, campaign details, and our working relationship stay confidential forever.' },
      { icon: TrendingUp, title: 'Scale without hiring', desc: "Win five new clients tomorrow — we'll fulfil them. Scale up or down in days, not months. No recruiting, no training, no overhead." },
      { icon: BarChart2, title: 'White-label reports', desc: 'Branded PDF and Google Doc reports you send straight to clients. Placement URL, DR, traffic, anchor — everything documented for you.' },
      { icon: Award, title: '23-point quality review', desc: 'Every domain passes our checklist: organic traffic, spam score, niche relevance, outbound link ratio, indexing health, editorial legitimacy.' },
      { icon: RefreshCw, title: '12-month link guarantee', desc: "If any link drops within 12 months, we replace it at zero cost. No arguments, no delays — your client's results are always protected." },
    ],
    benefitsSection: {
      badge: 'Why Agencies Choose Us',
      title: 'Everything your agency needs',
      desc: 'From the first link to full campaign management — built to scale your agency without scaling headcount.',
    },
    linkTypes: [
      { name: 'Guest Post Placements', desc: 'Original, publication-ready articles on niche-relevant sites with naturally embedded backlinks.', dr: 'DR 30–90+', time: '10–21 days' },
      { name: 'Link Insertions', desc: 'Contextual links inserted into existing indexed content on authoritative domains — fast and powerful.', dr: 'DR 40–80+', time: '7–14 days' },
      { name: 'Crowd Marketing', desc: 'Organic mentions across forums, Q&A platforms, and communities that build natural link diversity.', dr: 'Varied', time: '5–10 days' },
      { name: 'Editorial Outreach', desc: 'Personalised outreach to publishers and editors for genuine placements on high-authority publications.', dr: 'DR 60–90+', time: '14–28 days' },
    ],
    linkTypesSection: {
      title: 'Every link type. Every niche.',
      desc: 'Mix and match to build a natural, diverse profile for each client — all under your brand.',
    },
    process: [
      { num: '01', title: 'Free consultation', desc: "We align on quality benchmarks, anchor strategy, reporting format, and white-label framework. Zero commitment." },
      { num: '02', title: 'NDA & onboarding', desc: "Sign the NDA, set up branded report templates, brief our team on your clients. Up and running within one week." },
      { num: '03', title: 'We build & report', desc: "Outreach specialists and writers handle everything. Branded reports arrive on schedule — ready to forward to clients." },
      { num: '04', title: 'Scale as you grow', desc: "Dedicated account manager maintains quality across all campaigns. Add clients whenever — we grow with you." },
    ],
    processSection: {
      title: 'From first call to first links — in 1 week',
      desc: 'No lengthy onboarding. No complicated integrations. A clean handoff and results you can show clients.',
      cta: 'Start Partnership',
    },
    tiers: [
      {
        name: 'Agency Starter',
        volume: '20–50 links/mo',
        price: 'From $700/mo',
        highlight: false,
        features: [
          'All link types included',
          'DR 20–60+ placements',
          'Branded Google Doc reports',
          'NDA as standard',
          'Dedicated TG / WhatsApp channel',
          'Competitor link gap analysis',
          'Anchor text strategy map',
          'Monthly performance summary',
        ],
      },
      {
        name: 'Agency Growth',
        volume: '70–100 links/mo',
        price: 'From $1,500/mo',
        highlight: true,
        features: [
          'All link types included',
          'DR 30–80+ placements',
          'Branded Google Doc reports',
          'Priority turnaround',
          'Dedicated account manager',
          '12-month link guarantee',
          'Full link-building strategy',
          'Weekly progress updates',
          'Anchor ratio monitoring',
          'Competitor gap tracking',
        ],
      },
      {
        name: 'Agency Enterprise',
        volume: '100+ links/mo',
        price: 'Custom pricing',
        highlight: false,
        features: [
          'Full campaign management',
          'DR 60–90+ editorial options',
          'Custom reporting dashboard',
          'Multi-client portal',
          'SLA agreement',
          'Monthly strategy calls',
          'Dedicated content team',
          'Publisher network access',
          'Priority niche coverage',
          'Quarterly strategy review',
        ],
      },
    ],
    tiersSection: {
      badge: 'Packages',
      title: 'Partner pricing',
      desc: 'Flexible volume tiers for agencies of every size. All plans include NDA, white-label reports, and a dedicated point of contact.',
      cta: 'Get Started',
    },
    testimonials: [
      { name: 'Marcus D.', role: 'Head of Growth, SaaS Platform', platform: 'Clutch', text: "Vladenza delivered exactly what was promised — DR 60+ links, natural anchors, and visible ranking improvements within 8 weeks. Our clients were impressed and we didn't have to lift a finger on fulfilment.", stars: 5 },
      { name: 'Elena V.', role: 'SEO Manager, iGaming Portal', platform: 'Clutch', text: "We've tried 4 link building agencies before. This is the only one that actually moves the needle in competitive niches. The white-label setup is seamless — clients think we have a huge in-house team.", stars: 5 },
      { name: 'James K.', role: 'Agency Director, UK', platform: 'Clutch', text: "We tripled our link building client base in 18 months. The quality is consistently exceptional and the branded reports are professional enough to go straight to clients without a single edit.", stars: 5 },
      { name: 'Tom H.', role: 'Digital Agency Owner', platform: 'Fiverr', text: "I resell these services to my own clients. Quality is consistently high, reporting is clean, and links are always from domains with genuine traffic. The NDA means I never worry about client poaching.", stars: 5 },
      { name: 'Andrei P.', role: 'CMO, Fintech Startup', platform: 'Fiverr', text: "Their 23-point quality review gives us complete confidence in every placement. Zero client complaints about link quality since switching, and our retention has improved significantly.", stars: 5 },
    ],
    testimonialsSection: {
      title: 'What Agency Partners Say',
      desc: '80+ agencies trust us to fulfil their link building — invisibly, reliably, at scale.',
      ratingText: 'from 80+ agency partners',
      allReviews: 'All reviews',
    },
    faqs: [
      { q: 'What are White Label Link Building Services?', a: 'White label link building services allow your agency to offer high-quality backlinks we build on your behalf as your own. This enables you to provide comprehensive link-building solutions to clients without handling the work in-house — giving you a full service offering without the overhead of building an internal team.' },
      { q: 'Can I have input into the link-building strategy?', a: 'Absolutely. As a trusted white label service provider, we collaborate closely with your agency to ensure the link-building strategy aligns with your preferences. Our approach is fully tailored to meet your specific client requirements and goals — from anchor text ratios to target DR ranges and niche focus.' },
      { q: 'What kind of backlinks can I expect?', a: 'All backlinks we create are high-quality, do-follow links from reputable, niche-relevant sites. They are secured through manual outreach and content placement, ensuring they add genuine authority and ranking value to your clients\' websites. No PBNs, no link farms, no recycled placements.' },
      { q: 'Are the link-building techniques white hat?', a: 'Yes, we use 100% white hat, ethical link-building methods. This guarantees the longevity and effectiveness of links while keeping your clients\' websites safe from Google penalties. Every placement passes our 23-point quality review before it goes live.' },
      { q: 'How do White Label Link Building Services benefit SEO agencies?', a: null, list: [
        'High-quality backlinks that boost client rankings and organic traffic',
        'Cost efficiency — far more affordable than maintaining an in-house team',
        'Timely delivery — meet client deadlines reliably, every time',
        'Scalability — handle sudden spikes in demand without sacrificing quality',
        'Expertise access — tap into experienced outreach specialists and established publisher networks',
        'Do-follow links — maximise SEO impact with effective, lasting backlinks',
        'Client satisfaction — retain clients by consistently delivering measurable results',
        'Brand building — enhance your agency\'s reputation with detailed, branded reports',
        'Long-term strategy — continuous improvement, not just one-off gains',
        'Wide publisher network — access diverse, high-quality publishers across 40+ niches',
      ] },
      { q: 'How do you ensure the quality of the links?', a: 'Our outreach specialists rigorously vet all target sites based on domain authority, relevance, traffic, and editorial standards. In-house writers craft high-quality content, ensuring every backlink meets our stringent quality benchmarks. Every domain is manually reviewed — no automated tools make the final call.' },
      { q: 'Will my clients know that I\'m outsourcing link building?', a: 'No. Our services are fully white-labelled — all deliverables, reports, and analyses are presented as your own work. An NDA ensures complete confidentiality throughout the process. We are your invisible partner.' },
      { q: 'What happens if a link goes down or a client is unsatisfied?', a: 'We offer free link replacement if any links go down within 12 months, though this is rare. We also replace links that do not meet agreed expectations within the specified timeframe to ensure client satisfaction — no arguments, no delays.' },
      { q: 'Is white label backlink tracking possible?', a: 'Yes. Your dedicated account manager provides weekly updates on all link-building orders. You can track every backlink we build through the white-label report, which includes live URLs, DR, traffic estimates, and anchor text used.' },
      { q: 'How is pricing determined?', a: 'Pricing depends on factors such as the number of links per month, the authority of target sites, and niche complexity. We offer flexible volume tiers to suit different budgets, with full transparency and no hidden costs. Enterprise clients receive custom proposals.' },
      { q: 'What is the typical turnaround time?', a: 'For guest posts and niche edits, first links typically go live within 10–21 days. Crowd links are faster — usually 5–10 days. Once onboarded (takes about one week), campaigns run on a continuous monthly cycle with consistent delivery.' },
      { q: 'Why should I choose you as my white label link building partner?', a: '9+ years of link building experience, 80+ active agency partners, a 23-point quality review on every placement, NDA-protected partnerships, a 12-month replacement guarantee, and a dedicated account manager from day one. We don\'t just fulfil — we help your agency grow.' },
    ],
    faqSection: {
      title: 'Common questions',
      desc: 'Everything agencies ask before becoming a partner.',
    },
  },
  uk: {
    seo: {
      title: 'White Label лінкбілдинг послуга | Vladenza',
      description: 'White label послуга лінкбілдингу для SEO-агенцій. Гостьові публікації, нішеві едити, крауд-посилання — брендовані звіти, захист NDA.',
    },
    hero: {
      badge: 'Послуга — White Label',
      title1: 'Лінкбілдинг, про який ваші клієнти',
      title2: 'ніколи не дізнаються, що він аутсорсований',
      desc: 'Агенційного рівня виконання лінкбілдингу під вашим брендом. Гостьові публікації, нішеві едити, крауд-посилання — під захистом NDA, зі white-label звітами та гарантією на 12 місяців.',
      cta: 'Стати партнером',
      ctaSecondary: 'Безкоштовний аудит',
    },
    whyItMatters: [
      { stat: '80+', label: 'активних агенцій-партнерів довіряють нам своїх клієнтів' },
      { stat: '9+', label: 'років постачаємо white-label лінк-кампанії' },
      { stat: '100%', label: 'захист NDA — клієнти ніколи не бачать нашого імені' },
      { stat: '12міс', label: 'гарантія заміни посилань на кожне розміщення' },
    ],
    benefits: [
      { icon: EyeOff, title: 'Повністю невидимі', desc: 'Ми працюємо як ваша in-house команда. Звіти приходять у вашому брендінгу, вся комунікація — через вас. Ваші клієнти ніколи не бачать нашого імені.' },
      { icon: Shield, title: 'NDA як стандарт', desc: 'Кожен партнер підписує NDA до початку роботи. Ваш список клієнтів, деталі кампаній та наші робочі стосунки залишаються конфіденційними назавжди.' },
      { icon: TrendingUp, title: 'Масштабуйтесь без найму', desc: 'Виграйте пʼять нових клієнтів завтра — ми виконаємо. Масштабуйтесь вгору чи вниз за дні, не місяці. Без рекрутингу, без тренування, без накладних.' },
      { icon: BarChart2, title: 'White-label звіти', desc: 'Брендовані PDF та Google Doc звіти, які ви одразу надсилаєте клієнтам. URL розміщення, DR, трафік, анкор — усе задокументовано для вас.' },
      { icon: Award, title: '23-точкова перевірка якості', desc: 'Кожен домен проходить наш чекліст: органічний трафік, спам-скор, релевантність ніші, відношення вихідних посилань, стан індексації, редакційна легітимність.' },
      { icon: RefreshCw, title: '12-місячна гарантія посилань', desc: 'Якщо будь-яке посилання зникне протягом 12 місяців, ми замінимо його безкоштовно. Без суперечок, без затримок — результати ваших клієнтів завжди захищені.' },
    ],
    benefitsSection: {
      badge: 'Чому агенції обирають нас',
      title: 'Усе, що потрібно вашій агенції',
      desc: 'Від першого посилання до повного управління кампаніями — створено для масштабування агенції без масштабування штату.',
    },
    linkTypes: [
      { name: 'Гостьові публікації', desc: 'Оригінальні, готові до публікації статті на нішевих сайтах з органчно вбудованими беклінками.', dr: 'DR 30–90+', time: '10–21 днів' },
      { name: 'Нішеві едити', desc: 'Контекстні посилання, вставлені в існуючий індексований контент на авторитетних доменах — швидко та потужно.', dr: 'DR 40–80+', time: '7–14 днів' },
      { name: 'Крауд-посилання', desc: 'Органічні згадки на форумах, Q&A-платформах та спільнотах, що будують натуральну різноманітність посилань.', dr: 'Варіативно', time: '5–10 днів' },
      { name: 'Редакційний аутріч', desc: 'Персоналізований аутріч до паблішерів та редакторів за справжні розміщення у високоповажних виданнях.', dr: 'DR 60–90+', time: '14–28 днів' },
    ],
    linkTypesSection: {
      title: 'Кожен тип посилань. Кожна ніша.',
      desc: 'Поєднуйте для побудови натурального, різноманітного профілю для кожного клієнта — під вашим брендом.',
    },
    process: [
      { num: '01', title: 'Безкоштовна консультація', desc: "Ми узгоджуємо стандарти якості, анкор-стратегію, формат звітів та white-label рамку. Без зобов'язань." },
      { num: '02', title: 'NDA та онбординг', desc: "Підпишіть NDA, налаштуйте брендовані шаблони звітів, проінструктуйте нашу команду про клієнтів. Запуск за тиждень." },
      { num: '03', title: 'Ми будуємо та звітуємо', desc: "Аутріч-спеціалісти та автори роблять усе. Брендовані звіти надходять за графіком — готові переслати клієнтам." },
      { num: '04', title: 'Масштабуйтесь разом', desc: "Персональний акаунт-менеджер підтримує якість на всіх кампаніях. Додавайте клієнтів будь-коли — ми ростемо разом." },
    ],
    processSection: {
      title: 'Від першого дзвінка до перших посилань — за 1 тиждень',
      desc: 'Без тривалого онбордингу. Без складних інтеграцій. Чиста передача та результати, які можна показати клієнтам.',
      cta: 'Почати партнерство',
    },
    tiers: [
      {
        name: 'Agency Starter',
        volume: '20–50 посилань/міс',
        price: 'Від $700/міс',
        highlight: false,
        features: [
          'Усі типи посилань включені',
          'Розміщення DR 20–60+',
          'Брендовані Google Doc звіти',
          'NDA як стандарт',
          'Виділений TG / WhatsApp канал',
          'Аналіз розриву посилань конкурентів',
          'Мапа анкор-стратегії',
          'Щомісячний підсумок результатів',
        ],
      },
      {
        name: 'Agency Growth',
        volume: '70–100 посилань/міс',
        price: 'Від $1,500/міс',
        highlight: true,
        features: [
          'Усі типи посилань включені',
          'Розміщення DR 30–80+',
          'Брендовані Google Doc звіти',
          'Пріоритетний таймлайн',
          'Виділений акаунт-менеджер',
          '12-місячна гарантія посилань',
          'Повна лінкбілдинг-стратегія',
          'Щотижневі оновлення прогресу',
          'Моніторинг анкор-співвідношення',
          'Відстеження розриву конкурентів',
        ],
      },
      {
        name: 'Agency Enterprise',
        volume: '100+ посилань/міс',
        price: 'Кастомні ціни',
        highlight: false,
        features: [
          'Повне управління кампаніями',
          'Редакційні опції DR 60–90+',
          'Кастомний дашборд звітності',
          'Мульти-клієнт портал',
          'SLA-угода',
          'Щомісячні стратегічні дзвінки',
          'Виділена контент-команда',
          'Доступ до мережі паблішерів',
          'Пріоритетне нішеве покриття',
          'Щоквартальний огляд стратегії',
        ],
      },
    ],
    tiersSection: {
      badge: 'Пакети',
      title: 'Партнерські ціни',
      desc: 'Гнучкі обʼємні рівні для агенцій будь-якого розміру. Усі плани включають NDA, white-label звіти та виділену контактну особу.',
      cta: 'Почати',
    },
    testimonials: [
      { name: 'Marcus D.', role: 'Head of Growth, SaaS-платформа', platform: 'Clutch', text: "Vladenza доставив саме те, що обіцяли — посилання DR 60+, натуральні анкори та видимі покращення ранжування за 8 тижнів. Клієнти вражені, а нам не довелося підняти пальця.", stars: 5 },
      { name: 'Elena V.', role: 'SEO Manager, iGaming-портал', platform: 'Clutch', text: "Ми пробували 4 лінкбілдинг-агенції раніше. Ця — єдина, що реально рухає голку в конкурентних нішах. White-label налаштування безшовне — клієнти думають, що в нас велика in-house команда.", stars: 5 },
      { name: 'James K.', role: 'Директор агенції, UK', platform: 'Clutch', text: "Ми потроїли базу лінкбілдинг-клієнтів за 18 місяців. Якість стабільно виняткова, а брендовані звіти достатньо професійні, щоб одразу йти клієнтам без жодного редагування.", stars: 5 },
      { name: 'Tom H.', role: 'Власник digital-агенції', platform: 'Fiverr', text: "Я перепродаю ці послуги своїм клієнтам. Якість стабільно висока, звіти чисті, посилання завжди з доменів зі справжнім трафіком. NDA означає, що я не хвилююсь про перехоплення клієнтів.", stars: 5 },
      { name: 'Andrei P.', role: 'CMO, Fintech-стартап', platform: 'Fiverr', text: "Їхня 23-точкова перевірка якості дає нам повну впевненість у кожному розміщенні. Жодних скарг клієнтів на якість посилань після переходу, а утримання клієнтів значно зросло.", stars: 5 },
    ],
    testimonialsSection: {
      title: 'Що кажуть агенції-партнери',
      desc: '80+ агенцій довіряють нам виконувати свій лінкбілдинг — невидимо, надійно, масштабно.',
      ratingText: 'від 80+ агенцій-партнерів',
      allReviews: 'Усі відгуки',
    },
    faqs: [
      { q: 'Що таке White Label лінкбілдинг послуги?', a: 'White label лінкбілдинг послуги дозволяють вашій агенції пропонувати якісні беклінки, які ми будуємо від вашого імені як ваші власні. Це дає вам можливість надати клієнтам комплексні рішення лінкбілдингу без виконання роботи in-house — повний сервіс без накладних на побудову внутрішньої команди.' },
      { q: 'Чи можу я впливати на стратегію лінкбілдингу?', a: 'Абсолютно. Як довірений white-label провайдер, ми тісно співпрацюємо з вашою агенцією, щоб стратегія відповідала вашим вподобанням. Наш підхід повністю адаптований під конкретні вимоги та цілі клієнтів — від співвідношення анкорів до цільових DR-діапазонів та нішевого фокусу.' },
      { q: 'Які беклінки я можу очікувати?', a: 'Усі беклінки, які ми створюємо, — якісні do-follow посилання з репутабельних, нішево-релевантних сайтів. Вони здобуті через ручний аутріч та розміщення контенту, що забезпечує їм справжню авторитетність та цінність для ранжування сайтів ваших клієнтів. Без PBN, без лінк-ферм, без перепроданих розміщень.' },
      { q: 'Чи є техніки лінкбілдингу white hat?', a: 'Так, ми використовуємо 100% white hat, етичні методи лінкбілдингу. Це гарантує довговічність та ефективність посилань, зберігаючи сайти клієнтів безпечними від штрафів Google. Кожне розміщення проходить нашу 23-точкову перевірку якості перед публікацією.' },
      { q: 'Як White Label лінкбілдинг послуги допомагають SEO-агенціям?', a: null, list: [
        'Якісні беклінки, що підвищують ранжування та органічний трафік клієнтів',
        'Економія коштів — значно дешевше, ніж утримання in-house команди',
        'Своєчасна доставка — надійно виконуйте дедлайни клієнтів щоразу',
        'Масштабованість — обробляйте раптові сплески попиту без втрати якості',
        'Доступ до експертизи — досвідчені аутріч-спеціалісти та мережі паблішерів',
        'Do-follow посилання — максимізуйте SEO-вплив з ефективними, довговічними беклінками',
        'Задоволеність клієнтів — утримуйте клієнтів, стабільно доставляючи вимірювані результати',
        'Побудова бренду — підсилюйте репутацію агенції детальними брендованими звітами',
        'Довгострокова стратегія — безперервне покращення, а не разові здобутки',
        'Широка мережа паблішерів — доступ до різноманітних якісних паблішерів у 40+ нішах',
      ] },
      { q: 'Як ви забезпечуєте якість посилань?', a: 'Наші аутріч-спеціалісти ретельно відсіюють усі цільові сайти за авторитетністю домену, релевантністю, трафіком та редакційними стандартами. In-house автори створюють якісний контент, гарантуючи, що кожен беклінк відповідає нашим суворим стандартам якості. Кожен домен перевіряється вручну — жоден автоматизований інструмент не приймає фінальне рішення.' },
      { q: 'Чи знатимуть мої клієнти, що я аутсорсю лінкбілдинг?', a: 'Ні. Наші послуги повністю white-label — усі результати, звіти та аналізи подаються як ваша власна робота. NDA забезпечує повну конфіденційність протягом усього процесу. Ми — ваш невидимий партнер.' },
      { q: 'Що стається, якщо посилання зникне або клієнт буде незадоволений?', a: 'Ми пропонуємо безкоштовну заміну посилань, якщо будь-яке зникне протягом 12 місяців, хоча це рідкість. Ми також замінюємо посилання, що не відповідають погодженим очікуванням у визначений термін, для забезпечення задоволеності клієнта — без суперечок, без затримок.' },
      { q: 'Чи можливий white-label трекінг беклінків?', a: 'Так. Ваш виділений акаунт-менеджер надає щотижневі оновлення по всіх замовленнях на лінкбілдинг. Ви можете відстежувати кожен беклінк через white-label звіт, який включає живі URL, DR, оцінки трафіку та використаний анкор-текст.' },
      { q: 'Як визначається ціна?', a: 'Ціна залежить від таких факторів, як кількість посилань на місяць, авторитетність цільових сайтів та складність ніші. Ми пропонуємо гнучкі обʼємні рівні під різні бюджети, з повною прозорістю та без прихованих витрат. Enterprise-клієнти отримують кастомні пропозиції.' },
      { q: 'Який типовий час виконання?', a: 'Для гостьових публікацій та нішевих едитів перші посилання зазвичай зʼявляються за 10–21 днів. Крауд-посилання швидші — зазвичай 5–10 днів. Після онбордингу (близько тижня) кампанії працюють у безперервному щомісячному циклі зі стабільною доставкою.' },
      { q: 'Чому варто обрати вас як white-label лінкбілдинг партнера?', a: '9+ років досвіду лінкбілдингу, 80+ активних агенцій-партнерів, 23-точкова перевірка якості на кожне розміщення, партнерства під захистом NDA, 12-місячна гарантія заміни та виділений акаунт-менеджер з першого дня. Ми не просто виконуємо — ми допомагаємо вашій агенції рости.' },
    ],
    faqSection: {
      title: 'Поширені питання',
      desc: 'Усе, що агенції запитують перед тим, як стати партнером.',
    },
  },
} as const;

const faviconMap: Record<string, string> = {
  Clutch: 'clutch.co',
  Fiverr: 'fiverr.com',
};

function PlatformIcon({ favicon, alt }: { favicon: string; alt: string }) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${favicon}&sz=64`}
      alt={alt}
      width={14}
      height={14}
      style={{ borderRadius: 3, display: 'inline-block' }}
    />
  );
}

/* ── Sub-components ───────────────────────────────────────── */

function FaqItem({ q, a, list }: { q: string; a: string | null; list?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={15} className="text-gray-400 shrink-0 ml-4" />
          : <ChevronDown size={15} className="text-gray-400 shrink-0 ml-4" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-50">
          {a && <div className="pt-4">{a}</div>}
          {list && (
            <ul className="pt-4 flex flex-col gap-2">
              {list.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle size={13} className="text-[#F97316] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */

export default function WhiteLabelPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

  const WL_PKG: Package = {
    name: locale === 'uk' ? 'White Label партнерство' : 'White Label Partnership',
    price: locale === 'uk' ? 'Індивідуальна ціна' : 'Custom',
    links: locale === 'uk' ? 'Виконання для агенції' : 'Agency fulfilment',
    service: 'White Label Link Building',
  };

  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/white-label')}`, 
  });

  return (
    <ServicePageLayout defaultService="White Label Link Building">
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />

      {/* ── Hero — dark like AI/LLM ───────────────────────── */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gray-950">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="wlGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.18"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="wlGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.08"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="1300" cy="200" rx="500" ry="400" fill="url(#wlGlow1)"/>
          <ellipse cx="150" cy="450" rx="380" ry="300" fill="url(#wlGlow2)"/>
          <circle cx="1200" cy="150" r="320" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.15"/>
          <circle cx="1200" cy="150" r="220" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.18"/>
          <circle cx="1200" cy="150" r="120" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.22"/>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`wl-${row}-${col}`} cx={col * 50 + 30} cy={row * 50 + 30} r="1.5" fill="#F97316" opacity={0.07} />
            ))
          )}
          <line x1="0" y1="600" x2="500" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.07"/>
          <line x1="80" y1="600" x2="580" y2="0" stroke="#F97316" strokeWidth="0.8" opacity="0.05"/>
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Lock size={11} />
              {c.hero.badge}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.08] tracking-tight mb-6">
              {c.hero.title1}<br />
              <span className="text-[#F97316]">{c.hero.title2}</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              {c.hero.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedPkg(WL_PKG)}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                {c.hero.cta} <ArrowRight size={14} />
              </button>
              <button
                onClick={() => setSelectedPkg(WL_PKG)}
                className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 flex items-center gap-2"
              >
                <Zap size={13} className="text-[#F97316]" /> {c.hero.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.whyItMatters.map((item) => (
              <div key={item.stat} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-[#F97316] mb-2">{item.stat}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.benefitsSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.benefitsSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              {c.benefitsSection.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.benefits.map((b) => (
              <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <b.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What we build ────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{c.linkTypesSection.title}</h2>
            <p className="text-gray-400 text-sm">{c.linkTypesSection.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {c.linkTypes.map((lt) => (
              <div key={lt.name} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-full px-5 py-2.5 hover:border-[#F97316]/30 transition-all group">
                <FileText size={13} className="text-[#F97316]" />
                <span className="text-sm font-medium text-gray-800">{lt.name}</span>
                <span className="text-xs text-gray-400">{lt.dr}</span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock size={10} />{lt.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process — dark ───────────────────────────────── */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">{c.processSection.title}</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">{c.processSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.process.map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#F97316]/30 transition-all duration-300">
                <div className="text-[#F97316] font-black text-sm mb-3">{step.num}</div>
                <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button
              onClick={() => setSelectedPkg(WL_PKG)}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg"
            >
              {c.processSection.cta} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Packages ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.tiersSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.tiersSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
              {c.tiersSection.desc}
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {c.tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-7 border transition-all ${tier.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-gray-950 border-white/10 hover:border-white/20'}`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${tier.highlight ? 'text-white/80' : 'text-gray-400'}`}>
                  {tier.volume}
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                <div className={`text-2xl font-black mb-6 mt-4 text-white`}>{tier.price}</div>
                <div className="flex flex-col gap-2.5 mb-8">
                  {tier.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={13} className={tier.highlight ? 'text-white' : 'text-[#F97316]'} />
                      <span className={`text-sm ${tier.highlight ? 'text-white/90' : 'text-gray-300'}`}>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedPkg({ name: tier.name, price: tier.price, links: tier.volume, service: 'White Label Link Building' })}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${tier.highlight ? 'bg-white text-[#F97316] hover:bg-gray-100' : 'bg-[#F97316] hover:bg-[#EA580C] text-white'}`}
                >
                  {c.tiersSection.cta} <ArrowRight size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 mb-3">
              {c.testimonialsSection.title}
            </h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              {c.testimonialsSection.desc}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.testimonials.map((t) => {
              const favicon = faviconMap[t.platform];
              return (
                <div
                  key={t.name}
                  className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-sm hover:border-gray-200 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <Star key={i} size={12} className="fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {favicon && <PlatformIcon favicon={favicon} alt={t.platform} />}
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{t.platform}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed flex-1">"{t.text}"</p>

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316] font-bold text-xs">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-900">{t.name}</div>
                      <div className="text-[10px] text-gray-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-6 py-4 shadow-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} className="fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-gray-900">4.9 / 5.0</span>
                <span className="text-gray-400 ml-1.5">{c.testimonialsSection.ratingText}</span>
              </div>
              <a
                href={lp('/reviews')}
                className="flex items-center gap-1 text-xs text-[#F97316] font-semibold hover:underline ml-2"
              >
                {c.testimonialsSection.allReviews} <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">{c.faqSection.title}</h2>
            <p className="text-gray-500 text-sm">{c.faqSection.desc}</p>
          </div>
          <div className="flex flex-col gap-3">
            {c.faqs.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} list={'list' in f ? f.list : undefined} />)}
          </div>
        </div>
      </section>
    </ServicePageLayout>
  );
}
