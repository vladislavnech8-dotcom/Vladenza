import { type Locale } from './i18n';

export interface HomePageContent {
  seo: { title: string; description: string };
  labels: { bestFor: string; from: string };
  hero: {
    badge: string;
    h1: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trustLine: string;
  };
  proof: { items: Array<{ value: string; label: string }> };
  clients: { title: string; body: string };
  coreServices: {
    eyebrow: string;
    title: string;
    body: string;
    linkBuilding: Array<{ name: string; desc: string; price: string; href: string }>;
    localTitle: string;
    localDesc: string;
    localHref: string;
    seoAi: Array<{ name: string; desc: string; href: string; dark?: boolean }>;
    nicheTitle: string;
    nicheBody: string;
    nichePackages: Array<{ name: string; desc: string; href: string; color: string }>;
    digitalTitle: string;
    digitalServices: Array<{ name: string; desc: string; href: string }>;
  };
  placements: { title: string; body: string; empty: string; ctaLabel: string; countLabel: string };
  campaigns: { title: string; body: string; readLabel: string; ctaLabel: string };
  process: { title: string; steps: Array<{ title: string }> };
  faq: { title: string; body: string; items: Array<{ q: string; a: string }> };
  finalCta: { title: string; body: string; ctaPrimary: string; ctaSecondary: string };
}

export const homePageContent: Record<Locale, HomePageContent> = {
  en: {
    labels: { bestFor: 'Best for:', from: 'From' },
    seo: {
      title: 'Vladenza — Link Building Services | Link Insertions, Guest Posts & Crowd Marketing',
      description: 'Build authority with relevant backlinks that improve Google rankings, strengthen AI search visibility, and turn qualified traffic into revenue. From $70 per placement.',
    },
    hero: {
      badge: 'LINK BUILDING AGENCY',
      h1: 'Link Building Services for Search and AI Visibility',
      body: 'Build authority with relevant backlinks that improve Google rankings, strengthen your presence in AI search, and turn qualified traffic into revenue.',
      ctaPrimary: 'Explore Our Services',
      ctaSecondary: 'Get a Custom Link Plan',
      trustLine: '8+ years in link building · 3,000+ completed orders',
    },
    proof: {
      items: [
        { value: '8+', label: 'Years in Link Building' },
        { value: '3,000+', label: 'Completed Orders' },
        { value: '50+', label: 'Active Projects Monthly' },
        { value: 'Manual', label: 'Strategy & Placement Review' },
      ],
    },
    clients: { title: 'Trusted by Brands Across Multiple Industries', body: 'A selection of businesses we\u2019ve supported with link-building campaigns across competitive markets.' },
    coreServices: {
      eyebrow: 'CORE SERVICES',
      title: 'Everything You Need to Grow Your Search Visibility',
      body: 'From strategic link building to SEO, AI visibility and digital marketing — our services build authority and support sustainable growth.',
      linkBuilding: [
        { name: 'Guest Posts', desc: 'Editorial articles published on relevant websites with real organic traffic.', price: 'From $80', href: '/services/guest-posting' },
        { name: 'Link Insertions', desc: 'Contextual backlinks added naturally to relevant, already-published articles.', price: 'From $70', href: '/services/niche-edits' },
        { name: 'Crowd Marketing', desc: 'Natural brand mentions and links placed in relevant forum and community discussions.', price: 'From $290', href: '/services/crowd-links' },
      ],
      localTitle: 'Local Link Building',
      localDesc: 'Geo-relevant backlinks and citations that strengthen local search visibility.',
      localHref: '/services/local-seo-links',
      seoAi: [
        { name: 'SEO Audit & Strategy', desc: 'Technical, content, competitor and backlink analysis with an actionable roadmap.', href: '/services/seo-audit' },
        { name: 'AI & LLM Visibility', desc: 'Improve how your brand is discovered, understood and referenced across ChatGPT, Perplexity, Gemini and AI-driven search.', href: '/services/ai-llm', dark: true },
      ],
      nicheTitle: 'Link Building Built Around Your Industry',
      nicheBody: 'Industry-focused campaigns adapted to your market, audience and competitive landscape.',
      nichePackages: [
        { name: 'iGaming', desc: 'Casino, betting and affiliate link building in high-competition verticals.', href: '/services/link-packages/igaming', color: 'emerald' },
        { name: 'SaaS', desc: 'Category-page authority and non-brand traffic growth for software companies.', href: '/services/link-packages/saas', color: 'blue' },
        { name: 'Automotive', desc: 'Parts e-commerce and enthusiast publication placements.', href: '/services/link-packages/auto', color: 'amber' },
        { name: 'Health & Wellness', desc: 'E-E-A-T signals and expert-authority link building for YMYL sites.', href: '/services/link-packages/health', color: 'rose' },
        { name: 'Proxy & VPN', desc: 'Privacy-tech placements in security and networking niches.', href: '/services/link-packages/proxy', color: 'gray' },
        { name: 'Home Renovation', desc: 'Local and regional authority for renovation and contractor businesses.', href: '/services/link-packages/renovations', color: 'orange' },
      ],
      digitalTitle: 'Digital Marketing Services',
      digitalServices: [
        { name: 'LinkedIn Personal Brand Marketing', desc: 'Content strategy and profile management designed to grow authority, reach and professional visibility.', href: '/services/linkedin-personal' },
        { name: 'LinkedIn Company Page Marketing', desc: 'Strategic content and page management that strengthen company visibility and support lead generation.', href: '/services/linkedin-company' },
      ],
    },
    placements: { title: 'See the Links Before You Buy', body: 'Browse real examples of placements we\u2019ve delivered across different link types, niches, DR levels and traffic ranges.', empty: 'Examples coming soon for this service.', ctaLabel: 'Explore All Placements', countLabel: 'real placements across Link Insertions, Guest Posts & Crowd Marketing' },
    campaigns: { title: 'Real Campaigns. Measurable Outcomes.', body: 'Real client campaigns with documented link-building and organic search results.', readLabel: 'Read Case Study', ctaLabel: 'Explore All Case Studies' },
    process: {
      title: 'How We Work',
      steps: [
        { title: 'Website Review' },
        { title: 'Strategy and Approval' },
        { title: 'Placement and Execution' },
        { title: 'Reporting and Monitoring' },
      ],
    },
    faq: {
      title: 'Questions Before You Buy',
      body: 'Honest answers to the things that matter before ordering.',
      items: [
        { q: 'What type of backlinks should I choose?', a: 'It depends on your current backlink profile, competitors, target pages and budget. Link insertions are faster and cheaper because the article already exists. Guest posts give you more control over topic and context. Crowd marketing adds diversity. Most campaigns use a mix.' },
        { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual orders, we source within the selected DR and traffic range and review each placement before it goes live.' },
        { q: 'Can I provide my own target URLs and anchors?', a: 'Yes. You can provide preferred anchors during checkout or send them after payment. You can also let us recommend anchors based on your current backlink profile and target pages.' },
        { q: 'How long does delivery take?', a: 'Link insertions typically take 3\u20137 days. Guest posts take 10\u201321 days because a new article needs to be written and published. Crowd marketing is delivered in 5\u201310 days.' },
        { q: 'Can I order links individually?', a: 'Yes. You can buy a single link insertion, one guest post, or a small batch of crowd links. There is no minimum order. You can also combine different link types in the same checkout.' },
        { q: 'Do you guarantee rankings?', a: 'No. No link-building service can guarantee specific search rankings. Rankings depend on many factors outside our control, including algorithm updates, competitor activity and on-page signals. We guarantee manual placement on real websites within the selected metrics.' },
      ],
    },
    finalCta: { title: 'Build a Link Strategy Around Your Website', body: 'Send us your website and budget. We\u2019ll review your backlink profile and recommend a practical campaign.', ctaPrimary: 'Get a Custom Link Plan', ctaSecondary: 'Explore Services' },
  },
  uk: {
    labels: { bestFor: 'Найкраще для:', from: 'Від' },
    seo: {
      title: 'Vladenza — Послуги з лінкбілдингу | Гостьові публікації та крауд-маркетинг',
      description: 'Посилюйте авторитет за допомогою релевантних посилань, які покращують позиції в Google, підвищують присутність бренду в AI-пошуку та перетворюють цільовий трафік на дохід. Від $70 за розміщення.',
    },
    hero: {
      badge: 'АГЕНЦІЯ ЛІНКБІЛДИНГУ',
      h1: 'Послуги з лінкбілдингу для видимості в пошуку та AI',
      body: 'Посилюйте авторитет за допомогою релевантних посилань, які покращують позиції в Google, підвищують присутність бренду в AI-пошуку та перетворюють цільовий трафік на дохід.',
      ctaPrimary: 'Переглянути послуги',
      ctaSecondary: 'Отримати план лінкбілдингу',
      trustLine: '8+ років у лінкбілдингу · 3 000+ виконаних замовлень',
    },
    proof: {
      items: [
        { value: '8+', label: 'років у лінкбілдингу' },
        { value: '3 000+', label: 'виконаних замовлень' },
        { value: '50+', label: 'активних проєктів щомісяця' },
        { value: 'Ручна', label: 'стратегія та перевірка розміщень' },
      ],
    },
    clients: { title: 'Нам довіряють бренди з різних індустрій', body: 'Вибірка компаній, які ми підтримали кампаніями лінкбілдингу на конкурентних ринках.' },
    coreServices: {
      eyebrow: 'ОСНОВНІ ПОСЛУГИ',
      title: 'Усе необхідне для зростання видимості в пошуку',
      body: 'Від стратегічного лінкбілдингу до SEO, AI-видимості та цифрового маркетингу — наші послуги посилюють авторитет і підтримують стабільне зростання.',
      linkBuilding: [
        { name: 'Гостьові публікації', desc: 'Редакційні статті, опубліковані на релевантних сайтах з реальним органічним трафіком.', price: 'Від $80', href: '/services/guest-posting' },
        { name: 'Розміщення посилань', desc: 'Контекстні беклінки, додані органічно до релевантних уже опублікованих статей.', price: 'Від $70', href: '/services/niche-edits' },
        { name: 'Крауд-маркетинг', desc: 'Природні згадки бренду та посилання на форумах і у тематичних обговореннях.', price: 'Від $290', href: '/services/crowd-links' },
      ],
      localTitle: 'Локальний лінкбілдинг',
      localDesc: 'Георелевантні посилання та цитування, що посилюють локальну видимість у пошуку.',
      localHref: '/services/local-seo-links',
      seoAi: [
        { name: 'SEO-аудит та стратегія', desc: 'Технічний, контентний, конкурентний та беклінк-аналіз із практичним планом дій.', href: '/services/seo-audit' },
        { name: 'Видимість в AI та LLM', desc: 'Покращення того, як ваш бренд знаходять, розуміють та цитують у ChatGPT, Perplexity, Gemini та AI-пошуку.', href: '/services/ai-llm', dark: true },
      ],
      nicheTitle: 'Лінкбілдинг під вашу індустрію',
      nicheBody: 'Індустріально-орієнтовані кампанії, адаптовані до вашого ринку, аудиторії та конкурентного середовища.',
      nichePackages: [
        { name: 'iGaming', desc: 'Лінкбілдинг для казино, беттингу та партнерських програм у висококонкурентних вертикалях.', href: '/services/link-packages/igaming', color: 'emerald' },
        { name: 'SaaS', desc: 'Авторитет сторінок категорій та зростання небрендового трафіку для SaaS-компаній.', href: '/services/link-packages/saas', color: 'blue' },
        { name: 'Авто', desc: 'Розміщення в e-commerce запчастин та ентузіастських виданнях.', href: '/services/link-packages/auto', color: 'amber' },
        { name: 'Здоров\'я та велнес', desc: 'E-E-A-T-сигнали та експертний лінкбілдинг для YMYL-сайтів.', href: '/services/link-packages/health', color: 'rose' },
        { name: 'Proxy та VPN', desc: 'Розміщення в нішах безпеки та мережевих технологій.', href: '/services/link-packages/proxy', color: 'gray' },
        { name: 'Домашній ремонт', desc: 'Локальний та регіональний авторитет для ремонтних та підрядних бізнесів.', href: '/services/link-packages/renovations', color: 'orange' },
      ],
      digitalTitle: 'Послуги цифрового маркетингу',
      digitalServices: [
        { name: 'LinkedIn Personal Brand Marketing', desc: 'Контент-стратегія та управління профілем для зростання авторитету, охоплення та професійної видимості.', href: '/services/linkedin-personal' },
        { name: 'LinkedIn Company Page Marketing', desc: 'Стратегічний контент та управління сторінкою, що посилюють видимість компанії та підтримують генерацію лідів.', href: '/services/linkedin-company' },
      ],
    },
    placements: { title: 'Перегляньте розміщення перед замовленням', body: 'Перегляньте реальні приклади розміщень, які ми виконали — за типами посилань, нішами, DR та рівнями трафіку.', empty: 'Приклади для цієї послуги з\u2019являться скоро.', ctaLabel: 'Усі приклади розміщень', countLabel: 'реальних розміщень за різними типами посилань' },
    campaigns: { title: 'Реальні кампанії. Вимірювані результати.', body: 'Реальні клієнтські кампанії з задокументованими результатами лінкбілдингу та органічного пошуку.', readLabel: 'Читати кейс', ctaLabel: 'Усі кейси' },
    process: {
      title: 'Як ми працюємо',
      steps: [
        { title: 'Аналіз сайту' },
        { title: 'Стратегія та погодження' },
        { title: 'Розміщення і виконання' },
        { title: 'Звітність та моніторинг' },
      ],
    },
    faq: {
      title: 'Запитання перед замовленням',
      body: 'Чесні відповіді на те, що важливо знати перед замовленням.',
      items: [
        { q: 'Які беклінки мені обрати?', a: 'Це залежить від вашого поточного профілю посилань, конкурентів, цільових сторінок та бюджету. Розміщення посилань швидші та дешевші, бо стаття вже існує. Гостьові публікації дають більше контролю над темою та контекстом. Крауд-маркетинг додає розмаїття. Більшість кампаній використовують комбінацію.' },
        { q: 'Чи можу я схвалити сайти перед розміщенням?', a: 'Так. Для великих кампаній ми надаємо план розміщень перед початком outreach. Для індивідуальних замовлень ми підбираємо сайти в обраному діапазоні DR та трафіку і перевіряємо кожне розміщення перед публікацією.' },
        { q: 'Чи можу я надати свої цільові URL та анкори?', a: 'Так. Ви можете вказати бажані анкори під час оформлення замовлення або надіслати їх після оплати. Ви також можете доручити нам підібрати анкори на основі вашого профілю посилань та цільових сторінок.' },
        { q: 'Скільки часу займає виконання?', a: 'Розміщення посилань зазвичай займає 3\u20137 днів. Гостьові публікації — 10\u201321 днів, оскільки потрібно написати та опублікувати нову статтю. Крауд-маркетинг виконується за 5\u201310 днів.' },
        { q: 'Чи можу я замовити посилання окремо?', a: 'Так. Ви можете купити одне розміщення, одну гостьову публікацію або невелику партію крауд-посилань. Мінімального замовлення немає. Ви також можете поєднати різні типи посилань в одному замовленні.' },
        { q: 'Чи гарантуєте ви позиції в пошуку?', a: 'Ні. Жоден сервіс лінкбілдингу не може гарантувати конкретні позиції в пошуку. Позиції залежать від багатьох факторів поза нашим контролем, включно з оновленнями алгоритмів, активністю конкурентів та on-page сигналами. Ми гарантуємо ручне розміщення на реальних сайтах у межах обраних метрик.' },
      ],
    },
    finalCta: { title: 'Побудуємо стратегію лінкбілдингу під ваш сайт', body: 'Надішліть нам свій сайт і бюджет. Ми проаналізуємо профіль посилань та запропонуємо практичну кампанію.', ctaPrimary: 'Отримати план лінкбілдингу', ctaSecondary: 'Переглянути послуги' },
  },
};
