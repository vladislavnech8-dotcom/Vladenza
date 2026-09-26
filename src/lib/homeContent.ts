import { type Locale } from './i18n';
import { PRICING, PRICING_LABELS_EN, PRICING_LABELS_UK, COVERAGE_LABELS_EN, COVERAGE_LABELS_UK } from '../data/pricing';

export interface HomePageContent {
  seo: { title: string; description: string };
  hero: { eyebrow: string; h1: string; body: string; ctaPrimary: string; ctaSecondary: string };
  proof: { items: Array<{ value: string; label: string }> };
  twoWays: {
    heading: string;
    individual: { title: string; body: string; points: string[]; cta: string };
    managed: { title: string; body: string; points: string[]; cta: string };
  };
  placementTypes: {
    heading: string;
    items: Array<{ name: string; desc: string; bestFor: string; href: string }>;
  };
  process: {
    heading: string;
    steps: Array<{ title: string; desc: string }>;
  };
  placements: { heading: string; body: string; empty: string; ctaLabel: string; note: string };
  caseStudies: { heading: string; body: string; readLabel: string; ctaLabel: string };
  pricing: {
    heading: string;
    items: Array<{ name: string; price: string; coverage?: string }>;
  };
  fit: {
    heading: string;
    goodFit: string;
    goodItems: string[];
    notFit: string;
    notItems: string[];
  };
  faq: { heading: string; items: Array<{ q: string; a: string }> };
  finalCta: { heading: string; body: string; ctaPrimary: string; ctaSecondary: string; reassurance: string };
}

export const homePageContent: Record<Locale, HomePageContent> = {
  en: {
    seo: {
      title: 'Vladenza — Manual Link Building Services | Guest Posts, Link Insertions & Crowd Marketing',
      description: 'Manual link building with website approval, transparent reporting and ongoing link monitoring. Guest posts, link insertions and crowd marketing for brands and agencies.',
    },
    hero: {
      eyebrow: 'Link Building for Brands & Agencies',
      h1: 'Manual Link Building, Planned Around Your Website',
      body: 'Guest posts, link insertions and relevant community placements — selected, approved, reported and monitored by one experienced team.',
      ctaPrimary: 'Get a Link Plan',
      ctaSecondary: 'Browse Real Placements',
    },
    proof: {
      items: [
        { value: '8+', label: 'Years in Link Building' },
        { value: '3,000+', label: 'Completed Orders' },
        { value: 'Manual', label: 'Website Review' },
        { value: 'Link Care', label: 'Ongoing Monitoring' },
      ],
    },
    twoWays: {
      heading: 'Choose How You Want to Work',
      individual: {
        title: 'Individual Placements',
        body: 'Choose the placement type, quality range and quantity. We review the requirements and send available websites for approval before publication.',
        points: ['Guest Posts', 'Link Insertions', 'Crowd Marketing', 'Website approval', 'Clear per-placement reporting'],
        cta: 'Explore Placements',
      },
      managed: {
        title: 'Managed Campaigns',
        body: 'We review your backlink profile, competitors, target pages and anchors, then build and manage a practical monthly link plan around your website and budget.',
        points: ['Backlink and competitor review', 'Target-page and anchor plan', 'Mixed placement strategy', 'Monthly reporting', 'Link monitoring'],
        cta: 'Get a Campaign Plan',
      },
    },
    placementTypes: {
      heading: 'One Link-Building System. Three Placement Types.',
      items: [
        { name: 'Guest Posts', desc: 'New articles built around an approved topic, target page and link context.', bestFor: 'Editorial placements and controlled topical context.', href: '/services/guest-posting' },
        { name: 'Link Insertions', desc: 'Links added to relevant articles that are already published.', bestFor: 'Contextual placements inside existing content.', href: '/services/niche-edits' },
        { name: 'Crowd Marketing', desc: 'Relevant mentions in forums, Q&A platforms and online communities.', bestFor: 'Referring-domain diversity, brand presence and referral opportunities.', href: '/services/crowd-links' },
      ],
    },
    process: {
      heading: 'From Website Review to Link Care',
      steps: [
        { title: 'Review', desc: 'Website, backlink profile and competitor review.' },
        { title: 'Plan', desc: 'Target pages, anchors, placement types and budget allocation.' },
        { title: 'Approve', desc: 'The client reviews websites, topics and placement requirements.' },
        { title: 'Place', desc: 'Manual outreach, content preparation and publication.' },
        { title: 'Monitor', desc: 'Live-link report, scheduled checks and coverage according to the placement type.' },
      ],
    },
    placements: {
      heading: 'Review Real Placements Before You Start',
      body: 'Browse real examples of placements we\u2019ve delivered across different link types, niches, DR levels and traffic ranges.',
      empty: 'Examples coming soon for this service.',
      ctaLabel: 'Explore All Placements',
      note: 'Metrics sourced from Ahrefs and may change over time. DR = Domain Rating. Traffic = estimated monthly organic visits.',
    },
    caseStudies: {
      heading: 'Real Campaigns. Measurable Outcomes.',
      body: 'Real client campaigns with documented link-building and organic search results.',
      readLabel: 'Read Case Study',
      ctaLabel: 'Explore All Case Studies',
    },
    pricing: {
      heading: 'Clear Starting Points',
      items: [
        { name: 'Link Insertions', price: PRICING_LABELS_EN.linkInsertions, coverage: COVERAGE_LABELS_EN.linkInsertions },
        { name: 'Guest Posts', price: PRICING_LABELS_EN.guestPosts, coverage: COVERAGE_LABELS_EN.guestPosts },
        { name: 'Crowd Marketing', price: PRICING_LABELS_EN.crowdMarketing, coverage: COVERAGE_LABELS_EN.crowdMarketing },
        { name: 'Managed Campaigns', price: PRICING_LABELS_EN.managedCampaigns },
        { name: 'White Label', price: PRICING_LABELS_EN.whiteLabel },
      ],
    },
    fit: {
      heading: 'When Vladenza Is the Right Fit',
      goodFit: 'Good fit',
      goodItems: [
        'Brands with an active website and clear commercial priorities',
        'In-house SEO teams and agencies',
        'Projects that need controlled referring-domain growth',
        'Clients willing to review a plan and approve placements',
        'Ongoing campaigns with a realistic 3\u20136 month horizon',
      ],
      notFit: 'Not a fit',
      notItems: [
        'Guaranteed rankings or instant SEO results',
        'Automated bulk links without manual review',
        'PBN campaigns',
        'Guaranteed indexing',
        'Russian-language market promotion',
        'Clients who do not want to provide target URLs, priorities or approvals',
      ],
    },
    faq: {
      heading: 'Questions Before You Buy',
      items: [
        { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual orders, we source within the selected DR and traffic range and review each placement before it goes live.' },
        { q: 'Which placement type should I choose?', a: 'It depends on your current backlink profile, competitors, target pages and budget. Link insertions are faster because the article already exists. Guest posts give you more control over topic and context. Crowd marketing adds diversity. Most campaigns use a mix.' },
        { q: 'Can you build and manage the complete strategy?', a: 'Yes. For managed campaigns we review your backlink profile, competitors, target pages and anchors, then build and run a monthly link plan around your website and budget.' },
        { q: 'How long does delivery take?', a: 'Link insertions typically take 3\u20137 days. Guest posts take 10\u201321 days because a new article needs to be written and published. Crowd marketing is delivered in 5\u201310 days.' },
        { q: 'Do you guarantee indexing or rankings?', a: 'No. No link-building method is completely safe. Rankings depend on many factors outside our control. We guarantee manual placement on real websites within the selected metrics, not indexing or ranking positions.' },
        { q: 'What happens if a placement is removed?', a: 'Crowd marketing has 30-day replacement coverage. Guest posts and link insertions have 12-month coverage. If a placement is removed within the coverage period, contact us and we will replace it.' },
        { q: 'Can agencies use Vladenza as a white-label partner?', a: 'Yes. We provide silent fulfilment for agencies with volume tiers, custom pricing and full transparency. You manage the client relationship while we handle placement.' },
        { q: 'What is included in reporting and monitoring?', a: 'Every order includes a live-link report with publisher domain, DR, traffic and screenshot. Scheduled checks confirm links remain live, with replacement coverage according to the placement type.' },
      ],
    },
    finalCta: {
      heading: 'Build a Link Plan Around Your Website',
      body: 'Send us your website, target market and budget. We\u2019ll review the backlink profile and recommend a practical mix of placements.',
      ctaPrimary: 'Get a Link Plan',
      ctaSecondary: 'Browse Placements',
      reassurance: 'Free initial review \u00b7 Reply within one business day \u00b7 No obligation',
    },
  },
  uk: {
    seo: {
      title: 'Vladenza — Ручний лінкбілдинг | Гостьові публікації, розміщення посилань та крауд-маркетинг',
      description: 'Ручний лінкбілдинг з погодженням сайтів, прозорою звітністю та моніторингом посилань. Гостьові публікації, розміщення посилань та крауд-маркетинг для брендів та агенцій.',
    },
    hero: {
      eyebrow: 'Лінкбілдинг для брендів та агенцій',
      h1: 'Ручний лінкбілдинг, спланований під ваш сайт',
      body: 'Гостьові публікації, розміщення посилань у готових статтях і доречні згадки в спільнотах — з погодженням, звітністю та моніторингом.',
      ctaPrimary: 'Отримати план лінкбілдингу',
      ctaSecondary: 'Переглянути приклади розміщень',
    },
    proof: {
      items: [
        { value: '8+', label: 'років у лінкбілдингу' },
        { value: '3 000+', label: 'виконаних замовлень' },
        { value: 'Ручна', label: 'перевірка сайтів' },
        { value: 'Link Care', label: 'моніторинг посилань' },
      ],
    },
    twoWays: {
      heading: 'Оберіть формат співпраці',
      individual: {
        title: 'Окремі розміщення',
        body: 'Оберіть тип розміщення, параметри та кількість. Ми перевіримо вимоги й надішлемо доступні сайти на погодження до публікації.',
        points: ['Гостьові публікації', 'Розміщення посилань', 'Крауд-маркетинг', 'Погодження сайтів', 'Звітність за кожним розміщенням'],
        cta: 'Переглянути розміщення',
      },
      managed: {
        title: 'Комплексні кампанії',
        body: 'Ми аналізуємо посилальний профіль, конкурентів, цільові сторінки й анкори, а потім формуємо та ведемо практичний щомісячний план у межах вашого бюджету.',
        points: ['Аналіз посилань і конкурентів', 'План цільових сторінок та анкорів', 'Комбінована стратегія розміщень', 'Щомісячна звітність', 'Моніторинг посилань'],
        cta: 'Отримати план кампанії',
      },
    },
    placementTypes: {
      heading: 'Одна система лінкбілдингу. Три типи розміщень.',
      items: [
        { name: 'Гостьові публікації', desc: 'Нові статті, створені навколо погодженої теми, цільової сторінки та контексту посилання.', bestFor: 'Редакційні розміщення з контрольованою тематикою.', href: '/services/guest-posting' },
        { name: 'Розміщення посилань', desc: 'Посилання, додані до релевантних уже опублікованих статей.', bestFor: 'Контекстні розміщення в існуючому контенті.', href: '/services/niche-edits' },
        { name: 'Крауд-маркетинг', desc: 'Доречні згадки на форумах, Q&A-платформах та онлайн-спільнотах.', bestFor: 'Різноманіття реферальних доменів, присутність бренду та реферальний трафік.', href: '/services/crowd-links' },
      ],
    },
    process: {
      heading: 'Від аналізу сайту до Link Care',
      steps: [
        { title: 'Аналіз', desc: 'Сайт, посилальний профіль і конкуренти.' },
        { title: 'План', desc: 'Цільові сторінки, анкори, типи розміщень і розподіл бюджету.' },
        { title: 'Погодження', desc: 'Клієнт перевіряє сайти, теми та умови розміщення.' },
        { title: 'Розміщення', desc: 'Ручний аутріч, підготовка контенту та публікація.' },
        { title: 'Моніторинг', desc: 'Звіт із live-посиланнями, планові перевірки й покриття відповідно до типу розміщення.' },
      ],
    },
    placements: {
      heading: 'Перегляньте реальні розміщення до початку роботи',
      body: 'Перегляньте реальні приклади розміщень, які ми виконали — за типами посилань, нішами, DR та рівнями трафіку.',
      empty: 'Приклади для цієї послуги з\u2019являться скоро.',
      ctaLabel: 'Усі приклади розміщень',
      note: 'Метрики з Ahrefs, можуть змінюватися з часом. DR = Domain Rating. Трафік = оцінка органічних відвідувань на місяць.',
    },
    caseStudies: {
      heading: 'Реальні кампанії. Вимірювані результати.',
      body: 'Реальні клієнтські кампанії з задокументованими результатами лінкбілдингу та органічного пошуку.',
      readLabel: 'Читати кейс',
      ctaLabel: 'Усі кейси',
    },
    pricing: {
      heading: 'Зрозуміла початкова вартість',
      items: [
        { name: 'Розміщення посилань', price: PRICING_LABELS_UK.linkInsertions, coverage: COVERAGE_LABELS_UK.linkInsertions },
        { name: 'Гостьові публікації', price: PRICING_LABELS_UK.guestPosts, coverage: COVERAGE_LABELS_UK.guestPosts },
        { name: 'Крауд-маркетинг', price: PRICING_LABELS_UK.crowdMarketing, coverage: COVERAGE_LABELS_UK.crowdMarketing },
        { name: 'Комплексні кампанії', price: PRICING_LABELS_UK.managedCampaigns },
        { name: 'White Label', price: PRICING_LABELS_UK.whiteLabel },
      ],
    },
    fit: {
      heading: 'Коли Vladenza — відповідний партнер',
      goodFit: 'Підходить',
      goodItems: [
        'Бренди з активним сайтом і чіткими комерційними пріоритетами',
        'In-house SEO-команди та агенції',
        'Проєкти, що потребують контрольованого зростання реферальних доменів',
        'Клієнти, готові оглядати план і погоджувати розміщення',
        'Поточні кампанії з реалістичним горизонтом 3\u20136 місяців',
      ],
      notFit: 'Не підходить',
      notItems: [
        'Гарантовані позиції або миттєві SEO-результати',
        'Автоматизовані масові посилання без ручної перевірки',
        'PBN-кампанії',
        'Гарантовані індексація',
        'Просування на ринку російською мовою',
        'Клієнти, які не хочуть надавати цільові URL, пріоритети чи погодження',
      ],
    },
    faq: {
      heading: 'Запитання перед замовленням',
      items: [
        { q: 'Чи можу я погоджувати сайти перед розміщенням?', a: 'Так. Для великих кампаній ми надаємо план розміщень перед початком outreach. Для індивідуальних замовлень ми підбираємо сайти в обраному діапазоні та перевіряємо кожне розміщення перед публікацією.' },
        { q: 'Який тип розміщення мені обрати?', a: 'Це залежить від вашого профілю посилань, конкурентів, цільових сторінок та бюджету. Розміщення посилань швидші, бо стаття вже існує. Гостьові публікації дають більше контролю над темою та контекстом. Крауд-маркетинг додає розмаїття. Більшість кампаній використовують комбінацію.' },
        { q: 'Чи можете ви побудувати та вести повну стратегію?', a: 'Так. Для комплексних кампаній ми аналізуємо посилальний профіль, конкурентів, цільові сторінки та анкори, а потім формуємо та ведемо щомісячний план у межах вашого бюджету.' },
        { q: 'Скільки часу займає виконання?', a: 'Розміщення посилань зазвичай займає 3\u20137 днів. Гостьові публікації — 10\u201321 днів, оскільки потрібно написати та опублікувати нову статтю. Крауд-маркетинг виконується за 5\u201310 днів.' },
        { q: 'Чи гарантуєте ви індексацію або позиції?', a: 'Ні. Жоден метод лінкбілдингу не є повністю безпечним. Позиції залежать від багатьох факторів поза нашим контролем. Ми гарантуємо ручне розміщення на реальних сайтах у межах обраних метрик, а не індексацію чи позиції в пошуку.' },
        { q: 'Що відбувається, якщо розміщення зникає?', a: 'Крауд-маркетинг має 30-денне покриття заміни. Гостьові публікації та розміщення посилань мають 12-місячне покриття. Якщо розміщення зникає протягом періоду покриття, зверніться до нас — ми замінимо його.' },
        { q: 'Чи можуть агенції використовувати Vladenza як white-label партнера?', a: 'Так. Ми надаємо тиху реалізацію для агенцій з обсяговими тарифами, індивідуальними цінами та повною прозорістю. Ви керуєте стосунками з клієнтом, а ми виконуємо розміщення.' },
        { q: 'Що включено у звітність і моніторинг?', a: 'Кожне замовлення включає звіт із live-посиланнями, доменом паблішера, DR, трафіком та скріншотом. Планові перевірки підтверджують, що посилання залишаються активними, з покриттям заміни відповідно до типу розміщення.' },
      ],
    },
    finalCta: {
      heading: 'Побудуємо план лінкбілдингу під ваш сайт',
      body: 'Надішліть сайт, цільовий ринок і бюджет. Ми проаналізуємо посилальний профіль та запропонуємо практичне поєднання розміщень.',
      ctaPrimary: 'Отримати план',
      ctaSecondary: 'Переглянути розміщення',
      reassurance: 'Безкоштовний первинний аналіз · Відповідь протягом одного робочого дня · Без зобов\u2019язань',
    },
  },
};
