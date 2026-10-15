import { useState } from 'react';
import { ArrowRight, Check, Info, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import PlacementExplorer from '../components/PlacementExplorer';
import FAQ from '../components/FAQ';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';
import { useCart } from '../context/CartContext';
import { trackEvent, trackMetaEvent } from '../lib/analytics';

type PackageData = {
  name: string;
  count: string;
  title: string;
  items: string[];
  price: number;
  cta: string;
  care: string;
  popular?: boolean;
};

const packagesEn: PackageData[] = [
  { name: 'START', count: '25 placements', title: 'Twenty-five good reasons for the internet to know your name.', price: 199, cta: 'Start Here', care: '30-Day', items: ['25 relevant conversations. Found manually.', 'Written for the thread. No copy-paste replies.', 'Links + brand mentions. Whatever fits naturally.', 'Your pages, matched to the context.', 'Approval if you want it. We ask before we start.', 'Clear final report. Everything we placed, in one place.'] },
  { name: 'GROW', count: '50 placements', title: 'Once is a mention. Fifty starts looking like presence.', price: 399, cta: 'Grow My Presence', care: '60-Day', popular: true, items: ['50 relevant conversations. More ground, same manual approach.', 'Check your competitors. If they found a good conversation, we want to know about it.', 'More ways to mention you. Products, problems, comparisons, recommendations and related topics.', 'Written for the thread. Every placement gets its own context.', 'Links + brand mentions. Kept natural across the campaign.', 'Approval if you want it.', 'Campaign wrap-up. What we placed, what we found and where we\'d look next.'] },
  { name: 'SCALE', count: '100 placements', title: 'At this point, it\'s definitely not a coincidence.', price: 749, cta: 'Build My Presence', care: '90-Day', items: ['100 relevant conversations. Researched and placed manually.', 'Map the market. Your topics, products, problems and competitors.', 'Look for the gaps. Good conversations where others show up and you do not.', 'More angles, not just more links. We spread the campaign across different reasons to mention your brand.', 'Your pages, matched to the context.', 'Approval if you want it.', 'Next Opportunity Map. What we covered and where we can take the campaign next.'] },
];

const packagesUk: PackageData[] = [
  { name: 'START', count: '25 розміщень — $199', title: '25 приводів, щоб про вас дізналися.', price: 199, cta: 'Обрати START', care: '30 днів', items: ['25 релевантних обговорень, знайдених вручну.', 'Унікальні коментарі відповідно до теми. Без копіпасту.', 'Крауд-посилання та згадки бренду там, де вони доречні.', 'Цільові сторінки, підібрані відповідно до змісту дискусії.', 'Погодження форумів і коментарів перед публікацією за вашим бажанням.', 'Фінальний звіт із посиланнями на виконані розміщення.'] },
  { name: 'GROW', count: '50 розміщень — $399', title: '1 згадка — випадковість. 50 — уже присутність.', price: 399, cta: 'Обрати GROW', care: '60 днів', popular: true, items: ['50 релевантних обговорень із ручним підбором форумів і майданчиків.', 'Аналіз конкурентів та дискусій, у яких вони вже згадуються.', 'Різні сценарії для розміщення: рекомендації, проблеми, порівняння та тематичні обговорення.', 'Унікальні коментарі, написані для конкретних дискусій.', 'Крауд-посилання та згадки бренду відповідно до контексту.', 'Погодження майданчиків за вашим бажанням.', 'Підсумковий звіт і рекомендації щодо подальшого просування.'] },
  { name: 'SCALE', count: '100 розміщень — $749', title: '100 згадок? Це вже точно не збіг.', price: 749, cta: 'Обрати SCALE', care: '90 днів', items: ['100 релевантних обговорень із ручним пошуком і розміщенням.', 'Аналіз тем, продуктів, інтересів цільової аудиторії та конкурентів.', 'Пошук дискусій, де вже згадуються конкуренти, але ще немає вашого бренду.', 'Різні сценарії згадок замість повторення однакових коментарів.', 'Посилання на сторінки вашого сайту, підібрані під конкретні обговорення.', 'Погодження майданчиків і текстів за вашим бажанням.', 'Підсумковий звіт і план подальших розміщень.'] },
];

const opportunitiesEn = [
  ['01', 'Recommendations', 'Someone is looking for options.', 'Your brand or product may naturally fit among the answers.'],
  ['02', 'Problems', 'Someone has a problem you can help solve.', 'The placement should add something useful to the conversation.'],
  ['03', 'Comparisons', 'People are comparing their options.', 'Your brand may belong among the alternatives.'],
  ['04', 'Relevant discussions', 'The subject fits the business.', 'There may be a natural reason to mention your brand, product or content.'],
];

const opportunitiesUk = [
  ['01', 'РЕКОМЕНДАЦІЇ', 'Хтось шукає варіанти.', 'Користувач просить поради задає питання або шукає конкретний продукт. Ваш бренд та лінка може природно з’явитися серед відповідних рекомендацій.'],
  ['02', 'ПРОБЛЕМИ', 'Хтось має проблему, яку ви можете вирішити.', 'Ми знаходимо обговорення, у яких ваш продукт, послуга або стаття на сайті можуть допомогти з відповіддю.'],
  ['03', 'ПОРІВНЯННЯ', 'Люди порівнюють свої варіанти.', 'Коли користувачі обирають між кількома рішеннями, ваш бренд може бути однією з альтернатив. Важливо не просто згадати компанію, а пояснити, чому це доречно.'],
  ['04', 'ТЕМАТИЧНІ ДИСКУСІЇ', 'Тема справді стосується вашого бізнесу.', 'Навіть на загальному форумі може бути обговорення, яке безпосередньо стосується вашого продукту. Ми оцінюємо зміст конкретної дискусії, а не лише загальну тематику сайту.'],
];

const faqEn = [
  { q: 'Are all placements dofollow?', a: 'No. We prioritize placements that make sense naturally rather than forcing one link type across the campaign. Link attributes can vary depending on the website and discussion.' },
  { q: 'Are all forums related to my niche?', a: 'Not necessarily — and they do not need to be. The discussion itself needs to be relevant. A broad community can still contain a highly relevant conversation for your product, service or content.' },
  { q: 'Can I approve placements before they go live?', a: 'Yes. After ordering, we ask whether you want to review opportunities before publishing or prefer us to handle the campaign without approval.' },
  { q: 'Can I choose the pages and anchors?', a: 'Yes. Target pages and preferred anchors can be included in the brief. We still adapt placements to the conversation so they do not feel forced.' },
  { q: 'What happens if a placement disappears?', a: 'This is where Link Care comes in. Depending on the package, placements are covered for 30, 60 or 90 days. We check delivered placements during that period and review eligible removals according to our Link Care policy.' },
  { q: 'Which languages can you work with?', a: 'English, German, Spanish and French are currently available. Other languages can be discussed for custom campaigns.' },
  { q: 'Can I order more than 100 placements?', a: 'Yes. Larger or ongoing campaigns can be built separately based on the website, markets and required volume.' },
];

const faqUk = [
  { q: 'Що таке крауд-маркетинг?', a: 'Крауд-маркетинг (crowd marketing) — це просування бренду за допомогою участі в тематичних обговореннях на форумах та в онлайн-спільнотах. Повідомлення можуть містити рекомендації, згадки бренду або посилання на сайт, якщо вони доречні за змістом. Такий формат допомагає працювати з цільовою аудиторією та розширювати присутність бренду в інтернеті.' },
  { q: 'Що таке крауд-посилання та форумні посилання?', a: 'Крауд-посилання — це посилання на сайт, розміщені в обговореннях, коментарях або відповідях користувачам. Форумні посилання — один із найпоширеніших форматів крауд-маркетингу. Вони можуть вести на головну сторінку, товар, послугу або корисну статтю.' },
  { q: 'Де можна купити крауд-посилання?', a: 'У Vladenza можна замовити пакети на 25, 50 або 100 розміщень. Ми самостійно підбираємо форуми та обговорення, перевіряємо майданчики й готуємо коментарі. Якщо потрібна конкретна країна, мова, ніша або додаткові вимоги, можна замовити індивідуальний підбір.' },
  { q: 'Чи працює крауд-маркетинг у соціальних мережах?', a: 'Крауд-маркетинг може використовуватися не лише на форумах, а й у тематичних спільнотах та соціальних мережах, де люди обговорюють продукти й послуги. Однак наші пакети крауд-посилань передбачають насамперед розміщення у форумних обговореннях. Роботу з іншими платформами узгоджуємо окремо.' },
  { q: 'Чим крауд-посилання відрізняються від гостьових публікацій?', a: 'Крауд-посилання розміщуються в коментарях, відповідях та обговореннях. Гостьові публікації — це нові статті, які створюються для публікації на сторонніх сайтах. Обидва формати можна поєднувати в межах однієї SEO-стратегії, але вони вирішують різні завдання.' },
  { q: 'Чи обв’язково форум має відповідати тематиці мого сайту?', a: 'Ні. Важливо, щоб конкретне обговорення відповідало вашому продукту або послузі. Наприклад, посилання на магазин акумуляторів для смартфонів може бути доречним у темі про ремонт телефону на загальнотехнічному форумі.' },
  { q: 'Чи всі крауд-посилання будуть dofollow?', a: 'Ні. Тип посилання залежить від правил та технічних налаштувань конкретного майданчика. Форуми можуть використовувати атрибути nofollow або ugc. Ми не гарантуємо однаковий тип посилань для всіх розміщень.' },
  { q: 'Чи можна погоджувати форуми та коментарі перед публікацією?', a: 'Так. За бажанням ви можете переглядати запропоновані форуми, дискусії та тексти коментарів до розміщення.' },
  { q: 'Чи всі форумні посилання індексуються в Google?', a: 'Ні. Індексація залежить від налаштувань форуму, доступності сторінки та рішень пошукової системи. Ми враховуємо ці фактори під час відбору майданчиків, але не можемо гарантувати індексацію кожного коментаря.' },
  { q: 'Чи допомагає крауд-маркетинг SEO-просуванню сайту?', a: 'Крауд-маркетинг може доповнювати посилальний профіль сайту, збільшувати кількість згадок бренду та створювати додаткові можливості для переходів із тематичних спільнот. Водночас крауд-посилання самі по собі не гарантують зростання позицій у Google. Результат залежить від якості сайту, контенту, конкуренції та загальної стратегії просування.' },
  { q: 'Чи можуть видалити крауд-посилання?', a: 'Так. Адміністратори форумів можуть змінювати або видаляти коментарі відповідно до правил спільноти. У таких випадках ми діємо відповідно до умов Link Care.' },
  { q: 'Скільки часу займає розміщення крауд-посилань?', a: 'Терміни залежать від кількості розміщень, тематики, мови та вимог до майданчиків. Орієнтовний строк узгоджуємо перед початком роботи.' },
];

export default function CrowdLinksPage() {
  const { locale, localizePath: lp } = useLocale();
  const uk = locale === 'uk';
  const packages = uk ? packagesUk : packagesEn;
  const faqs = uk ? faqUk : faqEn;
  const opportunities = uk ? opportunitiesUk : opportunitiesEn;
  const { addItem, items } = useCart();
  const [carePackage, setCarePackage] = useState<PackageData | null>(null);

  useSEO({
    title: uk ? 'Купити форумні посилання та крауд-лінки | Vladenza' : 'Buy Forum Backlinks That Actually Fit | Vladenza',
    description: uk ? 'Розміщуємо форумні посилання вручну в релевантних обговореннях. Природний контекст, згадки бренду й жодного «класна стаття, ось наш сайт».' : "Buy forum backlinks placed manually in relevant discussions. Real conversations, natural mentions and context that makes sense. Because dropping a link isn't a strategy.",
    canonical: `https://vladenza.com${lp('/services/crowd-links')}`,
  });

  const addPackageToCart = (pkg: PackageData) => {
    const productId = `crowd-marketing-${pkg.name.toLowerCase()}`;
    addItem({ productId, service: 'Crowd Marketing', name: `Crowd Marketing — ${pkg.name}`, description: pkg.count, unitPrice: pkg.price });
    trackEvent('add_to_cart', { product_id: productId, quantity: 1, price: pkg.price });
    trackMetaEvent('AddToCart', { content_name: `Crowd Marketing ${pkg.name}`, content_category: 'Crowd Marketing', content_ids: [productId], content_type: 'product', value: pkg.price, currency: 'USD', contents: [{ id: productId, quantity: 1, item_price: pkg.price }] });
  };

  return (
    <ServicePageLayout defaultService="Crowd Marketing" flushTop>
      <main>
        <section className="marketing-hero relative flex items-center overflow-hidden bg-navy text-white">
          <img src="/assets/visuals/Crowd_marketing_page.webp" alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#07102B]/70" />
          <div className="paper-grain absolute inset-0 opacity-20" />
          <div className="marketing-hero-content relative z-10 mx-auto flex w-full flex-col items-center text-center">
            <h1 className="marketing-hero-title text-cream">{uk ? 'Крауд-маркетинг. Згадки. Посилання.' : <>Mentions. Links.<br /><span className="text-signal">Where They Make Sense.</span></>}</h1>
            <div className="mt-8 flex w-full max-w-[360px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"><a href={uk ? '#packages' : '#packages'} className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-signal px-7 text-base font-bold text-white transition-colors hover:bg-[#EA580C]">{uk ? 'Обрати пакет' : 'Choose Your Package'} <ArrowRight size={18} /></a><a href={uk ? '#work' : '#work'} className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-[#FFFDF8] px-7 text-base font-bold text-navy transition-colors hover:bg-white">{uk ? 'Як це працює' : 'How It Works'} <ArrowRight size={18} /></a></div>
          </div>
        </section>

        {uk ? (
          <>
            {/* 01 / Пакети крауд-маркетингу */}
            <section id="packages" className="scroll-mt-20 bg-cream py-14 md:py-20">
              <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
                <div className="mb-8 max-w-2xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">01 / Пакети крауд-маркетингу</p>
                  <h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">Впізнаваність бренду не з’являється сама собою.</h2>
                </div>
                <div className="grid items-stretch gap-5 lg:grid-cols-3">
                  {packages.map((pkg) => {
                    const productId = `crowd-marketing-${pkg.name.toLowerCase()}`;
                    const inCart = items.some((item) => item.productId === productId);
                    return (
                      <article key={pkg.name} className={`relative flex h-full flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1 sm:p-6 ${pkg.popular ? 'shadow-[6px_6px_0_#FF5A1F]' : ''}`}>
                        {pkg.popular && <span className="absolute right-5 top-0 -translate-y-1/2 bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">Найпопулярніший</span>}
                        <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{pkg.name}</p><p className="mt-1 text-sm font-bold text-ink/55">{pkg.count}</p></div><span className="font-display text-3xl font-bold text-ink">${pkg.price}</span></div>
                        <h3 className="mt-6 max-w-sm font-display text-[25px] font-bold leading-[1.05]">{pkg.title}</h3>
                        <ul className="mt-6 flex flex-col gap-3 border-t-2 border-ink/10 pt-5">{pkg.items.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-ink/75"><Check size={16} className="mt-1 shrink-0 text-signal" />{item}</li>)}</ul>
                        <div className="mt-auto pt-5"><div className="border-t-2 border-ink/10 pt-4"><button type="button" onClick={() => setCarePackage(pkg)} className="editorial-focus inline-flex items-center gap-1 text-xs font-bold text-ink/60 underline decoration-ink/25 underline-offset-4 hover:text-signal">{pkg.care} Link Care <Info size={13} /></button></div><button type="button" onClick={() => addPackageToCart(pkg)} className={`editorial-focus mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold transition-colors ${pkg.popular ? 'bg-signal text-white hover:bg-[#EA580C]' : 'bg-navy text-white hover:bg-[#101F52]'}`}>{inCart ? 'Додано до кошика' : pkg.cta}<ArrowRight size={16} /></button></div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 02 / Де ви доречні */}
            <section className="bg-white py-14 md:py-20">
              <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16">
                <div className="max-w-3xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">02 / Де ви доречні</p>
                  <h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]"><>Не кожен форум нам підходить.<br /><span className="text-signal">Не кожна дискусія потребує вашого посилання.</span></></h2>
                  <p className="mt-5 max-w-2xl text-[17px] leading-[1.6] text-ink/70">Крауд-посилання мають з’являтися там, де вони справді стосуються обговорення і посилання дасть цінність. Ми шукаємо на форумах, тематичні спільноти та дискусії, які дадуть буст до видимості ваших ключових слів у пошуку та розбавлять посилальний профіль для натуральності.</p>
                </div>
                <div className="mt-10 grid border-y-2 border-ink md:grid-cols-2">
                  {opportunitiesUk.map(([number, label, title, body], index) => (
                    <div key={number} className={`py-6 md:p-7 ${index % 2 === 0 ? 'md:border-r-2 md:border-ink' : ''} ${index < 2 ? 'border-b-2 border-ink' : ''}`}>
                      <p className="font-display text-4xl text-signal">{number}</p>
                      <p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-ink/45">{label}</p>
                      <h3 className="mt-2 max-w-sm font-display text-[21px] font-bold leading-tight">{title}</h3>
                      <p className="mt-3 max-w-sm text-[15px] leading-6 text-ink/65">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-10 max-w-4xl">
                  <h3 className="font-display text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[.98]"><>Не весь форум має відповідати вашій ніші.<br /><span className="text-signal">Достатньо, щоб відповідала дискусія.</span></></h3>
                  <p className="mt-4 max-w-2xl text-[16px] leading-7 text-ink/65">Під час відбору майданчиків враховуємо органічний трафік, DR, якість обговорень та індексацію сторінок у Google.</p>
                  <p className="mt-4 max-w-2xl text-[16px] leading-7 text-ink/65">Крауд-маркетинг — це не лише кількість посилань на форумах. Важливо, хто побачить згадку, наскільки вона доречна і чи має цінність для учасників розмови.</p>
                </div>
              </div>
            </section>

            {/* 03 / За що ви платите */}
            <section id="work" className="scroll-mt-20 bg-navy py-14 text-white md:py-20">
              <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:gap-16 lg:px-16">
                <div>
                  <p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-signal">03 / За що ви платите</p>
                  <h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.9] text-cream"><>Будь-хто<br />може залишити<br /><span className="text-signal">посилання.</span></></h2>
                  <h3 className="mt-6 font-display text-2xl leading-tight text-cream sm:text-3xl">Зробити це доречно — вже інша робота.</h3>
                  <p className="mt-4 max-w-md text-[16px] leading-7 text-white/65">Розміщення крауд-посилань — це не просто публікація коментарів на форумах. Потрібно знайти потрібну дискусію, розібратися в її змісті, врахувати правила спільноти та написати відповідь, яка доповнює розмову.</p>
                </div>
                <div className="relative">
                  {[
                    ['01', 'ЗНАЙТИ ДИСКУСІЮ', 'Шукаємо обговорення на форумах і тематичних майданчиках. Перевіряємо не лише показники сайту, а й зміст теми.'],
                    ['02', 'ЗРОЗУМІТИ КОНТЕКСТ', 'З’ясовуємо, чи буде ваш продукт, бренд або матеріал корисним учасникам обговорення. Не кожна дискусія підходить для розміщення посилання.'],
                    ['03', 'НАПИСАТИ ДЛЯ ЦІЄЇ СПІЛЬНОТИ', 'Кожен форум має власні правила та стиль спілкування. Ми враховуємо це під час підготовки коментарів, щоб повідомлення відповідало темі та не виглядало шаблонним.'],
                    ['04', 'ПЕРЕВІРИТИ ПІСЛЯ РОЗМІЩЕННЯ', 'Стежимо за доступністю опублікованих повідомлень. Якщо коментар або посилання видалено, розглядаємо ситуацію відповідно до умов Link Care.'],
                  ].map(([number, title, body], index) => (
                    <div key={number} className="relative flex gap-5 border-b border-white/20 py-5 first:pt-0 last:border-0">
                      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-signal bg-navy text-sm font-bold text-signal">{number}</div>
                      <div>
                        <h3 className="font-display text-xl text-cream sm:text-2xl">{title}</h3>
                        <p className="mt-1 text-[15px] leading-6 text-white/60">{body}</p>
                      </div>
                      {index < 3 && <div className="absolute left-[18px] top-14 h-full w-px bg-signal/40" />}
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/20 pt-5 md:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[.18em] text-signal">ВАША КАМПАНІЯ — ВАШ ВИБІР</p>
                  <p className="mt-2 font-display text-2xl text-cream sm:text-3xl">Можете погоджувати форуми, обговорення та тексти коментарів перед публікацією.</p>
                  <p className="mt-1 text-[15px] text-white/50">А можете довірити це нам.</p>
                </div>
              </div>
            </section>

            {/* 04 / Реальні розміщення */}
            <section id="placements" className="scroll-mt-20 bg-cream py-14 md:py-20">
              <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
                <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">04 / Реальні розміщення</p>
                <h2 className="font-display max-w-3xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">Менше обіцянок. Більше реальних обговорень.</h2>
                <div className="mt-8"><PlacementExplorer serviceType="crowd_link" /></div>
                <div className="mt-6"><Link to={lp('/placements')} className="inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C]">Усі розміщення <ArrowRight size={15} /></Link></div>
              </div>
            </section>

            {/* 05 / Часті запитання */}
            <section className="bg-[#D94712] py-14 text-[#FFFDF8] md:py-20">
              <div className="mx-auto max-w-5xl px-5 sm:px-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-white/75">05 / Часті запитання</p>
                <h2 className="font-display max-w-2xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">Про крауд-маркетинг без зайвої теорії.</h2>
                <div className="mt-8"><FAQ faqs={faqs} compact orange /></div>
              </div>
            </section>

            {/* 06 / Ваш вибір */}
            <section className="bg-cream py-12 md:py-16">
              <div className="mx-auto max-w-[1000px] px-5 text-center sm:px-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">06 / ВАШ ВИБІР</p>
                <h2 className="mx-auto max-w-[720px] font-display text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[1.05] text-ink">Знайдемо, де ваш бренд буде доречним.</h2>
                <p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-ink/65">25, 50 або 100 розміщень. Або індивідуальний підбір під ваші завдання.</p>
                <div className="mt-6"><Link to={lp('/contact')} className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 bg-signal px-6 text-sm font-bold text-white hover:bg-[#EA580C]">Обговорити крауд-маркетинг <ArrowRight size={16} /></Link></div>
              </div>
            </section>

            {/* Collapsible SEO content */}
            <section className="bg-white pb-14 md:pb-20">
              <div className="mx-auto max-w-3xl px-5 sm:px-8">
                <details className="group border-2 border-ink/15 bg-cream">
                  <summary className="editorial-focus flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left sm:px-6">
                    <span className="font-display text-lg font-bold text-ink">Більше про крауд-маркетинг</span>
                    <ChevronDown size={20} className="shrink-0 text-ink/50 transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="border-t-2 border-ink/10 px-5 py-6 sm:px-6">
                    <h3 className="font-display text-xl font-bold text-ink">Крауд-посилання та згадки бренду для SEO</h3>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Крауд-маркетинг — один зі способів розвивати присутність бренду в інтернеті за допомогою тематичних обговорень, відповідей на запитання та рекомендацій у спільнотах.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Крауд-посилання можуть вести на головну сторінку вашого сайту, окремий продукт, послугу або інформаційну статтю. Вибір сторінки залежить від теми дискусії та того, яка інформація буде корисною її учасникам.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">На відміну від гостьового постингу, крауд-маркетинг не потребує створення окремих статей для сторонніх видань. Натомість команда знаходить релевантні обговорення, готує відповіді та розміщує повідомлення відповідно до правил майданчика.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Робота з форумами може доповнювати інші напрями SEO-просування, зокрема гостьові публікації, розміщення посилань у готових статтях, контент-маркетинг та digital PR.</p>
                    <h3 className="mt-8 font-display text-xl font-bold text-ink">Як замовити крауд-посилання?</h3>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Оберіть пакет Start, Grow або Scale залежно від потрібної кількості розміщень.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Надайте URL сайту, цільові сторінки, бажану мову та інші вимоги. Ми підберемо форуми й обговорення, підготуємо коментарі та, за потреби, надішлемо їх на погодження.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Після публікації ви отримаєте звіт із посиланнями на виконані розміщення.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Для нестандартних завдань можна замовити індивідуальний підбір за країною, мовою, тематикою або іншими параметрами.</p>
                    <p className="mt-4 text-[15px] leading-7 text-ink/75">Головне в крауд-маркетингу — не кількість повідомлень сама по собі, а їхня доречність, відповідність аудиторії та якість майданчиків.</p>
                  </div>
                </details>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* EN: 01 → 02 → 03 → 04 → 05 → 06 */}
            <section id="packages" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="mb-8 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">01 / Packages</p><h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">Presence does not happen by accident.</h2></div><div className="grid items-stretch gap-5 lg:grid-cols-3">{packages.map((pkg) => { const productId = `crowd-marketing-${pkg.name.toLowerCase()}`; const inCart = items.some((item) => item.productId === productId); return <article key={pkg.name} className={`relative flex h-full flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1 sm:p-6 ${pkg.popular ? 'shadow-[6px_6px_0_#FF5A1F]' : ''}`}>
              {pkg.popular && <span className="absolute right-5 top-0 -translate-y-1/2 bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">Most popular</span>}
              <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{pkg.name}</p><p className="mt-1 text-sm font-bold text-ink/55">{pkg.count}</p></div><span className="font-display text-3xl font-bold text-ink">${pkg.price}</span></div>
              <h3 className="mt-6 max-w-sm font-display text-[25px] font-bold leading-[1.05]">{pkg.title}</h3>
              <ul className="mt-6 flex flex-col gap-3 border-t-2 border-ink/10 pt-5">{pkg.items.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-ink/75"><Check size={16} className="mt-1 shrink-0 text-signal" />{item}</li>)}</ul>
              <div className="mt-auto pt-5"><div className="border-t-2 border-ink/10 pt-4"><button type="button" onClick={() => setCarePackage(pkg)} className="editorial-focus inline-flex items-center gap-1 text-xs font-bold text-ink/60 underline decoration-ink/25 underline-offset-4 hover:text-signal">{pkg.care} Link Care <Info size={13} /></button></div><button type="button" onClick={() => addPackageToCart(pkg)} className={`editorial-focus mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold transition-colors ${pkg.popular ? 'bg-signal text-white hover:bg-[#EA580C]' : 'bg-navy text-white hover:bg-[#101F52]'}`}>{inCart ? 'Added to cart' : pkg.cta}<ArrowRight size={16} /></button></div>
            </article>; })}</div></div></section>

            <section className="bg-white py-14 md:py-20"><div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16"><div className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">02 / Where You Fit</p><h2 className="font-display text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]"><>Not every conversation needs you.<br />We find the ones that do.</></h2></div><div className="mt-10 grid border-y-2 border-ink md:grid-cols-2">{opportunitiesEn.map(([number, label, title, body], index) => <div key={number} className={`py-6 md:p-7 ${index % 2 === 0 ? 'md:border-r-2 md:border-ink' : ''} ${index < 2 ? 'border-b-2 border-ink' : ''}`}><p className="font-display text-4xl text-signal">{number}</p><p className="mt-5 text-xs font-bold uppercase tracking-[.15em] text-ink/45">{label}</p><h3 className="mt-2 max-w-sm font-display text-[21px] font-bold leading-tight">{title}</h3><p className="mt-3 max-w-sm text-[15px] leading-6 text-ink/65">{body}</p></div>)}</div><div className="mt-10 max-w-4xl"><h3 className="font-display text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[.98]"><>The whole website does not have to match your niche.<br /><span className="text-signal">The conversation does.</span></></h3><p className="mt-4 max-w-2xl text-[16px] leading-7 text-ink/65">We also look at site quality, organic traffic, authority, activity and indexation. The numbers matter — but context comes first.</p></div></div></section>

            <section id="work" className="scroll-mt-20 bg-navy py-14 text-white md:py-20"><div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:gap-16 lg:px-16"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-signal">03 / What You're Actually Paying For</p><h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.9] text-cream"><>Anyone can<br />drop a<br /><span className="text-signal">link.</span></></h2><h3 className="mt-6 font-display text-2xl leading-tight text-cream sm:text-3xl">Making it belong is the job.</h3><p className="mt-4 max-w-md text-[16px] leading-7 text-white/65">A placement should feel like it was supposed to be there — not like someone showed up just to leave a URL.</p></div><div className="relative">{[['01', 'Find the conversation.', 'Not just a domain with decent numbers.'], ['02', 'Find the angle.', 'Why would your brand come up here at all?'], ['03', 'Write for the room.', 'Every community talks differently. So do we.'], ['04', 'Stay after it goes live.', 'Link Care keeps an eye on your placements.']].map(([number, title, body], index) => <div key={number} className="relative flex gap-5 border-b border-white/20 py-5 first:pt-0 last:border-0"><div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-signal bg-navy text-sm font-bold text-signal">{number}</div><div><h3 className="font-display text-xl text-cream sm:text-2xl">{title}</h3><p className="mt-1 text-[15px] leading-6 text-white/60">{body}</p></div>{index < 3 && <div className="absolute left-[18px] top-14 h-full w-px bg-signal/40" />}</div>)}</div><div className="border-t border-white/20 pt-5 md:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-signal">YOUR CAMPAIGN, YOUR CALL</p><p className="mt-2 font-display text-2xl text-cream sm:text-3xl">Approve everything first. Or leave it to us.</p><p className="mt-1 text-[15px] text-white/50">No babysitting required.</p></div></div></section>

            <section id="placements" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">04 / Existing placements</p><h2 className="font-display max-w-3xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">See where the conversation already makes sense.</h2><p className="mt-4 mb-8 max-w-xl text-[16px] leading-7 text-ink/65">Browse real examples from completed community placements.</p><PlacementExplorer serviceType="crowd_link" /><div className="mt-6"><Link to={lp('/placements')} className="inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C]">View all placements <ArrowRight size={15} /></Link></div></div></section>

            <section className="bg-[#D94712] py-14 text-[#FFFDF8] md:py-20"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-white/75">05 / Frequently Asked Questions</p><h2 className="font-display max-w-2xl text-[clamp(2.5rem,4vw,4.5rem)] font-bold leading-[.96]">Yes, we've heard that one before.</h2><div className="mt-8"><FAQ faqs={faqs} compact orange /></div></div></section>

            <section className="bg-cream py-12 md:py-16"><div className="mx-auto max-w-[1000px] px-5 text-center sm:px-8"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">06 / YOUR CALL</p><h2 className="mx-auto max-w-[720px] font-display text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[1.05] text-ink">Find where your brand belongs.</h2><p className="mx-auto mt-4 max-w-xl text-[17px] leading-7 text-ink/65">25, 50 or 100 placements. Or a custom campaign built around your goals.</p><div className="mt-6"><Link to={lp('/contact')} className="editorial-focus inline-flex min-h-12 items-center justify-center gap-2 bg-signal px-6 text-sm font-bold text-white hover:bg-[#EA580C]">Discuss Crowd Marketing <ArrowRight size={16} /></Link></div></div></section>
          </>
        )}
      </main>
      {carePackage && <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setCarePackage(null)}><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><div className="relative max-w-md border-2 border-ink bg-[#FFFDF8] p-6 shadow-[6px_6px_0_#FF5A1F]" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">Link Care</p><h2 className="mt-2 font-display text-2xl">{carePackage.name} · {carePackage.care}</h2></div><button type="button" onClick={() => setCarePackage(null)} className="editorial-focus text-2xl leading-none text-ink/50 hover:text-ink" aria-label="Close">×</button></div><p className="mt-5 text-[15px] leading-7 text-ink/70">{uk ? 'Link Care означає, що ми продовжуємо перевіряти доставлені розміщення протягом включеного періоду. Якщо відповідне розміщення зникає, ми перевіряємо його та діємо відповідно до політики Link Care.' : 'Link Care means we continue checking delivered placements during the included coverage period. If an eligible placement disappears during that period, we review it and handle it according to our Link Care policy.'}</p><button type="button" onClick={() => setCarePackage(null)} className="editorial-focus mt-5 min-h-11 w-full bg-navy px-5 text-sm font-bold text-white hover:bg-[#101F52]">{uk ? 'Зрозуміло' : 'Got it'}</button></div></div>}
    </ServicePageLayout>
  );
}
