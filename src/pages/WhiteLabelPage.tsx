import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import LinkPlanModal from '../components/LinkPlanModal';
import FAQ from '../components/FAQ';
import PlacementExplorer from '../components/PlacementExplorer';
import { useLocale } from '../context/LocaleContext';
import { useSEO } from '../hooks/useSEO';

type Localized = { en: string; uk: string };
type Plan = { name: Localized; label: Localized; title: Localized; description: Localized; features: Localized[]; rate: Localized; note: Localized; cta: Localized; line?: Localized; popular?: boolean };

const text = (en: string, uk: string): Localized => ({ en, uk });
const getText = (value: Localized, uk: boolean) => uk ? value.uk : value.en;

const plans: Plan[] = [
  {
    name: text('PARTNER', 'PARTNER'), label: text('$1,000+ MONTHLY SPEND', '$1,000+ МІСЯЧНИХ ВИТРАТ'),
    title: text('Need extra hands? Borrow ours.', 'Потрібні додаткові руки? Позичте наші.'),
    description: text('For agencies that need reliable delivery without introducing another Slack channel full of new employees.', 'Для агенцій, яким потрібна надійна доставка без ще одного Slack-каналу з новими співробітниками.'),
    features: [
      text('ALL 3 LINK BUILDING SERVICES — Crowd Marketing, Guest Posts and Link Insertions.', 'УСІ 3 ПОСЛУГИ — крауд-маркетинг, гостьові публікації та розміщення посилань.'),
      text('RESEARCH INCLUDED — We find the opportunities instead of waiting for a shopping list.', 'ДОСЛІДЖЕННЯ ВКЛЮЧЕНО — ми знаходимо можливості, а не чекаємо список покупок.'),
      text('HUMAN-WRITTEN CONTENT — Actual copywriters write it. Revolutionary, we know.', 'КОНТЕНТ ВІД ЛЮДЕЙ — пишуть справжні копірайтери. Революційно, ми знаємо.'),
      text('APPROVAL YOUR WAY — Approve sites, topics and opportunities — or leave selection to us.', 'ПОГОДЖЕННЯ НА ВАШ РОЗСУД — погоджуйте сайти, теми й можливості або довірте вибір нам.'),
      text("WHITE-LABEL REPORTING — Your client doesn't need to know who Vlad is.", 'WHITE-LABEL ЗВІТНІСТЬ — вашому клієнту не потрібно знати, хто такий Влад.'),
      text('LINK CARE — Coverage follows the placement type and agreed terms.', 'LINK CARE — покриття відповідає типу розміщення та погодженим умовам.'),
    ],
    rate: text('AGENCY RATES', 'АГЕНЦІЙНІ ТАРИФИ'), note: text('Starting from $1,000 monthly spend.', 'Від $1,000 місячних витрат.'), cta: text('Become a Partner', 'Стати партнером'),
  },
  {
    name: text('AGENCY', 'AGENCY'), label: text('$2,500+ MONTHLY SPEND', '$2,500+ МІСЯЧНИХ ВИТРАТ'),
    title: text("More volume. Less “who's handling this?”", 'Більше обсягу. Менше «хто цим займається?»'),
    description: text('For agencies where link building has become a recurring operation rather than the occasional order.', 'Для агенцій, де лінкбілдинг став регулярною операцією, а не випадковим замовленням.'), popular: true,
    features: [
      text('EVERYTHING IN PARTNER', 'УСЕ З PARTNER'),
      text('BETTER VOLUME RATES — More consistent volume means better agency pricing.', 'КРАЩІ ТАРИФИ ЗА ОБСЯГ — стабільніший обсяг означає кращу ціну для агенції.'),
      text('CAMPAIGN PLANNING — We help decide where each service actually makes sense.', 'ПЛАНУВАННЯ КАМПАНІЙ — допомагаємо визначити, де доречен кожен сервіс.'),
      text('COMPETITOR OPPORTUNITIES — We look at what competitors forgot to do.', 'МОЖЛИВОСТІ КОНКУРЕНТІВ — дивимося, що конкуренти забули зробити.'),
      text('ONE DELIVERY FLOW — Different services. Different projects. One place to manage the work.', 'ЄДИНИЙ ПОТІК ДОСТАВКИ — різні сервіси, різні проєкти, одне місце для роботи.'),
      text('PRIORITY DELIVERY — Recurring campaigns do not start from zero every month.', 'ПРІОРИТЕТНА ДОСТАВКА — регулярні кампанії не стартують з нуля щомісяця.'),
      text('MONTHLY REVIEW — What went live, what is coming and what we would change next.', 'ЩОМІСЯЧНИЙ ОГЛЯД — що вийшло, що далі та що ми змінили б наступного разу.'),
    ],
    line: text('Your sales team can keep saying yes. We’ll figure out the links.', 'Ваша команда продажів може й далі казати «так». Ми розберемося з посиланнями.'),
    rate: text('BETTER AGENCY RATES', 'КРАЩІ АГЕНЦІЙНІ ТАРИФИ'), note: text('Starting from $2,500 monthly spend.', 'Від $2,500 місячних витрат.'), cta: text('Make Delivery Easier', 'Спростити доставку'),
  },
  {
    name: text('SCALE', 'SCALE'), label: text('$5,000+ MONTHLY SPEND', '$5,000+ МІСЯЧНИХ ВИТРАТ'),
    title: text('Basically your link building department. Minus the department.', 'Фактично ваш відділ лінкбілдингу. Без самого відділу.'),
    description: text('For agencies that want delivery infrastructure without building another internal operation.', 'Для агенцій, яким потрібна інфраструктура доставки без побудови ще однієї внутрішньої операції.'),
    features: [
      text('EVERYTHING IN AGENCY', 'УСЕ З AGENCY'),
      text('BEST VOLUME RATES — Our strongest pricing level for ongoing volume.', 'НАЙКРАЩІ ТАРИФИ ЗА ОБСЯГ — найсильніший рівень ціни для постійного обсягу.'),
      text('RESERVED CAPACITY — We plan team capacity around expected monthly delivery.', 'ЗАРЕЗЕРВОВАНА ЄМНІСТЬ — плануємо команду під очікувану щомісячну доставку.'),
      text('DEDICATED COORDINATION — Briefs, approvals, changes and reports have an owner.', 'ВИДІЛЕНА КООРДИНАЦІЯ — брифи, погодження, зміни та звіти мають відповідального.'),
      text('CUSTOM WORKFLOW — We adapt delivery and reporting around how your agency works.', 'КАСТОМНИЙ WORKFLOW — адаптуємо доставку й звітність під роботу вашої агенції.'),
      text('BIGGER-PICTURE PLANNING — We look across the work instead of treating every placement separately.', 'ПЛАНУВАННЯ ШИРШОЇ КАРТИНИ — дивимося на весь потік, а не на окремі розміщення.'),
      text('PRIORITY CAPACITY — When volume grows, you do not need to start recruiting on Monday.', 'ПРІОРИТЕТНА ЄМНІСТЬ — коли обсяг зростає, вам не потрібно починати найм у понеділок.'),
    ],
    line: text("Looks suspiciously like an in-house team. Except you don't pay for our coffee.", 'Схоже на in-house команду. Тільки за нашу каву не платите ви.'),
    rate: text('BEST AGENCY RATES', 'НАЙКРАЩІ АГЕНЦІЙНІ ТАРИФИ'), note: text('Starting from $5,000 monthly spend.', 'Від $5,000 місячних витрат.'), cta: text('Build My Delivery Team', 'Побудувати мою delivery-команду'),
  },
];

const whyItems: Array<{ number: string; title: Localized; body: Localized }> = [
  { number: '01', title: text('MORE WORK CAME IN.', 'ПРИЙШЛО БІЛЬШЕ РОБОТИ.'), body: text('Nice problem to have. Less nice when nobody has time to deliver it.', 'Хороша проблема. Не така хороша, коли нікому це доставляти.') },
  { number: '02', title: text('HIRING TAKES TIME.', 'НАЙМ ЗАЙМАЄ ЧАС.'), body: text('Recruiting, training, managing, replacing. Or send us the brief.', 'Рекрутинг, навчання, менеджмент, заміни. Або надішліть нам бриф.') },
  { number: '03', title: text('EVERY CAMPAIGN WANTS SOMETHING DIFFERENT.', 'КОЖНА КАМПАНІЯ ХОЧЕ ЧОГОСЬ ІНШОГО.'), body: text('Guest Posts here. Insertions there. Crowd somewhere else. That is normal.', 'Гостьові пости тут. Інсерти там. Crowd десь іще. Це нормально.') },
  { number: '04', title: text('YOUR CLIENT BOUGHT FROM YOU.', 'ВАШ КЛІЄНТ КУПИВ У ВАС.'), body: text('And that is exactly who they should keep talking to.', 'І саме з вами вони мають продовжувати говорити.') },
];

const deliverySteps: Array<{ number: string; title: Localized; body: Localized }> = [
  { number: '01', title: text('FIND IT', 'ЗНАЙТИ'), body: text('Relevant conversations, publications and existing content. We research where the brand actually belongs.', 'Релевантні розмови, видання та готовий контент. Досліджуємо, де бренд справді доречний.') },
  { number: '02', title: text('BUILD IT', 'ЗБУДУВАТИ'), body: text('Outreach, negotiation, content and placement. The glamorous part nobody puts on LinkedIn.', 'Аутріч, переговори, контент і розміщення. Та сама glamorous частина, про яку не пишуть у LinkedIn.') },
  { number: '03', title: text('CHECK IT', 'ПЕРЕВІРИТИ'), body: text('Context, target page, anchor and placement reviewed before delivery. Because “it’s live” is a pretty low standard.', 'Контекст, цільова сторінка, анкор і розміщення перевірені до доставки. Бо «воно live» — досить низький стандарт.') },
  { number: '04', title: text('HAND IT BACK', 'ПЕРЕДАТИ НАЗАД'), body: text('Clean reporting ready for your team. The work gets delivered. Your brand stays in front.', 'Чиста звітність, готова для вашої команди. Робота доставлена. Ваш бренд залишається попереду.') },
];

const faqs = [
  { q: 'Will my clients know Vladenza is involved?', a: 'Not unless you want them to. You own the client relationship. We stay on the delivery side.' },
  { q: 'Can I use my own branding?', a: 'Yes. Client-facing reporting can stay under your agency’s brand. There is no reason your client needs a Vladenza introduction.' },
  { q: 'What can I spend my monthly budget on?', a: 'Any mix of Crowd Marketing, Guest Posts and Link Insertions. Use everything on one campaign or distribute it across different projects.' },
  { q: 'Why are the plans based on monthly spend?', a: 'Because 20 Crowd placements and 20 Guest Posts are not the same product or cost. Monthly spend gives you the freedom to build the mix your campaigns actually need.' },
  { q: 'Can I approve placements before they go live?', a: "Yes. We can send opportunities for approval first, or you can leave selection to us. Set the workflow once and we'll follow it." },
  { q: 'Is content included?', a: 'Where content is required, we handle it. Guest Post articles are written by human copywriters — not delivered as AI-generated articles.' },
  { q: 'Do I get better rates with more volume?', a: 'Yes. Higher partnership levels are built around recurring volume, which allows us to offer better agency rates and reserve more delivery capacity.' },
  { q: 'What happens if a placement disappears?', a: 'Eligible placements are covered by Link Care according to the placement type and agreed coverage period.' },
  { q: 'Can you work directly with my client?', a: 'Only if you want us to. White Label is designed to keep your agency in front, but we can adapt the communication model when agreed beforehand.' },
];

export default function WhiteLabelPage() {
  const { locale, localizePath: lp } = useLocale();
  const uk = locale === 'uk';
  const [planOpen, setPlanOpen] = useState(false);

  useSEO({
    title: uk ? 'White Label лінкбілдинг для агенцій | Vladenza' : 'White Label Link Building for Agencies | Vladenza',
    description: uk ? 'Ви працюєте з клієнтом — ми закриваємо лінкбілдинг за лаштунками: крауд-маркетинг, гостьові публікації, link insertions і звітність. Ваш бренд залишається попереду.' : 'You handle the client. We handle link building behind the scenes: crowd, guest posts, link insertions and reporting. Your brand stays in front.',
    canonical: `https://vladenza.com${lp('/services/white-label')}`,
  });

  return (
    <ServicePageLayout defaultService="White Label Link Building" flushTop>
      <main className="bg-cream text-ink">
        <section className="relative flex min-h-[540px] items-center overflow-hidden bg-navy text-white sm:min-h-[580px] lg:min-h-[620px]">
          <img src="/assets/visuals/Whitelabel_linkbuilding.png" alt="" className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-65 saturate-[.8] brightness-[.52] sm:object-center" />
          <div className="absolute inset-0 bg-[#07102B]/72" />
          <div className="paper-grain absolute inset-0 opacity-20" />
          <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[.2em] text-signal">WHITE LABEL LINK BUILDING</p>
              <h1 className="max-w-3xl font-display text-[clamp(2.75rem,6vw,6rem)] font-bold leading-[.94] tracking-[-.05em] text-cream">{uk ? <>Ваші клієнти. Ваш бренд.<br /><span className="text-signal">Наша команда лінкбілдингу.</span></> : <>Your clients. Your brand.<br /><span className="text-signal">Our link building team.</span></>}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/85">{uk ? 'Ви продаєте лінкбілдинг. Ми беремо на себе складну частину — дослідження, аутріч, контент, розміщення та звітність.' : 'You sell the link building. We handle the messy part behind it — research, outreach, content, placements and reporting.'}</p>
              <div className="mt-8 flex w-full max-w-[420px] flex-col gap-3 sm:flex-row sm:max-w-none"><button type="button" onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })} className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-signal px-7 text-base font-bold text-white hover:bg-[#EA580C]">{uk ? 'Переглянути плани агенції' : 'See Agency Plans'} <ArrowRight size={18} /></button><a href="#placements" className="editorial-focus inline-flex min-h-14 items-center justify-center gap-2 bg-[#FFFDF8] px-7 text-base font-bold text-navy hover:bg-white">{uk ? 'Переглянути роботи' : 'See Our Work'} <ArrowRight size={18} /></a></div>
            </div>
          </div>
        </section>

        <section id="plans" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="mb-9 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">01 / {uk ? 'ПЛАНИ АГЕНЦІЇ' : 'AGENCY PLANS'}</p><h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[.94] tracking-[-.04em]">{uk ? <>Чим більше ви нам передаєте,<br /><span className="text-signal">тим більше знімаємо з вас.</span></> : <>The more you send us,<br /><span className="text-signal">the more we take off your plate.</span></>}</h2><p className="mt-4 max-w-2xl text-[17px] leading-7 text-ink/65">{uk ? 'Змішуйте сервіси, проєкти та кампанії як потрібно. Місячні витрати визначають рівень партнерства.' : 'Mix services, projects and campaigns however you need. Your monthly spend determines the partnership level.'}</p></div><div className="grid items-stretch gap-5 lg:grid-cols-3">{plans.map((plan) => <article key={plan.name.en} className={`relative flex h-full flex-col border-2 border-ink bg-white p-5 transition-transform hover:-translate-y-1 sm:p-6 ${plan.popular ? 'shadow-[6px_6px_0_#FF5A1F]' : ''}`}>{plan.popular && <span className="absolute right-5 top-0 -translate-y-1/2 bg-signal px-3 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-white">{uk ? 'Найпопулярніший' : 'Most popular'}</span>}<p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{getText(plan.name, uk)}</p><p className="mt-2 text-sm font-bold text-ink/55">{getText(plan.label, uk)}</p><h3 className="mt-6 max-w-sm font-display text-[26px] font-bold leading-[1.03]">{getText(plan.title, uk)}</h3><p className="mt-3 text-[15px] leading-6 text-ink/65">{getText(plan.description, uk)}</p><ul className="mt-6 flex flex-col gap-3 border-t-2 border-ink/10 pt-5">{plan.features.map((feature) => <li key={feature.en} className="flex gap-3 text-[14px] leading-6 text-ink/75"><Check size={16} className="mt-1 shrink-0 text-signal" />{getText(feature, uk)}</li>)}</ul>{plan.line && <p className="mt-6 border-y-2 border-ink/10 py-4 font-display text-lg font-bold leading-tight text-ink">{getText(plan.line, uk)}</p>}<div className="mt-auto pt-7"><div className="border-t-2 border-ink/10 pt-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-signal">{getText(plan.rate, uk)}</p><p className="mt-1 text-xs text-ink/50">{getText(plan.note, uk)}</p></div><button type="button" onClick={() => setPlanOpen(true)} className={`editorial-focus mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 px-5 text-sm font-bold ${plan.popular ? 'bg-signal text-white hover:bg-[#EA580C]' : 'bg-navy text-white hover:bg-[#101F52]'}`}>{getText(plan.cta, uk)} <ArrowRight size={16} /></button></div></article>)}</div><div className="mt-10 border-y-2 border-ink py-6"><p className="text-xs font-bold uppercase tracking-[.18em] text-signal">{uk ? 'ВИТРАЧАЙТЕ ТАМ, ДЕ Є СЕНС.' : 'SPEND IT WHERE IT MAKES SENSE.'}</p><p className="mt-2 font-display text-2xl font-bold">$2,500 {uk ? 'не означає фіксовану кількість посилань.' : "doesn't mean a fixed number of links."}</p><p className="mt-3 max-w-3xl text-[16px] leading-7 text-ink/65">{uk ? 'Вкладіть усе в одну кампанію. Розділіть між десятьма. Змішуйте Crowd, Guest Posts і Link Insertions. Ми побудуємо доставку навколо роботи, а не змушуватимемо роботу влізати в пакет.' : "Put it into one campaign. Split it across ten. Mix Crowd, Guest Posts and Link Insertions. We'll build the delivery around the work — not force the work into a package."}</p><p className="mt-3 text-xs text-ink/50">{uk ? 'Вартість паблішерів і вимоги до розміщень можуть відрізнятися. Ви дізнаєтеся ціну до публікації.' : "Publisher costs and placement requirements can vary. You'll know the pricing before anything goes live."}</p></div></div></section>

        <section className="bg-white py-14 md:py-20"><div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16"><div className="max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">02 / {uk ? 'ЧОМУ WHITE LABEL' : 'WHY WHITE LABEL'}</p><h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[.94] tracking-[-.04em]">{uk ? <>Ви виграли клієнта.<br />Вітаємо.<br /><span className="text-signal">Тепер хтось має виконати роботу.</span></> : <>You won the client.<br />Congratulations.<br /><span className="text-signal">Now someone has to do the work.</span></>}</h2></div><div className="mt-10 grid border-y-2 border-ink md:grid-cols-2">{whyItems.map((item, index) => <div key={item.number} className={`py-7 md:p-8 ${index % 2 === 0 ? 'md:border-r-2 md:border-ink' : ''} ${index < 2 ? 'border-b-2 border-ink' : ''}`}><p className="font-display text-4xl text-signal">{item.number}</p><h3 className="mt-5 font-display text-xl font-bold">{getText(item.title, uk)}</h3><p className="mt-2 max-w-sm text-[16px] leading-7 text-ink/65">{getText(item.body, uk)}</p></div>)}</div><p className="mt-8 font-display text-3xl font-bold">{uk ? <>Більше доставки.<br /><span className="text-signal">Менше людей під вашим управлінням.</span></> : <>More delivery.<br /><span className="text-signal">Fewer people to manage.</span></>}</p></div></section>

        <section className="bg-navy py-14 text-white md:py-20"><div className="mx-auto max-w-[1240px] px-5 sm:px-8 lg:px-16"><div className="grid gap-12 md:grid-cols-[.8fr_1.2fr] md:gap-16"><div><p className="mb-5 text-xs font-bold uppercase tracking-[.18em] text-signal">03 / {uk ? 'ЗА ЛАШТУНКАМИ' : 'BEHIND THE SCENES'}</p><h2 className="font-display text-[clamp(2.75rem,5vw,5rem)] font-bold leading-[.9] text-cream">{uk ? <>Ви керуєте стосунками.<br />Ми займаємося тим, що відбувається <span className="text-signal">після «так».</span></> : <>You manage the relationship.<br />We handle what happens <span className="text-signal">after “yes.”</span></>}</h2><p className="mt-6 max-w-md text-[16px] leading-7 text-white/65">{uk ? 'Дослідження, аутріч, контент, розміщення, перевірка та звітність — без ще однієї компанії між вами та клієнтом.' : 'Research, outreach, content, placement, checking and reporting — without putting another company between you and your client.'}</p></div><div>{deliverySteps.map((step, index) => <div key={step.number} className="relative flex gap-5 border-b border-white/20 py-5 first:pt-0 last:border-0"><div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center border border-signal bg-navy text-sm font-bold text-signal">{step.number}</div><div><h3 className="font-display text-xl text-cream sm:text-2xl">{getText(step.title, uk)}</h3><p className="mt-1 text-[15px] leading-6 text-white/60">{getText(step.body, uk)}</p></div>{index < deliverySteps.length - 1 && <div className="absolute left-[18px] top-14 h-full w-px bg-signal/40" />}</div>)}</div></div><div className="mt-12 border-t border-white/20 pt-7"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-signal">{uk ? 'ВАШ БРЕНД ЗАЛИШАЄТЬСЯ ПОПЕРЕДУ' : 'YOUR BRAND STAYS IN FRONT'}</p><h3 className="mt-2 font-display text-2xl text-cream sm:text-3xl">{uk ? 'Ваш клієнт найняв вас. Ми не прийшли забирати ваш обід.' : "Your client hired you. We're not here to steal your lunch."}</h3><p className="mt-3 text-[15px] text-white/60">{uk ? 'Жодного брендингу Vladenza у клієнтських звітах. Жодних листів Vladenza вашим клієнтам. Жодних незручних дзвінків «познайомтеся з нашим постачальником».' : 'No Vladenza branding in client-facing reports. No Vladenza emails to your clients. No awkward “meet our supplier” calls.'}</p><p className="mt-4 text-xs text-white/35">{uk ? 'У нас і так достатньо зустрічей.' : 'We have enough meetings already.'}</p></div></div></section>

        <section id="placements" className="scroll-mt-20 bg-cream py-14 md:py-20"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16"><div className="mb-8 max-w-3xl"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">04 / {uk ? 'ЩО В КОРОБЦІ' : "WHAT'S IN THE BOX"}</p><h2 className="font-display text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[.94] tracking-[-.04em]">{uk ? <>Одна команда.<br /><span className="text-signal">Три способи будувати присутність.</span></> : <>One team.<br /><span className="text-signal">Three ways to build presence.</span></>}</h2><p className="mt-4 max-w-2xl text-[17px] leading-7 text-ink/65">{uk ? 'Використовуйте один, змішуйте всі три, змінюйте мікс наступного місяця. Ми не прив’язані емоційно до вашої таблиці.' : "Use one, mix all three, change the mix next month. We're not emotionally attached to your spreadsheet."}</p></div><div className="grid border-y-2 border-ink md:grid-cols-3">{[{ title: text('CROWD MARKETING', 'КРАУД-МАРКЕТИНГ'), body: text('Relevant conversations and brand mentions where your clients naturally fit.', 'Релевантні розмови та згадки бренду там, де ваші клієнти природно доречні.'), href: '/services/crowd-links' }, { title: text('GUEST POSTING', 'ГОСТЬОВІ ПУБЛІКАЦІЇ'), body: text('New human-written articles published on relevant websites.', 'Нові статті від людей, опубліковані на релевантних сайтах.'), href: '/services/guest-posting' }, { title: text('LINK INSERTIONS', 'РОЗМІЩЕННЯ ПОСИЛАНЬ'), body: text("Relevant placements inside content that's already live.", 'Релевантні розміщення всередині контенту, який уже опублікований.'), href: '/services/niche-edits' }].map((service, index) => <a key={service.href} href={lp(service.href)} className={`editorial-focus group p-6 transition-colors hover:bg-white md:p-8 ${index < 2 ? 'border-b-2 border-ink md:border-b-0 md:border-r-2' : ''}`}><p className="text-xs font-bold uppercase tracking-[.16em] text-signal">{getText(service.title, uk)}</p><p className="mt-4 max-w-sm font-display text-xl font-bold leading-tight">{getText(service.body, uk)}</p><span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-signal">{uk ? 'Переглянути сервіс' : 'View service'} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span></a>)}</div><div className="mt-14"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-signal">{uk ? 'РЕАЛЬНІ РОЗМІЩЕННЯ' : 'EXISTING PLACEMENTS'}</p><h3 className="font-display text-3xl font-bold">{uk ? 'Докази без зайвого шуму.' : 'The receipts, without the noise.'}</h3><p className="mt-3 mb-8 max-w-xl text-[16px] leading-7 text-ink/65">{uk ? 'Перегляньте приклади з виконаних замовлень і відфільтруйте тип сервісу.' : 'Browse completed placement examples and filter by service type.'}</p><PlacementExplorer showServiceTypeFilters /></div></div></section>

        <section className="bg-[#D94712] py-14 text-[#FFFDF8] md:py-20"><div className="mx-auto max-w-[1000px] px-5 sm:px-8 lg:px-16"><p className="mb-3 text-xs font-bold uppercase tracking-[.18em] text-white/75">05 / {uk ? 'ПЕРЕД ЗАПИТАННЯМИ' : 'BEFORE YOU ASK'}</p><h2 className="font-display max-w-3xl text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[.94]">{uk ? <>Так.<br />Ми справді залишаємося за лаштунками.</> : <>Yes.<br />We really do stay behind the scenes.</>}</h2><div className="mt-8"><FAQ faqs={faqs} compact orange /></div></div></section>
      </main>
      <LinkPlanModal open={planOpen} onClose={() => setPlanOpen(false)} />
    </ServicePageLayout>
  );
}
