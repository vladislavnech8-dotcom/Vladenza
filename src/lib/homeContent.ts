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
    seo: { title: 'Building Links for Online Visibility | Vladenza', description: 'We build brand presence across Google, AI and the wider web through link building, SEO and digital strategy. Because word of mouth can only take you so far.' },
    hero: { h1First: 'Word of mouth is cute.', h1Second: 'Google scales better.', body: 'SEO, link building, Digital PR, and digital marketing for brands that have outgrown word of mouth.', pricing: 'Services', placements: 'Browse Real Placements' },
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
    seo: { title: 'Будуємо посилання для онлайн-видимості | Vladenza', description: 'Розвиваємо присутність брендів у Google, AI та в мережі. Лінкбілдинг, SEO та діджитал-стратегії. Бо одного сарафанного радіо вже якось мало.' },
    hero: { h1First: 'Сарафанне радіо — це добре.', h1Second: 'Google масштабує краще.', body: 'SEO, лінкбілдинг, Digital PR і digital-маркетинг для брендів, яким уже замало сарафанного радіо.', pricing: 'Послуги', placements: 'Переглянути реальні розміщення' },
    proof: { label: 'Реальні підтвердження з платформ, де нас наймають', fiverr: 'Рейтинг 4.9 · 1 100+ відгуків на Fiverr', experience: '8+ років досвіду в лінкбілдингу', clutch: 'Переглянути профіль на Clutch' },
    services: { heading: 'Варіанти лінкбілдингу', items: [
      { name: 'Гостьові публікації', description: 'Тематичні публікації на сайтах із посиланнями на потрібні сторінки.', price: PRICING_LABELS_UK.guestPosts, href: '/services/guest-posting', visual: '/assets/visuals/service-guest-posts.webp', alt: '' },
      { name: 'Розміщення посилань', description: 'Контекстні посилання в релевантному вже опублікованому контенті.', price: PRICING_LABELS_UK.linkInsertions, href: '/services/niche-edits', visual: '/assets/visuals/service-link-insertions.webp', alt: '' },
      { name: 'Крауд-маркетинг', description: 'Доречні згадки на форумах, Q&A-платформах та в онлайн-спільнотах.', price: PRICING_LABELS_UK.crowdMarketing, href: '/services/crowd-links', visual: '/assets/visuals/service-crowd-marketing.webp', alt: '' },
      { name: 'White-label лінкбілдинг', description: 'Будуємо лінки, забираємо вашу рутину, а ви здаєте звіти під власним брендом.', price: PRICING_LABELS_UK.whiteLabel, href: '/services/white-label', visual: '/assets/visuals/service-white-label.webp', alt: '' },
    ] },
    placements: { heading: 'Перегляньте розміщення до покупки', body: 'Переглядайте реальні приклади з доменом, нішею, трафіком і доступними скріншотами.', empty: 'Для цієї послуги ще немає прикладів.', ctaLabel: 'Усі розміщення', note: 'Показники сайтів можуть змінюватися з часом.' },
    process: { heading: 'Від аналізу сайту до Link Care', steps: [
      { title: 'Аналіз', desc: 'Аналізуємо ваш сайт і посилальні профілі конкурентів.' }, { title: 'План', desc: 'Визначаємо цільові сторінки, анкори, типи посилань і бюджет на 3–6+ місяців.' }, { title: 'Погодження', desc: 'Підбираємо майданчики відповідно до стратегії та погоджуємо розміщення.' }, { title: 'Розміщення', desc: 'Розміщуємо посилання на сайтах, у статтях, форумах та онлайн-спільнотах відповідно до обраної стратегії.' }, { title: 'Моніторинг', desc: 'Надаємо звіт із live-посиланнями та проводимо планові перевірки відповідно до гарантійних умов.' },
    ] },
    caseStudies: { heading: 'Кейси. Результати роботи.', body: '', readLabel: 'Переглянути кейс', ctaLabel: 'Усі кейси' },
    reviews: { heading: 'Незалежні відгуки', body: 'Перегляньте відгуки на платформах, де клієнти знаходять і наймають Vladenza.', view: 'Переглянути профіль' },
    faq: { heading: 'Запитання перед замовленням', items: [
      { q: 'Чи можу я погоджувати сайти перед розміщенням?', a: 'Так. Можемо заздалегідь підготувати список майданчиків для погодження. Це особливо актуально для великих і регулярних кампаній. Для окремих типів посилань умови погодження можуть відрізнятися.' },
      { q: 'Які посилання краще обрати для мого сайту?', a: 'Залежить від вашого сайту, його посилального профілю, конкурентів і бюджету. Комусь потрібні гостьові публікації, комусь — лінки в готових статтях або крауд-маркетинг. Часто найкраще працює поєднання кількох типів розміщень.' },
      { q: 'Скільки часу займає розміщення посилань?', a: 'Терміни залежать від типу посилань, кількості розміщень і вимог до майданчиків. Орієнтовно: Link Insertions — 3–7 днів, Guest Posting — 10–21 день, Crowd Marketing — 5–10 днів. Точні терміни узгоджуємо перед початком роботи.' },
      { q: 'Чи гарантуєте ви зростання позицій у Google?', a: 'Ні. Ми відповідаємо за виконання погоджених робіт і розміщення посилань відповідно до умов замовлення. Позиції в Google залежать від багатьох факторів: стану сайту, контенту, конкуренції та загальної SEO-стратегії.' },
      { q: 'Чи працюєте ви з SEO-агенціями?', a: 'Так. Для агенцій у нас є white-label лінкбілдинг. Ми беремо на себе підбір майданчиків, розміщення посилань і звітність, а ви продовжуєте працювати зі своїми клієнтами під власним брендом.' },
      { q: 'Що я отримаю після виконання замовлення?', a: 'Звіт із live-посиланнями та інформацією про розміщення. Залежно від послуги додаємо метрики майданчиків та інші дані. Також проводимо планові перевірки посилань відповідно до гарантійних умов.' },
      { q: 'Чи можна замовити посилання на конкретні сторінки?', a: 'Так. Ви можете самостійно вказати цільові сторінки й анкори або довірити їх підбір нам. Якщо бачимо, що певні анкори чи сторінки краще змінити, пояснимо чому та запропонуємо альтернативу.' },
      { q: 'Чи можна замовити лише кілька посилань?', a: 'Так. Необов\u2019язково одразу запускати велику кампанію. Можна почати з невеликого замовлення, оцінити якість роботи й надалі перейти до регулярних розміщень.' },
      { q: 'Що буде, якщо посилання видалять?', a: 'Ми проводимо планові перевірки розміщень. Якщо посилання зникне протягом гарантійного періоду, перевіримо ситуацію та запропонуємо відновлення або заміну відповідно до умов гарантії для конкретної послуги.' },
      { q: 'Коли чекати результатів від лінкбілдингу?', a: 'Лінкбілдинг — це робота на перспективу. Перші зміни іноді помітні вже за кілька тижнів, але оцінювати ефективність кампанії краще на дистанції кількох місяців. Особливо якщо сайт новий або конкуренти давно працюють над своїми посилальними профілями.' },
      { q: 'Чи працюєте ви з новими сайтами?', a: 'Так. Але якщо сайт щойно запущений, одних посилань може бути недостатньо. Важливо, щоб сторінки нормально індексувалися, мали якісний контент і не містили критичних технічних проблем. Ми враховуємо це під час планування кампанії.' },
      { q: 'Чи можна замовити посилання для конкретної країни або мовою?', a: 'Так. Підбираємо майданчики з урахуванням країни, мови, тематики та цільової аудиторії. Доступність розміщень залежить від ринку, вимог до сайтів і бюджету.' },
    ] },
    finalCta: { heading: 'Готові будувати посилання, яким справді є місце?', body: 'Надішліть сайт, ринок і бюджет. Ми запропонуємо практичне поєднання розміщень.', cta: 'Отримати план', reassurance: 'Безкоштовний аналіз · Відповідь протягом одного робочого дня · Без зобов’язань' },
  },
};

void COVERAGE_LABELS_EN;
void COVERAGE_LABELS_UK;
