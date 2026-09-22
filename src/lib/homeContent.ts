import { type Locale } from './i18n';

// ─── HomePage Content ───────────────────────────────────────────

export interface HomePageContent {
  seo: { title: string; description: string };
  labels: { bestFor: string; from: string };
  hero: {
    badge: string;
    h1Line1: string;
    h1Line2: string;
    body: string;
    subtext: string;
    ctaPrimary: string;
    ctaSecondary: string;
    cardTitle: string;
    cardBody: string;
    cardNotSure: string;
    cardNotSureBody: string;
    cardCta: string;
  };
  proof: { years: string; yearsLabel: string; orders: string; ordersLabel: string; manual: string; manualLabel: string };
  products: {
    sectionTitle: string;
    sectionBody: string;
    items: Array<{ name: string; desc: string; best: string; viewLabel: string; placementsLabel: string }>;
  };
  clients: { badge: string; title: string; body: string };
  placements: { title: string; body: string; empty: string; ctaLabel: string; countLabel: string };
  campaigns: { title: string; body: string; readLabel: string; ctaLabel: string };
  secondary: { title: string; body: string; items: Array<{ label: string; desc: string }> };
  faq: { title: string; body: string; items: Array<{ q: string; a: string }> };
  finalCta: { title: string; body: string; ctaPrimary: string; ctaSecondary: string };
}

export const homePageContent: Record<Locale, HomePageContent> = {
  en: {
    labels: { bestFor: 'Best for:', from: 'From' },
    seo: {
      title: 'Vladenza — Link Building Services | Link Insertions, Guest Posts & Crowd Marketing',
      description: 'Buy niche edits, guest posts and crowd links individually or combined into a link-building plan. From $70 per placement. 8+ years in link building.',
    },
    hero: {
      badge: 'Link Building Agency',
      h1Line1: 'Link Building Services —',
      h1Line2: 'From Individual Links to Full Campaigns',
      body: 'Order niche edits, guest posts and community links individually — or let us build a custom link-building campaign around your website, competitors and budget.',
      subtext: '8+ years in link building · 3,000+ completed orders',
      ctaPrimary: 'Explore Link Building Services',
      ctaSecondary: 'Get a Link Plan',
      cardTitle: 'Build Your Link Campaign',
      cardBody: 'Choose individual placements or combine them into a campaign.',
      cardNotSure: 'Not sure what to choose?',
      cardNotSureBody: "We'll review your backlink profile and recommend the mix.",
      cardCta: 'Get a Link Plan',
    },
    proof: { years: '8+', yearsLabel: 'Years in Link Building', orders: '3,000+', ordersLabel: 'Completed Orders', manual: 'Manual', manualLabel: 'Link Building' },
    products: {
      sectionTitle: 'Choose How You Want to Build Links',
      sectionBody: 'Buy individual placements or combine different link types into a broader campaign.',
      items: [
        { name: 'Link Insertions', desc: 'Links added inside existing, relevant articles.', best: 'contextual authority links', viewLabel: 'View', placementsLabel: 'See real placements' },
        { name: 'Guest Posts', desc: 'New articles published with your backlink included naturally in the content.', best: 'new content & target pages', viewLabel: 'View', placementsLabel: '' },
        { name: 'Crowd Marketing', desc: 'Contextual mentions in forums and relevant online discussions.', best: 'backlink diversity & natural link profiles', viewLabel: 'View', placementsLabel: '' },
      ],
    },
    clients: { badge: 'Selected Clients', title: "Companies We've Worked With", body: 'A selection of businesses we\u2019ve supported with link-building campaigns.' },
    placements: { title: 'See the Links Before You Buy', body: 'Browse real examples of placements we\u2019ve delivered across different link types, niches, DR levels and traffic ranges.', empty: 'Examples coming soon for this service.', ctaLabel: 'Explore All Placement Examples', countLabel: 'real placements across Link Insertions, Guest Posts & Crowd Marketing' },
    campaigns: { title: 'Real Campaigns. Real Outcomes.', body: 'Real client campaigns with documented link-building and organic search results.', readLabel: 'Read Case Study', ctaLabel: 'Explore All Case Studies' },
    secondary: {
      title: 'Need More Than Link Building?',
      body: 'Additional SEO services for clients who need strategy, analysis or broader search visibility.',
      items: [
        { label: 'Local SEO & Link Building', desc: 'Build geographically relevant authority and strengthen local organic visibility.' },
        { label: 'SEO Audit & Strategy', desc: 'Technical, content, competitor and backlink analysis with an actionable roadmap.' },
        { label: 'AI & LLM Visibility', desc: 'Improve how your brand is discovered and referenced across AI-driven search experiences.' },
      ],
    },
    faq: {
      title: 'Questions Before You Buy',
      body: 'Honest answers to the things that matter before ordering.',
      items: [
        { q: 'What type of backlinks should I choose?', a: 'It depends on your current backlink profile, competitors, target pages and budget. Niche edits are faster and cheaper because the article already exists. Guest posts give you more control over topic and context. Crowd links add diversity. Most campaigns use a mix.' },
        { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual niche edit orders, we source within the selected DR and traffic range and review each placement before it goes live.' },
        { q: 'Can I provide my own target URLs and anchors?', a: 'Yes. You can provide preferred anchors during checkout or send them after payment. You can also let us recommend anchors based on your current backlink profile and target pages.' },
        { q: 'How long does delivery take?', a: 'Niche edits typically take 3\u20137 days. Guest posts take 10\u201321 days because a new article needs to be written and published. Crowd links are delivered in 5\u201310 days.' },
        { q: 'Can I order links individually?', a: 'Yes. You can buy a single niche edit, one guest post, or a small batch of crowd links. There is no minimum order. You can also combine different link types in the same checkout.' },
        { q: 'Do you guarantee rankings?', a: 'No. No link-building service can guarantee specific search rankings. Rankings depend on many factors outside our control, including algorithm updates, competitor activity and on-page signals. We guarantee manual placement on real websites within the selected metrics.' },
      ],
    },
    finalCta: { title: 'Not Sure Which Links You Need?', body: 'Send us your website and budget. We\u2019ll review your backlink profile and recommend a practical link-building mix.', ctaPrimary: 'Get a Custom Link Plan', ctaSecondary: 'Explore Link Services' },
  },
  uk: {
    labels: { bestFor: 'Найкраще для:', from: 'Від' },
    seo: {
      title: 'Vladenza — Послуги з лінкбілдингу | Гостьові публікації та крауд-маркетинг',
      description: 'Замовляйте розміщення посилань, гостьові публікації та крауд-посилання окремо або в складі плану лінкбілдингу. Від $70 за розміщення. 8+ років у лінкбілдингу.',
    },
    hero: {
      badge: 'Агенція лінкбілдингу',
      h1Line1: 'Послуги лінкбілдингу —',
      h1Line2: 'Від окремих посилань до повних кампаній',
      body: 'Замовляйте розміщення посилань, гостьові публікації та крауд-посилання окремо — або довірте нам створення індивідуальної кампанії лінкбілдингу під ваш сайт, конкурентів та бюджет.',
      subtext: '8+ років у лінкбілдингу · 3,000+ виконаних замовлень',
      ctaPrimary: 'Огляд послуг лінкбілдингу',
      ctaSecondary: 'Отримати план посилань',
      cardTitle: 'Створіть свою кампанію',
      cardBody: 'Оберіть окремі розміщення або поєднайте їх у кампанію.',
      cardNotSure: 'Не знаєте, що обрати?',
      cardNotSureBody: 'Ми проаналізуємо ваш профіль посилань і порадимо оптимальний набір.',
      cardCta: 'Отримати план посилань',
    },
    proof: { years: '8+', yearsLabel: 'Років у лінкбілдингу', orders: '3,000+', ordersLabel: 'Виконаних замовлень', manual: 'Ручна', manualLabel: 'Робота з посиланнями' },
    products: {
      sectionTitle: 'Оберіть спосіб лінкбілдингу',
      sectionBody: 'Купуйте окремі розміщення або поєднуйте різні типи посилань у ширшу кампанію.',
      items: [
        { name: 'Розміщення посилань', desc: 'Посилання в існуючих релевантних статтях.', best: 'контекстні авторитетні посилання', viewLabel: 'Переглянути', placementsLabel: 'Приклади розміщень' },
        { name: 'Гостьові публікації', desc: 'Нові статті з вашим посиланням, органично вписаним у контент.', best: 'новий контент та цільові сторінки', viewLabel: 'Переглянути', placementsLabel: '' },
        { name: 'Крауд-посилання', desc: 'Контекстні згадки на форумах та у тематичних обговореннях.', best: 'розмаїття посилань та природний профіль', viewLabel: 'Переглянути', placementsLabel: '' },
      ],
    },
    clients: { badge: 'Наші клієнти', title: 'Компанії, з якими ми працювали', body: 'Вибірка компаній, які ми підтримали кампаніями лінкбілдингу.' },
    placements: { title: 'Побачте посилання до покупки', body: 'Перегляньте реальні приклади розміщень, які ми виконали — за типами посилань, нішами, DR та рівнями трафіку.', empty: 'Приклади для цієї послуги з\u2019являться скоро.', ctaLabel: 'Усі приклади розміщень', countLabel: 'реальних розміщень за різними типами посилань' },
    campaigns: { title: 'Реальні кампанії. Реальні результати.', body: 'Реальні клієнтські кампанії з задокументованими результатами лінкбілдингу та органічного пошуку.', readLabel: 'Читати кейс', ctaLabel: 'Усі кейси' },
    secondary: {
      title: 'Потрібно більше, ніж лінкбілдинг?',
      body: 'Додаткові SEO-послуги для клієнтів, яким потрібна стратегія, аналіз або ширша видимість у пошуку.',
      items: [
        { label: 'Локальне SEO та лінкбілдинг', desc: 'Побудова географічно релевантного авторитету та посилення локальної органічної видимості.' },
        { label: 'SEO-аудит та стратегія', desc: 'Технічний, контентний, конкурентний та беклінк-аналіз із практичним планом дій.' },
        { label: 'Видимість в AI та LLM', desc: 'Покращення того, як ваш бренд знаходять та цитують у AI-пошуку.' },
      ],
    },
    faq: {
      title: 'Запитання перед замовленням',
      body: 'Чесні відповіді на те, що важливо знати перед замовленням.',
      items: [
        { q: 'Які беклінки мені обрати?', a: 'Це залежить від вашого поточного профілю посилань, конкурентів, цільових сторінок та бюджету. Розміщення посилань швидші та дешевші, бо стаття вже існує. Гостьові публікації дають більше контролю над темою та контекстом. Крауд-посилання додають розмаїття. Більшість кампаній використовують комбінацію.' },
        { q: 'Чи можу я схвалити сайти перед розміщенням?', a: 'Так. Для великих кампаній ми надаємо план розміщень перед початком outreach. Для індивідуальних замовлень ми підбираємо сайти в обраному діапазоні DR та трафіку і перевіряємо кожне розміщення перед публікацією.' },
        { q: 'Чи можу я надати свої цільові URL та анкори?', a: 'Так. Ви можете вказати бажані анкори під час оформлення замовлення або надіслати їх після оплати. Ви також можете доручити нам підібрати анкори на основі вашого профілю посилань та цільових сторінок.' },
        { q: 'Скільки часу займає виконання?', a: 'Розміщення посилань зазвичай займає 3\u20137 днів. Гостьові публікації — 10\u201321 днів, оскільки потрібно написати та опублікувати нову статтю. Крауд-посилання виконуються за 5\u201310 днів.' },
        { q: 'Чи можу я замовити посилання окремо?', a: 'Так. Ви можете купити одне розміщення, одну гостьову публікацію або невелику партію крауд-посилань. Мінімального замовлення немає. Ви також можете поєднати різні типи посилань в одному замовленні.' },
        { q: 'Чи гарантуєте ви позиції в пошуку?', a: 'Ні. Жоден сервіс лінкбілдингу не може гарантувати конкретні позиції в пошуку. Позиції залежать від багатьох факторів поза нашим контролем, включно з оновленнями алгоритмів, активністю конкурентів та on-page сигналами. Ми гарантуємо ручне розміщення на реальних сайтах у межах обраних метрик.' },
      ],
    },
    finalCta: { title: 'Не знаєте, які посилання потрібні?', body: 'Надішліть нам свій сайт та бюджет. Ми проаналізуємо ваш профіль посилань і порадимо практичний набір для лінкбілдингу.', ctaPrimary: 'Отримати індивідуальний план', ctaSecondary: 'Огляд послуг' },
  },
};
