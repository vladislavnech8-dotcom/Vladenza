import { type Locale } from './i18n';
import { PRICING_LABELS_EN, PRICING_LABELS_UK, COVERAGE_LABELS_EN, COVERAGE_LABELS_UK } from '../data/pricing';

export interface HomePageContent {
  seo: { title: string; description: string };
  hero: { h1First: string; h1Second: string; body: string; pricing: string; placements: string };
  proof: { label: string; fiverr: string; experience: string; clutch: string };
  services: { heading: string; items: Array<{ name: string; description: string; price: string; href: string; visual: string; alt: string }> };
  placements: { heading: string; body: string; empty: string; ctaLabel: string; note: string };
  process: { heading: string; steps: Array<{ title: string; desc: string }> };
  caseStudies: { heading: string; body: string; readLabel: string; ctaLabel: string };
  reviews: { heading: string; body: string; view: string };
  faq: { heading: string; items: Array<{ q: string; a: string }> };
  finalCta: { heading: string; body: string; cta: string; reassurance: string };
}

const faqEn = [
  { q: 'Can I approve websites before placement?', a: 'Yes. For larger campaigns we share a placement plan before outreach begins. For individual orders, we source within the selected range and review each placement before it goes live.' },
  { q: 'Which placement type should I choose?', a: 'It depends on your backlink profile, competitors, target pages and budget. Guest posts add editorial context, link insertions work inside existing content, and crowd marketing adds profile diversity.' },
  { q: 'How long does delivery take?', a: 'Link insertions typically take 3–7 days. Guest posts take 10–21 days because a new article needs to be written and published. Crowd marketing is delivered in 5–10 days.' },
  { q: 'Do you guarantee rankings?', a: 'No. We guarantee manual placement on real websites within the selected metrics, not indexing or ranking positions.' },
  { q: 'Can agencies use Vladenza as a white-label partner?', a: 'Yes. We provide silent fulfilment for agencies with volume tiers, custom pricing and transparent reporting.' },
  { q: 'What is included in reporting?', a: 'Every order includes a live-link report with publisher domain, metrics and screenshot. Scheduled checks confirm links remain live.' },
];

export const homePageContent: Record<Locale, HomePageContent> = {
  en: {
    seo: { title: 'Vladenza — Manual Link Building for Brands and Agencies', description: 'SEO, link building, Digital PR, and digital marketing for brands that have outgrown word of mouth.' },
    hero: { h1First: 'Word of mouth is cute.', h1Second: 'Google scales better.', body: 'SEO, link building, Digital PR, and digital marketing for brands that have outgrown word of mouth.', pricing: 'Pricing', placements: 'Browse Real Placements' },
    proof: { label: 'Real proof, from the platforms where clients hire us', fiverr: '4.9 rating · 1,100+ reviews on Fiverr', experience: '8+ years of link-building experience', clutch: 'View our profile on Clutch' },
    services: { heading: 'Link Building Without the Guesswork', items: [
      { name: 'Guest Posts', description: 'Editorial placements on relevant sites, built around your target page.', price: PRICING_LABELS_EN.guestPosts, href: '/services/guest-posting', visual: '/assets/visuals/service-guest-posts.webp', alt: '' },
      { name: 'Link Insertions', description: 'Contextual links placed inside relevant, already-published content.', price: PRICING_LABELS_EN.linkInsertions, href: '/services/niche-edits', visual: '/assets/visuals/service-link-insertions.webp', alt: '' },
      { name: 'Crowd Marketing', description: 'Relevant mentions in forums, Q&A platforms and online communities.', price: PRICING_LABELS_EN.crowdMarketing, href: '/services/crowd-links', visual: '/assets/visuals/service-crowd-marketing.webp', alt: '' },
      { name: 'White-Label Link Building', description: 'Silent fulfilment, clear reporting and dependable delivery for agencies.', price: PRICING_LABELS_EN.whiteLabel, href: '/services/white-label', visual: '/assets/visuals/service-white-label.webp', alt: '' },
    ] },
    placements: { heading: 'See the Placements Before You Buy', body: 'Browse real examples with the domain, niche, traffic and screenshots available before you choose.', empty: 'No featured examples are available for this service yet.', ctaLabel: 'Browse All Placements', note: 'Metrics are sourced from the placement records and may change over time.' },
    process: { heading: 'From Website Review to Link Care', steps: [
      { title: 'Review', desc: 'Website, backlink profile and competitors.' }, { title: 'Plan', desc: 'Pages, anchors, placement types and budget.' }, { title: 'Approve', desc: 'Review websites and requirements before publication.' }, { title: 'Place', desc: 'Manual outreach, content preparation and publication.' }, { title: 'Monitor', desc: 'Live-link reporting and scheduled checks.' },
    ] },
    caseStudies: { heading: 'Real Campaigns. Real Search Growth.', body: 'Verified metrics from existing case studies, presented without invented analytics screenshots.', readLabel: 'Read case study', ctaLabel: 'View All Case Studies' },
    reviews: { heading: 'Independent Reviews', body: 'See what clients say on the platforms where they find and hire Vladenza.', view: 'View profile' },
    faq: { heading: 'Questions Before You Buy', items: faqEn },
    finalCta: { heading: 'Ready to Build Links That Actually Belong There?', body: 'Send us your website, market and budget. We will recommend a practical mix of placements.', cta: 'Get a Link Plan', reassurance: 'Free initial review · Reply within one business day · No obligation' },
  },
  uk: {
    seo: { title: 'Vladenza — Ручний лінкбілдинг для брендів та агенцій', description: 'SEO, лінкбілдинг, Digital PR і digital-маркетинг для брендів, яким уже замало сарафанного радіо.' },
    hero: { h1First: 'Сарафанне радіо — це мило.', h1Second: 'Google масштабує краще.', body: 'SEO, лінкбілдинг, Digital PR і digital-маркетинг для брендів, яким уже замало сарафанного радіо.', pricing: 'Ціни', placements: 'Переглянути реальні розміщення' },
    proof: { label: 'Реальні підтвердження з платформ, де нас наймають', fiverr: 'Рейтинг 4.9 · 1 100+ відгуків на Fiverr', experience: '8+ років досвіду в лінкбілдингу', clutch: 'Переглянути профіль на Clutch' },
    services: { heading: 'Лінкбілдинг без здогадок', items: [
      { name: 'Гостьові публікації', description: 'Редакційні розміщення на релевантних сайтах під вашу цільову сторінку.', price: PRICING_LABELS_UK.guestPosts, href: '/services/guest-posting', visual: '/assets/visuals/service-guest-posts.webp', alt: '' },
      { name: 'Розміщення посилань', description: 'Контекстні посилання в релевантному вже опублікованому контенті.', price: PRICING_LABELS_UK.linkInsertions, href: '/services/niche-edits', visual: '/assets/visuals/service-link-insertions.webp', alt: '' },
      { name: 'Крауд-маркетинг', description: 'Доречні згадки на форумах, Q&A-платформах та в онлайн-спільнотах.', price: PRICING_LABELS_UK.crowdMarketing, href: '/services/crowd-links', visual: '/assets/visuals/service-crowd-marketing.webp', alt: '' },
      { name: 'White-label лінкбілдинг', description: 'Тиха реалізація, прозора звітність і стабільна доставка для агенцій.', price: PRICING_LABELS_UK.whiteLabel, href: '/services/white-label', visual: '/assets/visuals/service-white-label.webp', alt: '' },
    ] },
    placements: { heading: 'Перегляньте розміщення до покупки', body: 'Переглядайте реальні приклади з доменом, нішею, трафіком і доступними скріншотами.', empty: 'Для цієї послуги ще немає прикладів.', ctaLabel: 'Усі розміщення', note: 'Метрики взяті з записів розміщень і можуть змінюватися з часом.' },
    process: { heading: 'Від аналізу сайту до Link Care', steps: [
      { title: 'Аналіз', desc: 'Сайт, посилальний профіль і конкуренти.' }, { title: 'План', desc: 'Сторінки, анкори, типи розміщень і бюджет.' }, { title: 'Погодження', desc: 'Перевірка сайтів та умов до публікації.' }, { title: 'Розміщення', desc: 'Ручний аутріч, контент і публікація.' }, { title: 'Моніторинг', desc: 'Звіт із live-посиланнями та планові перевірки.' },
    ] },
    caseStudies: { heading: 'Реальні кампанії. Реальне зростання в пошуку.', body: 'Перевірені метрики з існуючих кейсів без вигаданих скріншотів аналітики.', readLabel: 'Читати кейс', ctaLabel: 'Усі кейси' },
    reviews: { heading: 'Незалежні відгуки', body: 'Перегляньте відгуки на платформах, де клієнти знаходять і наймають Vladenza.', view: 'Переглянути профіль' },
    faq: { heading: 'Запитання перед замовленням', items: [
      { q: 'Чи можу я погоджувати сайти?', a: 'Так. Для великих кампаній ми надаємо план розміщень до початку роботи, а кожне розміщення перевіряємо перед публікацією.' }, { q: 'Який тип розміщення обрати?', a: 'Це залежить від профілю посилань, конкурентів, цільових сторінок і бюджету. Часто найкраще працює поєднання типів.' }, { q: 'Скільки триває виконання?', a: 'Розміщення посилань зазвичай займає 3–7 днів, гостьові публікації — 10–21 день, крауд-маркетинг — 5–10 днів.' }, { q: 'Чи гарантуєте ви позиції?', a: 'Ні. Ми гарантуємо ручне розміщення на реальних сайтах у межах обраних метрик, а не позиції.' }, { q: 'Чи працюєте ви з агенціями?', a: 'Так. Ми надаємо white-label реалізацію з обсяговими цінами та прозорою звітністю.' }, { q: 'Що входить у звітність?', a: 'Звіт із live-посиланнями, доменом, метриками та скріншотом, а також планові перевірки.' },
    ] },
    finalCta: { heading: 'Готові будувати посилання, яким справді є місце?', body: 'Надішліть сайт, ринок і бюджет. Ми запропонуємо практичне поєднання розміщень.', cta: 'Отримати план', reassurance: 'Безкоштовний аналіз · Відповідь протягом одного робочого дня · Без зобов’язань' },
  },
};

void COVERAGE_LABELS_EN;
void COVERAGE_LABELS_UK;
