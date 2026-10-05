import { useState } from 'react';
import { ArrowRight, Check, Info, Minus, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import PlacementExplorer from '../components/PlacementExplorer';
import FAQ from '../components/FAQ';
import LinkPlanModal from '../components/LinkPlanModal';
import { useCart } from '../context/CartContext';
import { useLocale } from '../context/LocaleContext';
import { useSEO } from '../hooks/useSEO';
import { trackEvent, trackMetaEvent } from '../lib/analytics';

type LinkPackage = {
  id: string;
  name: string;
  requirements: string;
  title: string;
  items: string[];
  price: number;
  popular?: boolean;
};

const packagesEn: LinkPackage[] = [
  { id: 'good-place', name: 'GOOD PLACE', requirements: 'DR20+ · 1K+ organic traffic', title: "Good doesn't have to mean complicated.", price: 90, items: ['Relevant indexed article', 'Manual site & article check', 'Approval before placement', 'Anchor & target page matched to context', '1-Year Link Care'], },
  { id: 'better-place', name: 'BETTER PLACE', requirements: 'DR40+ · 5K+ organic traffic', title: "A little harder to find. That's the point.", price: 200, popular: true, items: ['Relevant indexed article', 'Stronger authority & organic traffic', 'Manual site & article check', 'Approval before placement', 'Anchor & target page matched to context', '1-Year Link Care'], },
  { id: 'picky-mode', name: 'PICKY MODE', requirements: 'DR50+ · 10K+ organic traffic', title: 'Go ahead. Make our job harder.', price: 280, items: ['Relevant indexed article', 'Higher authority & organic traffic', 'Tighter selection', 'Manual site & article check', 'Approval before placement', '1-Year Link Care'], },
];

const packagesUk: LinkPackage[] = [
  { id: 'good-place', name: 'GOOD PLACE', requirements: 'DR20+ · 1K+ органічного трафіку', title: 'Хороше не має бути складним.', price: 90, items: ['Релевантна проіндексована стаття', 'Ручна перевірка сайту та статті', 'Погодження до публікації', 'Анкор і цільова сторінка підібрані під контекст', 'Link Care на 1 рік'], },
  { id: 'better-place', name: 'BETTER PLACE', requirements: 'DR40+ · 5K+ органічного трафіку', title: 'Трохи складніше знайти. У цьому й сенс.', price: 200, popular: true, items: ['Релевантна проіндексована стаття', 'Сильніший авторитет і органічний трафік', 'Ручна перевірка сайту та статті', 'Погодження до публікації', 'Анкор і цільова сторінка підібрані під контекст', 'Link Care на 1 рік'], },
  { id: 'picky-mode', name: 'PICKY MODE', requirements: 'DR50+ · 10K+ органічного трафіку', title: 'Будь ласка. Ускладніть нам завдання.', price: 280, items: ['Релевантна проіндексована стаття', 'Вищий авторитет і органічний трафік', 'Жорсткіший відбір', 'Ручна перевірка сайту та статті', 'Погодження до публікації', 'Link Care на 1 рік'], },
];

const detailsEn = [
  ['01', 'Relevant article', 'The page itself matches the topic. Not just the domain.'],
  ['02', 'Already indexed', "The article is already in Google's index before we place your link."],
  ['03', 'Real organic visibility', "We check the website's organic traffic, authority and history — not just a single DR number."],
  ['04', 'Right context', 'The anchor, surrounding content and target page have a natural reason to be there.'],
];

const detailsUk = [
  ['01', 'Релевантна стаття', 'Сама сторінка відповідає темі. Не лише домен.'],
  ['02', 'Вже проіндексована', 'Стаття вже є в індексі Google до того, як ми розміщуємо ваше посилання.'],
  ['03', 'Реальна органічна видимість', 'Ми перевіряємо органічний трафік, авторитет і історію сайту — не лише один показник DR.'],
  ['04', 'Правильний контекст', 'Анкор, оточуючий контент і цільова сторінка мають природну причину бути разом.'],
];

const faqEn = [
  { q: 'Can I approve every website before placement?', a: 'Yes. Every package includes approval before placement, so you can review the proposed article and website before anything goes live.' },
  { q: 'Is the article already indexed in Google?', a: 'Yes. We look for relevant articles that are already indexed before we send them for approval.' },
  { q: 'Can I choose my target page and anchor?', a: 'Yes. You can provide the target page and preferred anchor. We match both to the context so the link reads naturally.' },
  { q: 'Can I request a specific niche or country?', a: 'Yes. Include the niche, country, language or other requirements in your brief. More specific requirements may need a custom search.' },
  { q: 'What does 1-Year Link Care cover?', a: 'For 12 months after placement, we keep an eye on delivered placements. Eligible removals are reviewed and handled according to our Link Care policy.' },
  { q: 'What if I need 10, 50 or 100+ placements?', a: 'We can build a larger campaign around your target pages, anchors, markets and backlink profile. Use the harder brief form and we will plan the search.' },
];

const faqUk = [
  { q: 'Чи можу я погодити кожен сайт до розміщення?', a: 'Так. Кожен пакет включає погодження до публікації, щоб ви могли переглянути статтю та сайт.' },
  { q: 'Стаття вже проіндексована в Google?', a: 'Так. Ми шукаємо релевантні статті, які вже проіндексовані до погодження.' },
  { q: 'Чи можу я обрати цільову сторінку та анкор?', a: 'Так. Ви можете надати цільову сторінку та бажаний анкор. Ми підбираємо їх під контекст.' },
  { q: 'Чи можу я попросити конкретну нішу або країну?', a: 'Так. Додайте нішу, країну, мову та інші вимоги у бриф. Специфічні вимоги можуть потребувати індивідуального пошуку.' },
  { q: 'Що покриває Link Care на 1 рік?', a: 'Протягом 12 місяців після розміщення ми стежимо за результатами. Видалення розглядаються відповідно до політики Link Care.' },
  { q: 'Що, якщо мені потрібно 10, 50 або 100+ розміщень?', a: 'Ми можемо побудувати більшу кампанію під ваші сторінки, анкори, ринки та беклінк-профіль.' },
];

export default function NicheEditsPage() {
  const { locale, localizePath: lp } = useLocale();
  const uk = locale === 'uk';
  const packages = uk ? packagesUk : packagesEn;
  const details = uk ? detailsUk : detailsEn;
  const faqs = uk ? faqUk : faqEn;
  const { addItem, items } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [careOpen, setCareOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);

  useSEO({
    title: uk ? 'Розміщення посилань у готових статтях — Vladenza' : 'Link Insertions — Vladenza',
    description: uk ? 'Релевантні посилання у вже проіндексованих статтях із ручною перевіркою.' : 'Relevant backlinks inside already indexed articles, manually checked before placement.',
    canonical: `https://vladenza.com${lp('/services/niche-edits')}`,
  });

  const getQuantity = (id: string) => quantities[id] ?? 1;
  const changeQuantity = (id: string, delta: number) => setQuantities((current) => ({ ...current, [id]: Math.max(1, (current[id] ?? 1) + delta) }));
  const addToCampaign = (pkg: LinkPackage) => {
    const quantity = getQuantity(pkg.id);
    const productId = `niche-edit-${pkg.id}`;
    addItem({ productId, service: 'Niche Edits', name: `${uk ? 'Розміщення посилань' : 'Link Insertion'} — ${pkg.name}`, description: pkg.requirements, unitPrice: pkg.price }, quantity);
    trackEvent('add_to_cart', { product_id: productId, quantity, price: pkg.price });
    trackMetaEvent('AddToCart', { content_name: `Niche Edit ${pkg.name}`, content_category: 'Niche Edits', content_ids: [productId], content_type: 'product', value: pkg.price * quantity, currency: 'USD', contents: [{ id: productId, quantity, item_price: pkg.price }] });
    setQuantities((current) => ({ ...current, [pkg.id]: 1 }));
  };

  return (
    <ServicePageLayout defaultService="Niche Edits" flushTop>
      <main>
        <section className="relative flex min-h-[540px] items-center overflow-hidden bg-navy text-white sm:min-h-[580px] lg:min-h-[620px]">
          <img src="/assets/visuals/Niche_edits_main_page.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-55 saturate-[.75] brightness-[.42]" />
          <div className="absolute inset-0 bg-[#07102B]/65" />
          <div className="paper-grain absolute inset-0 opacity-20" />
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">{uk ? 'РОЗМІЩЕННЯ ПОСИЛАНЬ' : 'LINK INSERTIONS'}</p>
            <h1 className="max-w-4xl font-display text-[clamp(2.75rem,7vw,6.75rem)] font-bold leading-[.95] tracking-[-.05em] text-cream">{uk ? <>Хороший контент уже є.<br /><span className="text-signal">Ваше посилання має бути в ньому.</span></> : <>Good Content Already Exists.<br /><span className="text-signal">Your Link Should Be In It.</span></>}</h1>
            <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"><a href="#packages" className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-signal px-7 text-base font-bold text-white transition-colors hover:bg-[#EA580C]">{uk ? 'Обрати розміщення' : 'Choose Your Placement'} <ArrowRight size={18} /></a><a href="#placements" className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-[#FFFDF8] px-7 text-base font-bold text-navy transition-colors hover:bg-white">{uk ? 'Наші роботи' : 'See Our Work'} <ArrowRight size={18} /></a></div>
          </div>
        </section>

        <section id="packages" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="mb-8 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">01 / {uk ? 'Розміщення посилань' : 'LINK PLACEMENTS'}</p><h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">{uk ? 'Наскільки прискіпливими нам бути?' : 'How picky should we be?'}</h2><p className="mt-3 text-[17px] leading-7 text-ink/65">{uk ? 'Чим вищі вимоги, тим ретельніше ми шукаємо.' : 'The higher the requirements, the harder we search.'}</p><p className="mt-3 max-w-2xl text-[16px] leading-7 text-ink/65">{uk ? 'Кожне розміщення походить із релевантної статті, вже проіндексованої в Google та перевіреної вручну до того, як ми покажемо її вам.' : 'Every placement comes from a relevant article already indexed in Google, manually checked before we send it your way.'}</p></div><div className="grid items-stretch gap-5 lg:grid-cols-3">{packages.map((pkg) => { const quantity = getQuantity(pkg.id); const productId = `niche-edit-${pkg.id}`; const inCart = items.find((item) => item.productId === productId); return <article key={pkg.id} className={`relative flex h-full flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1 sm:p-6 ${pkg.popular ? 'shadow-[6px_6px_0_#FF5A1F]' : ''}`}>
          {pkg.popular && <span className="absolute right-5 top-0 -translate-y-1/2 bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">{uk ? 'Найпопулярніший' : 'Most popular'}</span>}
          <p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{pkg.name}</p><p className="mt-2 text-sm font-bold text-ink/55">{pkg.requirements}</p><h3 className="mt-6 max-w-sm font-display text-[25px] font-bold leading-[1.05]">{pkg.title}</h3>
          <ul className="mt-6 flex flex-col gap-3 border-t-2 border-ink/10 pt-5">{pkg.items.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-ink/75"><Check size={16} className="mt-1 shrink-0 text-signal" />{item === '1-Year Link Care' || item === 'Link Care на 1 рік' ? <><span>{item}</span><button type="button" onClick={() => setCareOpen(true)} aria-label="Link Care details" className="editorial-focus inline-flex text-ink/55 hover:text-signal"><Info size={14} /></button></> : item}</li>)}</ul>
          <div className="mt-auto pt-6"><div className="flex items-center justify-between border-t-2 border-ink/10 pt-5"><span className="font-display text-3xl font-bold text-ink">${pkg.price}<span className="ml-1 text-sm font-semibold text-ink/50">/ placement</span></span><div className="flex items-center border-2 border-ink"><button type="button" onClick={() => changeQuantity(pkg.id, -1)} className="editorial-focus flex h-9 w-9 items-center justify-center text-ink/60 hover:bg-ink/5" aria-label="Decrease quantity"><Minus size={15} /></button><span className="flex h-9 min-w-8 items-center justify-center border-x-2 border-ink text-sm font-bold">{quantity}</span><button type="button" onClick={() => changeQuantity(pkg.id, 1)} className="editorial-focus flex h-9 w-9 items-center justify-center text-ink/60 hover:bg-ink/5" aria-label="Increase quantity"><Plus size={15} /></button></div></div><button type="button" onClick={() => addToCampaign(pkg)} className={`editorial-focus mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold transition-colors ${pkg.popular ? 'bg-signal text-white hover:bg-[#EA580C]' : 'bg-navy text-white hover:bg-[#101F52]'}`}>{inCart ? (uk ? 'Додати ще' : 'Add More') : (uk ? 'Додати до кампанії' : 'Add to Campaign')} <ArrowRight size={16} /></button></div>
        </article>; })}</div><div className="mt-10 flex flex-col items-start justify-between gap-5 border-t-2 border-ink pt-6 sm:flex-row sm:items-center"><div><h3 className="font-display text-2xl font-bold">{uk ? 'Занадто просто?' : 'Still too easy?'}</h3><p className="mt-1 text-[16px] leading-7 text-ink/65">{uk ? 'Потрібні DR60+, 50K+ трафіку, конкретна GEO, ніша або щось особливо специфічне?' : 'Need DR60+, 50K+ traffic, a specific GEO, niche or something oddly specific?'}</p></div><button type="button" onClick={() => setBriefOpen(true)} className="editorial-focus inline-flex shrink-0 items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C]">{uk ? 'Дайте нам складніший бриф' : 'Give Us a Harder Brief'} <ArrowRight size={16} /></button></div></div></section>

        <section className="bg-white py-14 md:py-20"><div className="mx-auto grid max-w-[1240px] items-center gap-10 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:gap-16 lg:px-16"><div><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">02 / {uk ? 'Поза метриками' : 'BEYOND THE METRICS'}</p><h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">{uk ? <>DR гарно виглядає в таблиці.<br />Ваше посилання все одно має бути доречним.</> : <>DR looks nice in a spreadsheet.<br />Your link still has to make sense.</>}</h2><div className="mt-10">{details.map(([number, title, body]) => <div key={number} className="border-t border-ink/20 py-5 last:border-b"><div className="flex gap-5"><span className="font-display text-2xl text-signal">{number}</span><div><h3 className="font-display text-xl font-bold">{title}</h3><p className="mt-2 text-[15px] leading-6 text-ink/65">{body}</p></div></div></div>)}</div></div><div className="relative"><img src="/assets/visuals/Nicheedits_3d_block.png" alt="Relevant indexed article with an orange link" className="w-full object-contain" /></div><div className="border-t-2 border-ink pt-5 md:col-span-2"><p className="max-w-4xl font-display text-2xl font-bold leading-tight"><span className="text-signal">{uk ? 'Домен допомагає потрапити до короткого списку.' : 'The domain gets you on the shortlist.'}</span> {uk ? 'Стаття вирішує, чи справді ми захочемо це розміщення.' : 'The article decides whether we actually want the placement.'}</p></div></div></section>

        <section id="placements" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">03 / {uk ? 'Докази' : 'THE RECEIPTS'}</p><h2 className="font-display max-w-3xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">{uk ? <>Менше розмов.<br />Більше посилань, які ми справді розмістили.</> : <>Less talk.<br />More links we've actually placed.</>}</h2><p className="mt-4 mb-8 max-w-xl text-[16px] leading-7 text-ink/65">{uk ? 'Перегляньте реальні приклади з виконаних замовлень.' : 'Browse real examples from completed link insertion orders.'}</p><PlacementExplorer serviceType="niche_edit" /><div className="mt-6"><Link to={lp('/placements')} className="inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C]">{uk ? 'Усі розміщення' : 'See All Placements'} <ArrowRight size={15} /></Link></div></div></section>

        <section className="bg-navy py-14 text-white md:py-20"><div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">04 / 1-YEAR LINK CARE</p><h2 className="font-display max-w-3xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96] text-cream">{uk ? 'Публікація — не кінець нашої роботи.' : "Published isn't where our job ends."}</h2><p className="mt-5 max-w-xl text-[17px] leading-7 text-white/70">{uk ? 'Протягом 12 місяців після розміщення ми стежимо за тим, що доставили.' : "For 12 months after placement, we keep an eye on what we've delivered."}</p><div className="mt-9 grid gap-5 border-y border-white/20 py-6 md:grid-cols-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-signal">WE CHECK IT</p><p className="mt-2 text-[16px] leading-6 text-cream">{uk ? 'Розміщення все ще активне?' : 'Is the placement still live?'}</p></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-signal">SOMETHING CHANGED?</p><p className="mt-2 text-[16px] leading-6 text-cream">{uk ? 'Ми перевіримо, що сталося.' : 'We review what happened.'}</p></div><div><p className="text-xs font-bold uppercase tracking-[.14em] text-signal">SOMETHING DISAPPEARED?</p><p className="mt-2 text-[16px] leading-6 text-cream">{uk ? 'Видалення розглядаються за політикою Link Care.' : 'Eligible removals are handled according to our Link Care policy.'}</p></div></div><button type="button" onClick={() => setCareOpen(true)} className="editorial-focus mt-6 inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-white">{uk ? 'Що покривається?' : "What's covered?"} <Info size={15} /></button><p className="mt-10 font-display text-2xl font-bold text-cream">{uk ? 'Бо «воно було активним, коли ми надіслали звіт» — недостатньо.' : 'Because “it was live when we sent the report” isn’t good enough.'}</p></div></section>

        <section className="bg-[#D94712] py-14 text-[#FFFDF8] md:py-20"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-white/75">05 / {uk ? 'Перед запитаннями' : 'BEFORE YOU ASK'}</p><h2 className="font-display max-w-2xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">{uk ? 'Так, ми це вже чули.' : 'Yes, we’ve heard that one before.'}</h2><div className="mt-8"><FAQ faqs={faqs} compact orange /></div></div></section>

        <section className="bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1000px] px-5 text-center sm:px-8"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">06 / YOUR CALL</p><h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">{uk ? 'Наскільки прискіпливими ви хочете бути?' : 'How picky do you want to be?'}</h2><p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-ink/65">{uk ? 'Good Place. Better Place. Або ускладніть нам життя.' : 'Good Place. Better Place. Or make our lives difficult.'}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><a href="#packages" className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 bg-signal px-6 text-sm font-bold text-white hover:bg-[#EA580C]">{uk ? 'Обрати розміщення' : 'Choose Your Placement'} <ArrowRight size={16} /></a><button type="button" onClick={() => setBriefOpen(true)} className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 bg-navy px-6 text-sm font-bold text-white hover:bg-[#101F52]">{uk ? 'Дайте складніший бриф' : 'Give Us a Harder Brief'} <ArrowRight size={16} /></button></div></div></section>
      </main>
      {careOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setCareOpen(false)}><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><div className="relative max-w-md border-2 border-ink bg-[#FFFDF8] p-6 shadow-[6px_6px_0_#FF5A1F]" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">1-Year Link Care</p><h2 className="mt-2 font-display text-2xl">{uk ? 'Що покривається?' : "What's covered?"}</h2></div><button type="button" onClick={() => setCareOpen(false)} className="editorial-focus text-2xl leading-none text-ink/50 hover:text-ink" aria-label="Close">×</button></div><p className="mt-5 text-[15px] leading-7 text-ink/70">{uk ? 'Протягом 12 місяців після публікації ми стежимо за доставленими розміщеннями. Якщо відповідне розміщення зникає, ми перевіряємо ситуацію та діємо відповідно до політики Link Care.' : "For 12 months after publication, we keep an eye on delivered placements. If an eligible placement disappears, we review what happened and handle it according to our Link Care policy."}</p><button type="button" onClick={() => setCareOpen(false)} className="editorial-focus mt-5 min-h-11 w-full bg-navy text-sm font-bold text-white hover:bg-[#101F52]">{uk ? 'Зрозуміло' : 'Got it'}</button></div></div>}
      <LinkPlanModal open={briefOpen} onClose={() => setBriefOpen(false)} />
    </ServicePageLayout>
  );
}
