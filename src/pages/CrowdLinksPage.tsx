import { useState } from 'react';
import { ArrowRight, Check, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import ServicePageLayout from '../components/ServicePageLayout';
import PlacementExplorer from '../components/PlacementExplorer';
import FAQ from '../components/FAQ';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

type PackageData = {
  name: string;
  count: string;
  title: string;
  items: string[];
  price: string;
  cta: string;
  popular?: boolean;
  care: string;
};

const englishPackages: PackageData[] = [
  {
    name: 'START', count: '25 placements', title: 'Twenty-five good reasons for the internet to know your name.',
    items: ['25 relevant conversations. Found manually.', 'Written for the thread. No copy-paste replies.', 'Links + brand mentions. Whatever fits naturally.', 'Your pages, matched to the context.', 'Approval if you want it. We ask before we start.', 'Clear final report. Everything we placed, in one place.'],
    price: '$199', cta: 'Start Here', care: '30 days',
  },
  {
    name: 'GROW', count: '50 placements', title: 'Once is a mention. Fifty starts looking like presence.',
    items: ['50 relevant conversations. More ground, same manual approach.', 'Check your competitors. If they found a good conversation, we want to know about it.', 'More ways to mention you. Products, problems, comparisons, recommendations and related topics.', 'Written for the thread. Every placement gets its own context.', 'Links + brand mentions. Kept natural across the campaign.', 'Approval if you want it.', 'Campaign wrap-up. What we placed, what we found and where we’d look next.'],
    price: '$399', cta: 'Grow My Presence', care: '60 days', popular: true,
  },
  {
    name: 'SCALE', count: '100 placements', title: 'At this point, it’s definitely not a coincidence.',
    items: ['100 relevant conversations. Researched and placed manually.', 'Map the market. Your topics, products, problems and competitors.', 'Look for the gaps. Good conversations where others show up and you do not.', 'More angles, not just more links. We spread the campaign across different reasons to mention your brand.', 'Your pages, matched to the context.', 'Approval if you want it.', 'Next Opportunity Map. What we covered and where we can take the campaign next.'],
    price: '$749', cta: 'Build My Presence', care: '90 days',
  },
];

const ukrainianPackages: PackageData[] = [
  {
    name: 'START', count: '25 розміщень', title: 'Двадцять п’ять добрих причин, щоб інтернет знав ваше ім’я.',
    items: ['25 релевантних обговорень. Знайдені вручну.', 'Написано для треду. Без копіпасту.', 'Посилання та згадки бренду. Лише те, що виглядає природно.', 'Ваші сторінки, підібрані під контекст.', 'Погодження за бажанням. Ми запитаємо до старту.', 'Зрозумілий фінальний звіт. Усе розміщене — в одному місці.'],
    price: '$199', cta: 'Почати', care: '30 днів',
  },
  {
    name: 'GROW', count: '50 розміщень', title: 'Одна згадка — це випадковість. П’ятдесят — уже присутність.',
    items: ['50 релевантних обговорень. Більше охоплення, той самий ручний підхід.', 'Перевіримо конкурентів і хороші розмови, де вони вже з’явилися.', 'Більше природних приводів згадати вас: продукти, проблеми, порівняння та рекомендації.', 'Написано для треду. Кожне розміщення має власний контекст.', 'Посилання та згадки бренду без штучності.', 'Погодження за бажанням.', 'Підсумок кампанії: що розмістили, що знайшли та куди рухатися далі.'],
    price: '$399', cta: 'Розвивати присутність', care: '60 днів', popular: true,
  },
  {
    name: 'SCALE', count: '100 розміщень', title: 'На цьому етапі це вже точно не збіг.',
    items: ['100 релевантних обговорень. Дослідження та розміщення вручну.', 'Мапа ринку: ваші теми, продукти, проблеми й конкуренти.', 'Знайдемо прогалини — хороші розмови, де є інші, але немає вас.', 'Більше кутів, а не просто більше посилань.', 'Ваші сторінки, підібрані під контекст.', 'Погодження за бажанням.', 'Мапа наступних можливостей: що покрили та як розвивати кампанію далі.'],
    price: '$749', cta: 'Будувати присутність', care: '90 днів',
  },
];

const opportunityTypes = [
  ['01', 'Recommendations', 'Someone is looking for options.', 'Your brand or product may naturally fit among the answers.'],
  ['02', 'Problems', 'Someone has a problem you can help solve.', 'The placement should add something useful to the conversation.'],
  ['03', 'Comparisons', 'People are comparing their options.', 'Your brand may belong among the alternatives.'],
  ['04', 'Relevant discussions', 'The subject fits the business.', 'There may be a natural reason to mention your brand, product or content.'],
];

const faqEn = [
  { q: 'Are all placements dofollow?', a: 'No. We prioritize placements that make sense naturally rather than forcing one link type across the campaign. Link attributes can vary depending on the website and discussion.' },
  { q: 'Are all forums related to my niche?', a: "Not necessarily — and they do not need to be. The discussion itself needs to be relevant. A broad community can still contain a highly relevant conversation for your product, service or content." },
  { q: 'Can I approve placements before they go live?', a: 'Yes. After ordering, we ask whether you want to review opportunities before publishing or prefer us to handle the campaign without approval.' },
  { q: 'Can I choose the pages and anchors?', a: "Yes. Target pages and preferred anchors can be included in the brief. We still adapt placements to the conversation so they do not feel forced." },
  { q: 'What happens if a placement disappears?', a: 'This is where Link Care comes in. Depending on the package, placements are covered for 30, 60 or 90 days. We check delivered placements during that period and review eligible removals according to our Link Care policy.' },
  { q: 'Which languages can you work with?', a: 'English, German, Spanish and French are currently available. Other languages can be discussed for custom campaigns.' },
  { q: 'Can I order more than 100 placements?', a: 'Yes. Larger or ongoing campaigns can be built separately based on the website, markets and required volume.' },
];

const faqUk = [
  { q: 'Усі розміщення dofollow?', a: 'Ні. Ми надаємо перевагу розміщенням, які природно вписуються в розмову, а не нав’язуємо один тип посилань для всієї кампанії.' },
  { q: 'Усі форуми пов’язані з моєю нішею?', a: 'Не обов’язково. Релевантною має бути сама розмова. У широкій спільноті може бути дуже доречне обговорення вашого продукту чи контенту.' },
  { q: 'Чи можу я погоджувати розміщення до публікації?', a: 'Так. Після замовлення ми запитаємо, чи хочете ви переглядати можливості до публікації, чи довірите кампанію нам.' },
  { q: 'Чи можу я обрати сторінки та анкори?', a: 'Так. Цільові сторінки та бажані анкори можна додати в бриф. Ми все одно адаптуємо розміщення під розмову.' },
  { q: 'Що станеться, якщо розміщення зникне?', a: 'Тут працює Link Care. Залежно від пакета розміщення покриваються 30, 60 або 90 днів. Ми перевіряємо їх і розглядаємо видалення за політикою Link Care.' },
  { q: 'З якими мовами ви працюєте?', a: 'Наразі доступні англійська, німецька, іспанська та французька. Інші мови можна обговорити для індивідуальних кампаній.' },
  { q: 'Чи можна замовити більше 100 розміщень?', a: 'Так. Великі або постійні кампанії можна побудувати окремо під сайт, ринки та необхідний обсяг.' },
];

export default function CrowdLinksPage() {
  const { locale, localizePath: lp } = useLocale();
  const uk = locale === 'uk';
  const packages = uk ? ukrainianPackages : englishPackages;
  const faqs = uk ? faqUk : faqEn;
  const [carePackage, setCarePackage] = useState<PackageData | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  useSEO({
    title: uk ? 'Крауд-маркетинг — Vladenza' : 'Crowd Marketing — Vladenza',
    description: uk ? 'Релевантні згадки та посилання у справжніх онлайн-розмовах.' : 'Relevant brand mentions and links placed inside conversations where they make sense.',
    canonical: `https://vladenza.com${lp('/services/crowd-links')}`,
  });

  const choosePackage = (pkg: PackageData) => setSelectedPackage({ name: pkg.name, price: pkg.price, links: pkg.count, service: 'Crowd Marketing' });

  return (
    <ServicePageLayout defaultService="Crowd Marketing">
      <main>
        <section className="relative flex min-h-[calc(100svh-88px)] items-center overflow-hidden bg-navy text-white">
          <img src="/assets/visuals/Crowd_marketing_page.png" alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-[#07102B]/70" />
          <div className="paper-grain absolute inset-0 opacity-20" />
          <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-24 text-center sm:px-8 lg:py-28">
            <p className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-signal">{uk ? 'КРАУД-МАРКЕТИНГ' : 'CROWD MARKETING'}</p>
            <h1 className="max-w-4xl font-display text-[clamp(3rem,9vw,7.75rem)] font-bold leading-[.92] tracking-[-.055em] text-cream">
              {uk ? <>Згадки. Посилання.<br /><span className="text-signal">Там, де вони доречні.</span></> : <>Mentions. Links.<br /><span className="text-signal">Where They Make Sense.</span></>}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-7 text-cream/85 sm:text-xl">{uk ? 'Ми знаходимо розмови та створюємо контекст. Ваш бренд отримує природне місце в обох.' : 'We find the conversations, build the context. Your brand gets a natural place in both.'}</p>
            <div className="mt-9 flex w-full max-w-[360px] flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <a href="#packages" className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-signal px-7 text-base font-bold text-white transition-colors hover:bg-[#EA580C]">{uk ? 'Обрати пакет' : 'Choose Your Package'} <ArrowRight size={18} /></a>
              <a href="#work" className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-[#FFFDF8] px-7 text-base font-bold text-navy transition-colors hover:bg-white">{uk ? 'Як це працює' : 'How It Works'} <ArrowRight size={18} /></a>
            </div>
            <p className="mt-5 text-sm font-semibold text-cream/70">{uk ? 'Кампанії від $199 · Link Care включено' : 'Campaigns from $199 · Link Care included'}</p>
          </div>
        </section>

        <section id="packages" className="scroll-mt-20 bg-cream py-20 md:py-28">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
            <div className="mb-12 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">01 / {uk ? 'Пакети' : 'Packages'}</p><h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.94]">{uk ? 'Присутність не збирається випадково.' : 'Presence does not happen by accident.'}</h2></div>
            <div className="grid items-stretch gap-5 lg:grid-cols-3">
              {packages.map((pkg) => (
                <article key={pkg.name} className={`relative flex flex-col border-2 border-ink bg-white p-6 transition-transform hover:-translate-y-1 sm:p-8 ${pkg.popular ? 'shadow-[8px_8px_0_#FF5A1F]' : ''}`}>
                  {pkg.popular && <span className="absolute right-5 top-0 -translate-y-1/2 bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">{uk ? 'Найпопулярніший' : 'Most popular'}</span>}
                  <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{pkg.name}</p><p className="mt-2 text-sm font-bold text-ink/55">{pkg.count}</p></div><span className="font-display text-4xl font-bold text-ink">{pkg.price}</span></div>
                  <h3 className="mt-8 max-w-sm font-display text-[27px] font-bold leading-[1.02]">{pkg.title}</h3>
                  <ul className="mt-8 flex flex-col gap-4 border-t-2 border-ink/10 pt-6">{pkg.items.map((item) => <li key={item} className="flex gap-3 text-[15px] leading-6 text-ink/75"><Check size={17} className="mt-1 shrink-0 text-signal" />{item}</li>)}</ul>
                  <div className="mt-5 border-t-2 border-ink/10 pt-5"><button type="button" onClick={() => setCarePackage(pkg)} className="editorial-focus inline-flex items-center gap-1 text-xs font-bold text-ink/60 underline decoration-ink/25 underline-offset-4 hover:text-signal">{pkg.care} Link Care <Info size={13} /></button></div>
                  <button type="button" onClick={() => choosePackage(pkg)} className={`editorial-focus mt-7 inline-flex min-h-14 items-center justify-center gap-2 px-5 text-sm font-bold transition-colors ${pkg.popular ? 'bg-signal text-white hover:bg-[#EA580C]' : 'bg-navy text-white hover:bg-[#101f52]'}`}>{pkg.cta}<ArrowRight size={16} /></button>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16"><div className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">02 / {uk ? 'Де ви доречні' : 'Where You Fit'}</p><h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.94]">{uk ? <>Не кожна розмова потребує вас.<br />Ми знаходимо ті, що потребують.</> : <>Not every conversation needs you.<br />We find the ones that do.</>}</h2></div>
            <div className="mt-16 grid border-y-2 border-ink md:grid-cols-2">{opportunityTypes.map(([number, label, title, body], index) => <div key={number} className={`py-8 md:p-10 ${index % 2 === 0 ? 'md:border-r-2 md:border-ink' : ''} ${index < 2 ? 'border-b-2 border-ink md:border-b-2' : ''}`}><p className="font-display text-5xl text-signal">{number}</p><p className="mt-8 text-xs font-bold uppercase tracking-[.15em] text-ink/45">{uk ? ['Рекомендації', 'Проблеми', 'Порівняння', 'Релевантні дискусії'][index] : label}</p><h3 className="mt-3 max-w-sm font-display text-2xl font-bold leading-tight">{uk ? ['Хтось шукає варіанти.', 'Хтось має проблему, яку ви можете вирішити.', 'Люди порівнюють свої варіанти.', 'Тема справді стосується вашого бізнесу.'][index] : title}</h3><p className="mt-4 max-w-sm text-[15px] leading-6 text-ink/65">{uk ? ['Ваш бренд або продукт може природно з’явитися серед відповідей.', 'Розміщення має додавати щось корисне до розмови.', 'Ваш бренд може бути серед доречних альтернатив.', 'Є природна причина згадати бренд, продукт або контент.'][index] : body}</p></div>)}</div>
            <div className="mt-16 max-w-4xl"><h3 className="font-display text-[clamp(2.25rem,4vw,4.5rem)] font-bold leading-[.95]">{uk ? <>Весь сайт не має відповідати вашій ніші.<br /><span className="text-signal">Відповідати має розмова.</span></> : <>The whole website does not have to match your niche.<br /><span className="text-signal">The conversation does.</span></>}</h3><p className="mt-6 max-w-xl text-[15px] leading-6 text-ink/60">{uk ? 'Ми також дивимося на якість сайту, органічний трафік, авторитетність, активність та індексацію. Цифри важливі — але контекст на першому місці.' : 'We also look at site quality, organic traffic, authority, activity and indexation. The numbers matter — but context comes first.'}</p></div>
          </div>
        </section>

        <section id="work" className="scroll-mt-20 bg-navy py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-[1240px] gap-16 px-5 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:gap-24 lg:px-16"><div><p className="mb-6 text-xs font-bold uppercase tracking-[.18em] text-signal">03 / {uk ? 'За що ви платите' : 'What You’re Actually Paying For'}</p><h2 className="font-display text-[clamp(3rem,6vw,6.5rem)] font-bold leading-[.88] text-cream">{uk ? <>Будь-хто може<br />залишити<br /><span className="text-signal">посилання.</span></> : <>Anyone can<br />drop a<br /><span className="text-signal">link.</span></>}</h2><h3 className="mt-8 font-display text-3xl leading-tight text-cream">{uk ? 'Зробити так, щоб воно було доречним — ось робота.' : 'Making it belong is the job.'}</h3><p className="mt-5 max-w-sm text-[15px] leading-6 text-white/60">{uk ? 'Розміщення має виглядати так, ніби воно мало бути там завжди — а не ніби хтось прийшов лише залишити URL.' : 'A placement should feel like it was supposed to be there — not like someone showed up just to leave a URL.'}</p></div>
            <div className="relative">{[['01', 'Find the conversation.', 'Not just a domain with decent numbers.'], ['02', 'Find the angle.', 'Why would your brand come up here at all?'], ['03', 'Write for the room.', 'Every community talks differently. So do we.'], ['04', 'Stay after it goes live.', 'Link Care keeps an eye on your placements.']].map(([number, title, body], index) => <div key={number} className="relative flex gap-6 border-b border-white/20 py-7 first:pt-0 last:border-0"><div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border border-signal bg-navy font-bold text-signal">{number}</div><div><h3 className="font-display text-2xl text-cream">{uk ? ['Знайти розмову.', 'Знайти привід.', 'Написати для цієї спільноти.', 'Залишитися після публікації.'][index] : title}</h3><p className="mt-2 text-sm leading-6 text-white/55">{uk ? ['Не просто домен із хорошими цифрами.', 'Чому ваш бренд взагалі має з’явитися тут?', 'Кожна спільнота говорить по-своєму. Ми теж.', 'Link Care стежить за вашими розміщеннями.'][index] : body}</p></div>{index < 3 && <div className="absolute left-5 top-16 h-full w-px bg-signal/40" />}</div>)}</div>
            <div className="border-t border-white/20 pt-6 md:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-signal">{uk ? 'ВАША КАМПАНІЯ, ВАШ ВИБІР' : 'YOUR CAMPAIGN, YOUR CALL'}</p><p className="mt-3 font-display text-3xl text-cream">{uk ? 'Погоджуйте все заздалегідь. Або довірте це нам.' : 'Approve everything first. Or leave it to us.'}</p><p className="mt-2 text-sm text-white/45">{uk ? 'Без постійного контролю.' : 'No babysitting required.'}</p></div>
          </div>
        </section>

        <section id="placements" className="scroll-mt-20 bg-cream py-20 md:py-28"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">04 / {uk ? 'Реальні розміщення' : 'Existing placements'}</p><h2 className="font-display max-w-3xl text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.94]">{uk ? 'Подивіться, де вже доречно.' : 'See where the conversation already makes sense.'}</h2><p className="mt-5 mb-10 max-w-xl text-[15px] leading-6 text-ink/60">{uk ? 'Перегляньте реальні приклади з форумів і спільнот.' : 'Browse real examples from completed community placements.'}</p><PlacementExplorer serviceType="crowd_link" /><div className="mt-8"><Link to={lp('/placements')} className="inline-flex items-center gap-2 text-sm font-bold text-signal hover:text-[#EA580C]">{uk ? 'Усі розміщення' : 'View all placements'} <ArrowRight size={15} /></Link></div></div></section>

        <section className="bg-[#D94712] py-20 text-[#FFFDF8] md:py-28"><div className="mx-auto max-w-5xl px-5 sm:px-8"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-white/75">05 / {uk ? 'Перед запитаннями' : 'Before You Ask'}</p><h2 className="font-display max-w-2xl text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.94]">{uk ? 'Так, ми це вже чули.' : 'Yes, we’ve heard that one before.'}</h2><div className="mt-10"><FAQ faqs={faqs} compact orange /></div></div></section>
      </main>
      <OrderModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      {carePackage && <div className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setCarePackage(null)}><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" /><div className="relative max-w-md border-2 border-ink bg-[#FFFDF8] p-7 shadow-[8px_8px_0_#FF5A1F]" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">Link Care</p><h2 className="mt-2 font-display text-3xl">{carePackage.name} · {carePackage.care}</h2></div><button type="button" onClick={() => setCarePackage(null)} className="editorial-focus text-2xl leading-none text-ink/50 hover:text-ink" aria-label="Close">×</button></div><p className="mt-6 text-[15px] leading-7 text-ink/70">{uk ? 'Link Care означає, що ми продовжуємо перевіряти доставлені розміщення протягом включеного періоду. Якщо відповідне розміщення зникає, ми перевіряємо його та діємо відповідно до політики Link Care.' : 'Link Care means we continue checking delivered placements during the included coverage period. If an eligible placement disappears during that period, we review it and handle it according to our Link Care policy.'}</p><button type="button" onClick={() => setCarePackage(null)} className="editorial-focus mt-6 min-h-12 w-full bg-navy px-5 text-sm font-bold text-white hover:bg-[#101f52]">{uk ? 'Зрозуміло' : 'Got it'}</button></div></div>}
    </ServicePageLayout>
  );
}
