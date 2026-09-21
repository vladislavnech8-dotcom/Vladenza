import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Check, ArrowRight, ArrowDown, ExternalLink, Link2, Target, TrendingUp, Zap, ShoppingCart, Trophy, Package, Sparkles } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import PlacementExplorer from '../components/PlacementExplorer';
import CaseStudyCards, { type RelatedCase } from '../components/CaseStudyCards';
import NicheEditsVsGuestPosts from '../components/NicheEditsVsGuestPosts';
import ReviewsSection from '../components/ReviewsSection';
import LinkPlanModal from '../components/LinkPlanModal';
import { useCart } from '../context/CartContext';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';
import { supabase } from '../lib/supabase';
import { trackEvent, trackMetaEvent } from '../lib/analytics';
import { nicheEditPackages, NICHE_EDIT_STARTING_PRICE, packageExamples, sampleReportUrl } from '../data/nicheEditPackages';

const content = {
  en: {
    seo: {
      title: 'Buy Niche Edits & Link Insertions | Vladenza',
      description: 'Niche edits and link insertions inside existing, relevant content. Choose from DR and organic traffic options. Pricing from $70 per placement. 3–7 day delivery.',
    },
    hero: {
      badge: 'Link Building Service',
      title: 'Niche Edit Link Building',
      subtitle: 'Backlinks inside existing, relevant content.',
      desc: 'Niche edits place your backlink inside an existing article on a relevant website. Choose the DR and organic traffic level that fits your campaign, or let us recommend a mix based on your site and budget.',
      fromPrice: `From $${NICHE_EDIT_STARTING_PRICE}`,
      delivery: '3–7 day delivery',
      manualReview: 'Manual review',
      cta: 'View Packages',
      ctaSecondary: 'See Real Placements',
      exampleLabel: 'Example Package',
      exampleDr: 'DR40+',
      exampleTraffic: '1,000–20,000 traffic',
      exampleFeatures: ['DR 40+ domain', 'Contextual placement', '3–7 day delivery', 'Manual review'],
      sampleReport: 'See Sample Report',
    },
    trust: {
      years: 'Years in Link Building',
      orders: 'Completed Orders',
      manual: 'Link Building',
      manualValue: 'Manual',
    },
    whyUse: {
      title: 'Why Use Niche Edits?',
      desc: "Niche edits let you add links to already-published pages. They're useful on their own and can complement guest posts and other link types in a broader campaign.",
      benefits: [
        { icon: Link2, title: 'Existing Content', desc: 'Your backlink is added to an article that’s already published.' },
        { icon: Target, title: 'Contextual Placement', desc: 'The link sits inside content relevant to the target page.' },
        { icon: TrendingUp, title: 'DR & Traffic Options', desc: 'Choose the level that matches the campaign and budget.' },
        { icon: Zap, title: 'Faster Fulfilment', desc: 'No new article needs to be written. Typical delivery is 3–7 days.' },
      ],
    },
    packages: {
      title: 'Choose Your Niche Edit',
      desc: "Choose a DR and traffic level based on your campaign and budget. We'll source a relevant opportunity within the selected range and manually review the placement before it goes live.",
    },
    notSure: {
      title: 'Not sure which links you need?',
      desc: "Send us your site and budget. We'll compare your backlink profile with competitors and suggest how we'd split the budget.",
      features: ['Profile review', 'Budget split', 'Suggested link mix'],
      cta: 'Get a Link Plan',
    },
    differentLinks: {
      title: 'Different Links for Different Campaigns',
      p1: "Not every campaign needs the same backlink mix. Some sites need more referring domains. Others need stronger placements pointing to important commercial pages. Competitive niches may need a larger share of higher-DR, higher-traffic websites.",
      p2: "That's why we offer several DR and traffic levels instead of one fixed package. Choose placements yourself or let us build the mix around your site and budget.",
    },
    placements: {
      title: 'Real Niche Edit Placements',
      desc: 'Examples from completed orders, with Ahrefs DR and organic traffic metrics.',
      viewAll: 'View All Niche Edit Examples',
      sampleReport: 'See Sample Report',
    },
    howOrdering: {
      title: 'How Ordering Works',
      steps: [
        { icon: ShoppingCart, title: 'Choose', desc: 'Select DR, traffic level and quantity.' },
        { icon: Link2, title: 'Requirements', desc: 'Add URLs, anchors and notes — or send them later.' },
        { icon: Check, title: 'Review', desc: 'We review the requirements and available placements.' },
        { icon: Zap, title: 'Placement', desc: 'The approved link is delivered in your report.' },
      ],
    },
    cases: {
      title: 'Real Campaigns. Real Outcomes.',
      desc: 'See how niche edits fit into broader link-building campaigns across competitive markets.',
      viewAll: 'Explore All Case Studies',
    },
    vsGuestPosts: {
      title: 'Niche Edits vs. Guest Posts',
    },
    seoBlock: {
      heading: 'Niche Edits as Part of Your Link Building Strategy',
      intro: 'Niche edits, also called link insertions, add backlinks to articles that are already published. They are commonly used alongside guest posts, forum links, and other placements to build referring domain diversity and support important pages.',
      body: [
        'Selection should consider both measurable criteria and relevance. We look at DR, organic traffic, the actual article, topic, target page, anchor, and the existing backlink profile — not just a DR threshold.',
        'Clients can order individual placements by DR and traffic level, but larger campaigns may use a mix of price levels. Not every backlink needs to be a premium placement. A DR10+ link serves a different purpose than a DR50+ link, and both can have a place in the same profile depending on the campaign.',
        'For clients running ongoing link-building campaigns, we can analyze competitors and the existing backlink profile before recommending the mix of [niche edits](/blog/niche-edits-vs-guest-posts), [guest posts](/services/guest-posting), and [community links](/services/crowd-links). See real outcomes in our [case studies](/case-studies), or explore niche-specific bundles in our [link building packages](/services/link-packages/saas).',
      ],
      faqs: [
        { q: 'What is a niche edit?', a: 'A niche edit, also called a link insertion, is a backlink added to an existing article. The link is placed inside relevant content rather than publishing a completely new guest post.' },
        { q: 'Are niche edits safe?', a: 'No link-building method is completely risk-free. We manually review potential placements and focus on relevant websites and articles rather than approving sites only because they meet a DR threshold.' },
        { q: 'Are niche edits faster than guest posts?', a: "Usually yes, because a new article doesn't need to be written and published. Typical delivery is 3–7 days, although publisher response times can vary." },
        { q: 'Can I control the anchor text?', a: 'Yes. Clients can provide preferred anchors. For ongoing campaigns, we can also recommend anchors based on the current backlink profile and target pages.' },
        { q: 'Which DR package should I choose?', a: 'It depends on the current backlink profile, competitors, target pages, and budget. Not every link needs to be DR50–60+. Clients can order a specific level or ask us to recommend a mix.' },
        { q: 'Do you guarantee indexing?', a: 'No. We can check whether a page is accessible and indexed when evaluating it, but indexing is controlled by search engines and can change over time.' },
        { q: 'Are niche edits permanent?', a: "Placements are intended to remain live, but third-party websites are outside our permanent control. If a placement is removed within the coverage period, contact us and we'll replace it." },
      ],
    },
    finalCta: {
      title: 'Ready to Add Niche Edits?',
      desc: 'Choose your DR and traffic level and add the placements you need.',
      cta: 'View Packages',
      ctaSecondary: 'Get a Link Plan',
    },
    cart: {
      perPlacement: '/ placement',
      example: 'Example',
      alreadyInCart: 'already in cart',
      added: 'Added',
      addMore: 'Add {qty} More',
      addToCart: 'Add {qty} to Cart',
    },
  },
  uk: {
    seo: {
      title: 'Купити нішеві едіти та вставки посилань | Vladenza',
      description: 'Нішеві едити та вставки посилань у вже існуючий, релевантний контент. Вибирайте з варіантів DR та органічного трафіку. Ціни від $70 за розміщення. Доставка 3–7 днів.',
    },
    hero: {
      badge: 'Послуга лінкбілдингу',
      title: 'Лінкбілдинг через нішеві едити',
      subtitle: 'Беклінки всередині існуючого, релевантного контенту.',
      desc: 'Нішеві едити розміщують ваше посилання всередині вже опублікованої статті на релевантному сайті. Оберіть рівень DR та органічного трафіку під вашу кампанію — або дозвольте нам підібрати мікс на основі вашого сайту та бюджету.',
      fromPrice: `Від $${NICHE_EDIT_STARTING_PRICE}`,
      delivery: 'Доставка 3–7 днів',
      manualReview: 'Ручна перевірка',
      cta: 'Переглянути пакети',
      ctaSecondary: 'Реальні розміщення',
      exampleLabel: 'Приклад пакета',
      exampleDr: 'DR40+',
      exampleTraffic: '1,000–20,000 трафік',
      exampleFeatures: ['Домен DR 40+', 'Контекстне розміщення', 'Доставка 3–7 днів', 'Ручна перевірка'],
      sampleReport: 'Зразок звіту',
    },
    trust: {
      years: 'Років у лінкбілдингу',
      orders: 'Виконаних замовлень',
      manual: 'Лінкбілдинг',
      manualValue: 'Ручна робота',
    },
    whyUse: {
      title: 'Навіщо використовувати нішеві едити?',
      desc: 'Нішеві едити дозволяють додавати посилання до вже опублікованих сторінок. Вони корисні самостійно та можуть доповнювати гостьові публікації й інші типи посилань у ширшій кампанії.',
      benefits: [
        { icon: Link2, title: 'Існуючий контент', desc: 'Ваше посилання додається до вже опублікованої статті.' },
        { icon: Target, title: 'Контекстне розміщення', desc: 'Посилання розміщується всередині контенту, релевантного цільовій сторінці.' },
        { icon: TrendingUp, title: 'Варіанти DR та трафіку', desc: 'Оберіть рівень, що відповідає кампанії та бюджету.' },
        { icon: Zap, title: 'Швидше виконання', desc: 'Не потрібно писати нову статтю. Типова доставка — 3–7 днів.' },
      ],
    },
    packages: {
      title: 'Оберіть свій нішевий едит',
      desc: 'Оберіть рівень DR та трафіку залежно від вашої кампанії та бюджету. Ми підберемо релевантну можливість у межах обраного діапазону та вручну перевіримо розміщення перед публікацією.',
    },
    notSure: {
      title: 'Не впевнені, які посилання потрібні?',
      desc: 'Надішліть нам свій сайт та бюджет. Ми порівняємо ваш беклінк-профіль із конкурентами та порадимо, як розподілити бюджет.',
      features: ['Аналіз профілю', 'Розподіл бюджету', 'Рекомендований мікс посилань'],
      cta: 'Отримати план посилань',
    },
    differentLinks: {
      title: 'Різні посилання для різних кампаній',
      p1: 'Не кожній кампанії потрібен однаковий мікс беклінків. Деяким сайтам потрібно більше реферальних доменів. Іншим — сильніші розміщення на важливі комерційні сторінки. Конкурентні ніші можуть вимагати більше високих DR-сайтів з великим трафіком.',
      p2: 'Саме тому ми пропонуємо кілька рівнів DR та трафіку замість одного фіксованого пакета. Обирайте розміщення самостійно або довірте нам скласти мікс під ваш сайт та бюджет.',
    },
    placements: {
      title: 'Реальні розміщення нішевих едитів',
      desc: 'Приклади з виконаних замовлень, з метриками Ahrefs DR та органічним трафіком.',
      viewAll: 'Усі приклади нішевих едитів',
      sampleReport: 'Зразок звіту',
    },
    howOrdering: {
      title: 'Як працює замовлення',
      steps: [
        { icon: ShoppingCart, title: 'Оберіть', desc: 'Оберіть DR, рівень трафіку та кількість.' },
        { icon: Link2, title: 'Вимоги', desc: 'Додайте URL, анкори та нотатки — або надішліть пізніше.' },
        { icon: Check, title: 'Перевірка', desc: 'Ми перевіряємо вимоги та доступні розміщення.' },
        { icon: Zap, title: 'Розміщення', desc: 'Схвалене посилання з’являється у вашому звіті.' },
      ],
    },
    cases: {
      title: 'Реальні кампанії. Реальні результати.',
      desc: 'Побачте, як нішеві едити вписуються у ширші лінкбілдинг-кампанії на конкурентних ринках.',
      viewAll: 'Усі кейс-стаді',
    },
    vsGuestPosts: {
      title: 'Нішеві едити vs. Гостьові публікації',
    },
    seoBlock: {
      heading: 'Нішеві едити у вашій стратегії лінкбілдингу',
      intro: 'Нішеві едити, також звані вставками посилань, додають беклінки до вже опублікованих статей. Їх зазвичай використовують разом із гостьовими публікаціями, форумними посиланнями та іншими розміщеннями для різноманітності реферальних доменів та підтримки важливих сторінок.',
      body: [
        'Вибір має враховувати як вимірні критерії, так і релевантність. Ми дивимось на DR, органічний трафік, саму статтю, тему, цільову сторінку, анкор та існуючий беклінк-профіль — а не лише на поріг DR.',
        'Клієнти можуть замовляти окремі розміщення за рівнями DR та трафіку, але більші кампанії можуть використовувати мікс цінових рівнів. Не кожне посилання має бути преміальним. Посилання DR10+ має інше призначення, ніж DR50+, і обидва можуть бути доречними в одному профілі залежно від кампанії.',
        'Для клієнтів, які ведуть тривалі лінкбілдинг-кампанії, ми можемо проаналізувати конкурентів та існуючий беклінк-профіль перед тим, як порадити мікс [нішевих едитів](/blog/niche-edits-vs-guest-posts), [гостьових публікацій](/services/guest-posting) та [крауд-посилань](/services/crowd-links). Дивіться реальні результати у наших [кейс-стаді](/case-studies) або дослідіть нішеві пакети у [пакетах лінкбілдингу](/services/link-packages/saas).',
      ],
      faqs: [
        { q: 'Що таке нішевий едит?', a: 'Нішевий едит, також званий вставкою посилання, — це беклінк, доданий до існуючої статті. Посилання розміщується всередині релевантного контенту, а не через публікацію нової гостьової статті.' },
        { q: 'Чи безпечні нішеві едити?', a: 'Жоден метод лінкбілдингу не є повністю безризиковим. Ми вручну перевіряємо потенційні розміщення та фокусуємось на релевантних сайтах і статтях, а не схвалюємо сайти лише за порогом DR.' },
        { q: 'Чи нішеві едити швидші за гостьові публікації?', a: 'Зазвичай так, бо не потрібно писати та публікувати нову статтю. Типова доставка — 3–7 днів, хоча час відповіді паблішерів може варіюватися.' },
        { q: 'Чи можу я контролювати анкор-текст?', a: 'Так. Клієнти можуть надати бажані анкори. Для тривалих кампаній ми також можемо порадити анкори на основі поточного беклінк-профілю та цільових сторінок.' },
        { q: 'Який пакет DR мені обрати?', a: 'Це залежить від поточного беклінк-профілю, конкурентів, цільових сторінок та бюджету. Не кожне посилання має бути DR50–60+. Клієнти можуть замовити конкретний рівень або попросити нас підібрати мікс.' },
        { q: 'Чи гарантуєте ви індексацію?', a: 'Ні. Ми можемо перевірити, чи сторінка доступна та проіндексована під час оцінки, але індексація контролюється пошуковими системами і може змінюватися з часом.' },
        { q: 'Чи нішеві едити постійні?', a: 'Розміщення плануються як постійні, але сторонні сайти не підконтрольні нам повністю. Якщо розміщення зникає протягом періоду покриття, зверніться до нас — ми замінимо його.' },
      ],
    },
    finalCta: {
      title: 'Готові додати нішеві едити?',
      desc: 'Оберіть рівень DR та трафіку і додайте потрібні вам розміщення.',
      cta: 'Переглянути пакети',
      ctaSecondary: 'Отримати план посилань',
    },
    cart: {
      perPlacement: '/ розміщення',
      example: 'Приклад',
      alreadyInCart: 'в кошику',
      added: 'Додано',
      addMore: 'Додати ще {qty}',
      addToCart: 'Додати {qty} у кошик',
    },
  },
} as const;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function PackageCard({ pkg }: { pkg: typeof nicheEditPackages[number] }) {
  const { locale } = useLocale();
  const c = content[locale].cart;
  const localizedTraffic = locale === 'uk'
    ? pkg.traffic.replace(' monthly traffic', ' трафіку на місяць')
    : pkg.traffic;
  const { addItem, items } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const inCart = items.find((i) => i.productId === `niche-edit-${pkg.id}`);
  const example = packageExamples[pkg.id];

  const handleAdd = () => {
    addItem(
      {
        productId: `niche-edit-${pkg.id}`,
        service: 'Niche Edits',
        name: `${locale === 'uk' ? 'Нішевий едит' : 'Niche Edit'} — ${pkg.label}`,
        description: localizedTraffic,
        unitPrice: pkg.price,
      },
      qty
    );
    setJustAdded(true);
    trackEvent('add_to_cart', { product_id: pkg.id, quantity: qty, price: pkg.price });
    trackMetaEvent('AddToCart', {
      content_name: `Niche Edit ${pkg.label}`,
      content_category: 'Niche Edits',
      content_ids: [`niche-edit-${pkg.id}`],
      content_type: 'product',
      value: pkg.price * qty,
      currency: 'USD',
      contents: [{ id: `niche-edit-${pkg.id}`, quantity: qty, item_price: pkg.price }],
    });
    setTimeout(() => setJustAdded(false), 1500);
    setQty(1);
  };

  return (
    <div className={`rounded-2xl p-6 border flex flex-col transition-all duration-200 ${pkg.highlight ? 'bg-[#F97316] border-[#F97316]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
      <div className="text-xl font-bold text-white mb-1">{pkg.label}</div>
      <div className={`text-xs mb-5 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{localizedTraffic}</div>
      <div className="text-3xl font-black text-white mb-4">
        ${pkg.price}
        <span className={`text-sm font-medium ml-1.5 ${pkg.highlight ? 'text-white/80' : 'text-gray-400'}`}>{c.perPlacement}</span>
      </div>

      {example && example.url && (
        <a
          href={example.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1.5 text-xs mb-4 transition-colors ${pkg.highlight ? 'text-white/70 hover:text-white' : 'text-gray-500 hover:text-[#F97316]'}`}
        >
          <ExternalLink size={11} className="flex-shrink-0" />
          {c.example}: {example.domain} · DR{example.dr} · {example.traffic}
        </a>
      )}

      {inCart && (
        <div className={`text-xs font-semibold mb-3 ${pkg.highlight ? 'text-white/90' : 'text-[#F97316]'}`}>
          {inCart.quantity} {c.alreadyInCart}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 mt-auto">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${pkg.highlight ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
        >
          <Minus size={14} />
        </button>
        <span className="text-lg font-bold text-white w-8 text-center">{qty}</span>
        <button
          onClick={() => setQty(qty + 1)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${pkg.highlight ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
        >
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={handleAdd}
        disabled={justAdded}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
          justAdded
            ? 'bg-green-500 text-white'
            : pkg.highlight
              ? 'bg-white text-[#F97316] hover:bg-gray-100'
              : 'bg-[#F97316] hover:bg-[#EA580C] text-white'
        }`}
      >
        {justAdded ? (
          <><Check size={15} /> {c.added}</>
        ) : inCart ? (
          <>{c.addMore.replace('{qty}', String(qty))}</>
        ) : (
          <>{c.addToCart.replace('{qty}', String(qty))}</>
        )}
      </button>
    </div>
  );
}

export default function NicheEditsPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);
  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: locale === 'uk' ? 'https://vladenza.com/uk/services/niche-edits' : 'https://vladenza.com/services/niche-edits',
  });

  const [relatedCases, setRelatedCases] = useState<RelatedCase[]>([]);
  const [linkPlanOpen, setLinkPlanOpen] = useState(false);
  const viewContentFired = useRef(false);

  useEffect(() => {
    if (viewContentFired.current) return;
    viewContentFired.current = true;
    trackMetaEvent('ViewContent', {
      content_name: 'Niche Edit Link Building',
      content_category: 'Niche Edits',
      content_ids: ['niche-edits'],
      content_type: 'product',
    });
  }, []);

  useEffect(() => {
    const preloaded = typeof window === 'undefined'
      ? (globalThis as Record<string, unknown>).__SSR_RELATED_CASES__ as RelatedCase[] | undefined
      : undefined;
    if (preloaded && preloaded.length > 0) {
      setRelatedCases(preloaded);
      return;
    }
    supabase
      .from('case_studies')
      .select('slug,title,niche,service,period,metric,metric_sub,color,challenge')
      .eq('published', true)
      .ilike('service', '%niche edit%')
      .limit(3)
      .then(({ data }) => {
        if (data) setRelatedCases(data as RelatedCase[]);
      });
  }, []);

  const openLinkPlan = () => {
    trackEvent('get_link_plan');
    setLinkPlanOpen(true);
  };

  return (
    <ServicePageLayout>
      {/* Hero — compact */}
      <section className="relative overflow-hidden pt-10 pb-10 lg:pt-12 lg:pb-12">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, #fff8f1 0%, #ffffff 55%)' }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10 lg:gap-12 items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#C2410C] mb-4">{c.hero.badge}</p>
              <h1 className="text-[28px] md:text-4xl lg:text-[40px] font-bold text-gray-900 leading-[1.1] tracking-tight mb-4">
                {c.hero.title}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-2 font-semibold">
                {c.hero.subtitle}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-lg">
                {c.hero.desc}
              </p>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-900">{c.hero.fromPrice}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-500">{c.hero.delivery}</span>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-sm text-gray-500">{c.hero.manualReview}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => { scrollToId('packages'); trackEvent('view_packages'); }}
                  className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                >
                  {c.hero.cta} <ArrowDown size={14} />
                </button>
                <button
                  onClick={() => scrollToId('placements')}
                  className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900 font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-gray-50"
                >
                  {c.hero.ctaSecondary}
                </button>
              </div>
            </div>

            {/* Product visual — desktop only */}
            <div className="hidden lg:block">
              <button
                onClick={() => scrollToId('packages')}
                className="block w-full text-left bg-white border border-gray-200 rounded-2xl p-5 shadow-sm shadow-gray-200/60 hover:border-[#F97316]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="rounded-xl p-3 bg-orange-50/60 border border-orange-100/60 mb-4">
                  <div className="text-xs font-semibold text-gray-400 mb-2">{c.hero.exampleLabel}</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-gray-900">{c.hero.exampleDr}</div>
                      <div className="text-xs text-gray-400">{c.hero.exampleTraffic}</div>
                    </div>
                    <div className="text-2xl font-black text-[#F97316]">$200</div>
                  </div>
                </div>
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  {c.hero.exampleFeatures.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                      <Check size={12} className="text-[#F97316] flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
                {sampleReportUrl && (
                  <a href={sampleReportUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors mt-3 pt-3 border-t border-gray-100">
                    {c.hero.sampleReport} <ArrowRight size={12} />
                  </a>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip — compact */}
      <section className="bg-gray-950 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-0">
            <div className="flex items-center justify-center gap-3">
              <Trophy size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">8+</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.trust.years}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 sm:border-x sm:border-white/10 sm:px-6">
              <Package size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">3,000+</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.trust.orders}</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="text-[#F97316]" />
              <div>
                <div className="text-xl font-black text-white leading-none">{c.trust.manualValue}</div>
                <div className="text-[11px] text-gray-400 mt-1">{c.trust.manual}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews / Social proof */}
      <ReviewsSection />

      {/* Why Use Niche Edits — 4 cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.whyUse.title}</h2>
          <p className="text-gray-500 text-sm mb-10 max-w-xl">
            {c.whyUse.desc}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.whyUse.benefits.map((b) => (
              <div key={b.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3">
                  <b.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{b.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-16 bg-gray-950 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{c.packages.title}</h2>
          <p className="text-gray-400 text-sm max-w-lg mb-10">
            {c.packages.desc}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nicheEditPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* Not sure what to choose? — compact recommendation card */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-orange-50/50 border border-orange-100 rounded-2xl p-6">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-lg font-bold text-gray-900 mb-2">{c.notSure.title}</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                {c.notSure.desc}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {c.notSure.features.map((f) => (
                  <span key={f} className="text-xs text-gray-500 bg-white border border-gray-200 rounded-lg px-2.5 py-1">{f}</span>
                ))}
              </div>
            </div>
            <button
              onClick={openLinkPlan}
              className="flex-shrink-0 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-md flex items-center gap-2 whitespace-nowrap"
            >
              {c.notSure.cta} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Different Links for Different Campaigns */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">{c.differentLinks.title}</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-3">
            {c.differentLinks.p1}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            {c.differentLinks.p2}
          </p>
        </div>
      </section>

      {/* Real Placement Explorer */}
      <section id="placements" className="py-16 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.placements.title}</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-lg">
            {c.placements.desc}
          </p>
          <PlacementExplorer serviceType="niche_edit" />
          <div className="mt-6">
            <Link to={lp('/placements')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
              {c.placements.viewAll} <ArrowRight size={14} />
            </Link>
          </div>
          {sampleReportUrl && (
            <div className="mt-6">
              <a href={sampleReportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                {c.placements.sampleReport} <ArrowRight size={14} />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* How Ordering Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">{c.howOrdering.title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.howOrdering.steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mx-auto mb-3">
                  <step.icon size={18} className="text-[#F97316]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mx-auto mb-3 text-gray-400 font-bold text-xs">
                  {i + 1}
                </div>
                <h4 className="text-gray-900 font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Campaign Cases */}
      {relatedCases.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{c.cases.title}</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-lg">
              {c.cases.desc}
            </p>
            <CaseStudyCards cases={relatedCases} />
            <div className="mt-8">
              <a href={lp('/case-studies')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                {c.cases.viewAll} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Niche Edits vs Guest Posts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">{c.vsGuestPosts.title}</h2>
          <div className="mb-10" />
          <NicheEditsVsGuestPosts onScrollToPackages={() => scrollToId('packages')} />
        </div>
      </section>

      <ServiceSeoBlock
        heading={c.seoBlock.heading}
        intro={c.seoBlock.intro}
        body={c.seoBlock.body.map(localizeLinks)}
        faqs={c.seoBlock.faqs}
      />

      {/* Final CTA */}
      <section className="py-16 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{c.finalCta.title}</h2>
          <p className="text-gray-400 text-sm mb-6">
            {c.finalCta.desc}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => { scrollToId('packages'); trackEvent('view_packages'); }}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-400/20 flex items-center gap-2"
            >
              {c.finalCta.cta} <ArrowRight size={14} />
            </button>
            <button
              onClick={openLinkPlan}
              className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all duration-200"
            >
              {c.finalCta.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      <LinkPlanModal open={linkPlanOpen} onClose={() => setLinkPlanOpen(false)} />
    </ServicePageLayout>
  );
}
