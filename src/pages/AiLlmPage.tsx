import { useState } from 'react';
import { Cpu, Search, Globe, TrendingUp, ArrowRight, Zap, Star, BookOpen, MessageSquare } from 'lucide-react';
import ServicePageLayout from '../components/ServicePageLayout';
import ServiceSeoBlock from '../components/ServiceSeoBlock';
import OrderModal, { type Package } from '../components/OrderModal';
import { useSEO } from '../hooks/useSEO';
import { useLocale } from '../context/LocaleContext';

const content = {
  en: {
    seo: {
      title: 'AI SEO Service — Get Cited by ChatGPT | Vladenza',
      description: 'AI SEO service for AI search engines. GEO strategy, entity building, and content placement so ChatGPT, Gemini, and Perplexity recommend you.',
    },
    hero: {
      badge: 'Service — AI & LLM SEO',
      title1: 'Get Cited by ChatGPT,',
      title2: 'Perplexity & Gemini',
      desc: 'AI search is the fastest-growing discovery channel. We optimise your brand and content to appear as a trusted source when users query AI engines in your niche.',
      cta: 'Start AI Optimisation',
      ctaSecondary: 'Free AI Visibility Audit',
    },
    whyItMatters: [
      { stat: '40%', label: 'of US adults now use AI chatbots for product research (2025)' },
      { stat: '3x', label: 'more brand impressions from ChatGPT citations vs. traditional SEO snippet' },
      { stat: '60%+', label: 'of Gen Z turns to AI search before traditional Google searches' },
      { stat: '$0', label: 'cost-per-click when AI cites your brand organically' },
    ],
    services: [
      { icon: Cpu, title: 'LLM Visibility Optimisation', desc: 'Structure your content so ChatGPT, Gemini, Perplexity, and Claude cite your brand when users ask questions in your niche.' },
      { icon: BookOpen, title: 'AI-Cited Content Strategy', desc: 'We write and place long-form authoritative content specifically designed to be retrieved and cited by large language models as a source.' },
      { icon: Search, title: 'Perplexity & AI Search Ranking', desc: 'Optimise your pages for AI-powered search interfaces that use RAG (retrieval-augmented generation) to pull answers from indexed web content.' },
      { icon: Globe, title: 'Wikipedia & Knowledge Graph', desc: 'Build brand entity presence across Wikipedia, Wikidata, and structured data sources that LLMs use as ground-truth training references.' },
      { icon: MessageSquare, title: 'Brand Mention Campaigns', desc: 'Increase your brand\'s unlinked and linked mentions across authoritative publications so AI models associate your name with your niche.' },
      { icon: TrendingUp, title: 'Generative Engine Optimisation (GEO)', desc: 'Full GEO audit and roadmap — covering entity coverage, topical authority, schema markup, and source credibility signals for AI engines.' },
    ],
    servicesSection: {
      badge: 'What We Do',
      title: 'Comprehensive AI search optimisation',
      desc: 'From LLM entity coverage to Perplexity ranking and AI Overview inclusion — we cover the full generative search landscape.',
    },
    platforms: {
      title: 'Platforms we optimise for',
      desc: 'We track citation rates across every major AI engine — not just ChatGPT.',
    },
    approach: [
      { num: '01', title: 'Entity Audit', desc: 'We map how AI models currently perceive your brand — what they know, what they get wrong, and what they ignore.' },
      { num: '02', title: 'Content Architecture', desc: 'We design a content structure that answers the exact queries LLMs retrieve information for in your niche.' },
      { num: '03', title: 'Authority Placement', desc: 'Strategic placements on high-authority sources that LLMs heavily weight — Wikipedia, industry publications, .edu and .gov adjacent sites.' },
      { num: '04', title: 'Schema & Structured Data', desc: 'Implement Organisation, Product, FAQ, and HowTo schema to make your content machine-readable and AI-indexable.' },
      { num: '05', title: 'Monitor & Iterate', desc: 'Monthly tracking of AI citation rate, brand mention velocity, and GEO-specific keyword visibility across AI search engines.' },
    ],
    approachSection: {
      title: 'Our GEO methodology',
      desc: 'A systematic five-step process to make your brand the trusted answer in AI-generated responses.',
      cta: 'Get AI Visibility Audit',
    },
    seoBlock: {
      heading: 'Get your brand cited by ChatGPT, Perplexity, and AI Overviews',
      intro: 'AI search is now a primary discovery channel. Tools like ChatGPT, Gemini, and Perplexity summarise answers and recommend specific brands — often before a user ever clicks a traditional result. Generative Engine Optimisation (GEO) makes your brand one of the sources these systems trust and cite.',
      body: [
        "AI visibility is built on the same foundations as strong SEO: clear entity signals, consistent brand mentions across trusted sites, structured content that is easy to extract, and a credible third-party footprint. We combine entity building, AI-cited content placement, and authority signals so language models associate your brand with the topics that matter.",
        "This works hand in hand with traditional link building. The editorial mentions earned through [guest posting](/services/guest-posting) and the diversified signals from [crowd links](/services/crowd-links) also feed AI systems. Read our guide on [getting cited by ChatGPT](/blog/geo-get-cited-by-chatgpt-2025) and why [link building in 2026](/blog/link-building-2026) now doubles as AI visibility.",
        "Explore measurable outcomes in our [case studies](/case-studies) to see how authority-first campaigns translate into both rankings and AI recognition.",
      ],
      faqs: [
        { q: 'What is Generative Engine Optimisation (GEO)?', a: 'GEO is the practice of optimising your brand and content so AI answer engines like ChatGPT and Perplexity cite, mention, and recommend you within their generated responses.' },
        { q: 'How is AI visibility different from traditional SEO?', a: 'Traditional SEO focuses on ranking pages in search results. AI visibility focuses on being recognised as a trusted source inside AI-generated answers. Both rely on authority, consistency, and clear entity signals — so they reinforce each other.' },
        { q: 'Can you guarantee my brand will be cited?', a: 'No one can guarantee AI citations, as models change frequently. What we can do is build the authority, entity, and content signals that measurably increase the likelihood of being referenced.' },
        { q: 'Does link building still matter for AI search?', a: 'Yes. Editorial links and brand mentions across trusted, relevant sites are among the strongest signals AI systems use to understand who is authoritative in a topic.' },
      ],
    },
  },
  uk: {
    seo: {
      title: 'AI SEO послуга — Отримайте згадки від ChatGPT | Vladenza',
      description: 'AI SEO послуга для AI-пошуковиків. GEO-стратегія, побудова сутностей та розміщення контенту, щоб ChatGPT, Gemini та Perplexity рекомендували вас.',
    },
    hero: {
      badge: 'Послуга — AI та LLM SEO',
      title1: 'Отримайте згадки від ChatGPT,',
      title2: 'Perplexity та Gemini',
      desc: 'AI-пошук — найшвидкозростаючий канал відкриття. Ми оптимізуємо ваш бренд та контент, щоб ви зʼявлялися як довірене джерело, коли користувачі запитують AI-движки у вашій ніші.',
      cta: 'Почати AI-оптимізацію',
      ctaSecondary: 'Безкоштовний аудит AI-видимості',
    },
    whyItMatters: [
      { stat: '40%', label: 'дорослих у США вже використовують AI-чат-боти для дослідження продуктів (2025)' },
      { stat: '3x', label: 'більше брендових показів через згадки ChatGPT порівняно зі звичайним SEO-сніпетом' },
      { stat: '60%+', label: 'покоління Z звертається до AI-пошуку раніше за традиційний Google' },
      { stat: '$0', label: 'вартість за клік, коли AI органічно цитує ваш бренд' },
    ],
    services: [
      { icon: Cpu, title: 'Оптимізація видимості в LLM', desc: 'Структуруємо ваш контент так, щоб ChatGPT, Gemini, Perplexity та Claude цитували ваш бренд, коли користувачі ставлять питання у вашій ніші.' },
      { icon: BookOpen, title: 'Стратегія AI-цитованого контенту', desc: 'Ми пишемо та розміщуємо авторитетний довгий контент, спеціально розроблений для витягування та цитування великими мовними моделями як джерело.' },
      { icon: Search, title: 'Ранжування в Perplexity та AI-пошуку', desc: 'Оптимізуємо ваші сторінки для AI-пошукових інтерфейсів, які використовують RAG (генерацію з доповненням вибіркою) для витягування відповідей з індексованого веб-контенту.' },
      { icon: Globe, title: 'Wikipedia та Knowledge Graph', desc: 'Будуємо присутність бренд-сутності у Wikipedia, Wikidata та структурованих джерелах даних, які LLM використовують як еталонні тренувальні посилання.' },
      { icon: MessageSquare, title: 'Кампанії згадок бренду', desc: 'Збільшуємо повʼязані та неповʼязані згадки вашого бренду в авторитетних виданнях, щоб AI-моделі асоціювали вашу назву з вашою нішевою.' },
      { icon: TrendingUp, title: 'Оптимізація для генеративних движків (GEO)', desc: 'Повний GEO-аудит та дорожня карта — покриття сутностей, тематичний авторитет, schema-розмітка та сигнали довіри джерела для AI-движків.' },
    ],
    servicesSection: {
      badge: 'Що ми робимо',
      title: 'Комплексна оптимізація AI-пошуку',
      desc: 'Від покриття сутностей у LLM до ранжування в Perplexity та потрапляння в AI Overviews — ми покриваємо повний ландшафт генеративного пошуку.',
    },
    platforms: {
      title: 'Платформи, під які ми оптимізуємо',
      desc: 'Ми відстежуємо рівень цитування у всіх основних AI-движках — а не лише ChatGPT.',
    },
    approach: [
      { num: '01', title: 'Аудит сутностей', desc: 'Ми складаємо мапу того, як AI-моделі зараз сприймають ваш бренд — що знають, у чому помиляються, що ігнорують.' },
      { num: '02', title: 'Архітектура контенту', desc: 'Проєктуємо структуру контенту, яка відповідає на запити, які LLM витягують у вашій ніші.' },
      { num: '03', title: 'Авторитетні розміщення', desc: 'Стратегічні розміщення на високоповажних джерелах, які LLM сильно зважають — Wikipedia, галузеві видання, сайти біля .edu та .gov.' },
      { num: '04', title: 'Schema та структуровані дані', desc: 'Впроваджуємо schema Organization, Product, FAQ та HowTo, щоб контент був машинозчитуваним та AI-індексованим.' },
      { num: '05', title: 'Моніторинг та ітерації', desc: 'Щомісячне відстеження рівня AI-цитування, швидкості згадок бренду та GEO-специфічної видимості ключових слів у AI-пошуковиках.' },
    ],
    approachSection: {
      title: 'Наша GEO-методологія',
      desc: 'Систематичний пʼятиетапний процес, щоб зробити ваш бренд довіреною відповіддю в AI-згенерованих відповідях.',
      cta: 'Отримати аудит AI-видимості',
    },
    seoBlock: {
      heading: 'Зробіть так, щоб ваш бренд цитували ChatGPT, Perplexity та AI Overviews',
      intro: 'AI-пошук тепер — основний канал відкриття. Такі інструменти, як ChatGPT, Gemini та Perplexity, узагальнюють відповіді та рекомендують конкретні бренди — часто ще до того, як користувач клікне по звичайному результату. Оптимізація для генеративних движків (GEO) робить ваш бренд одним із джерел, яким ці системи довіряють та цитують.',
      body: [
        "AI-видимість будується на тих самих засадах, що й сильне SEO: чіткі сигнали сутностей, послідовні згадки бренду на довірених сайтах, структурований контент, який легко витягувати, та надійний сторонній слід. Ми поєднуємо побудову сутностей, розміщення AI-цитованого контенту та сигнали авторитетності, щоб мовні моделі асоціювали ваш бренд із важливими темами.",
        "Це працює пліч-о-пліч із традиційним лінкбілдингом. Редакційні згадки, зароблені через [гостьові публікації](/services/guest-posting), та диверсифіковані сигнали з [крауд-посилань](/services/crowd-links) також живлять AI-системи. Прочитайте наш гайд про [отримання згадок від ChatGPT](/blog/geo-get-cited-by-chatgpt-2025) та чому [лінкбілдинг у 2026](/blog/link-building-2026) тепер подвоюється як AI-видимість.",
        "Дослідіть вимірювані результати у наших [кейс-стаді](/case-studies), щоб побачити, як кампанії з фокусом на авторитет перетворюються і на ранжування, і на AI-визнання.",
      ],
      faqs: [
        { q: 'Що таке оптимізація для генеративних движків (GEO)?', a: 'GEO — це практика оптимізації вашого бренду та контенту так, щоб AI-пошуковики на кшталт ChatGPT та Perplexity цитували, згадували та рекомендували вас у своїх згенерованих відповідях.' },
        { q: 'Чим AI-видимість відрізняється від традиційного SEO?', a: 'Традиційне SEO фокусується на ранжуванні сторінок у результатах пошуку. AI-видимість — на тому, щоб бути визнаним довіреним джерелом усередині AI-згенерованих відповідей. Обидва спираються на авторитет, послідовність та чіткі сигнали сутностей — тож вони посилюють одне одного.' },
        { q: 'Чи можете ви гарантувати, що бренд цитуватимуть?', a: 'Ніхто не може гарантувати AI-цитування, оскільки моделі часто змінюються. Але ми можемо побудувати сигнали авторитетності, сутностей та контенту, які вимірювано підвищують ймовірність згадок.' },
        { q: 'Чи лінкбілдинг все ще важливий для AI-пошуку?', a: 'Так. Редакційні посилання та згадки бренду на довірених, релевантних сайтах — серед найсильніших сигналів, які AI-системи використовують, щоб зрозуміти, хто є авторитетним у темі.' },
      ],
    },
  },
} as const;

const platformsData = [
  { name: 'ChatGPT', company: 'OpenAI', color: 'bg-green-50 text-green-700 border-green-200' },
  { name: 'Perplexity AI', company: 'Perplexity', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Gemini', company: 'Google', color: 'bg-orange-50 text-[#F97316] border-orange-200' },
  { name: 'Claude', company: 'Anthropic', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Copilot', company: 'Microsoft', color: 'bg-sky-50 text-sky-700 border-sky-200' },
  { name: 'AI Overviews', company: 'Google Search', color: 'bg-red-50 text-red-600 border-red-200' },
];

const AI_PKG: Package = { name: 'AI & LLM Visibility', price: 'Custom', links: 'GEO + entity strategy', service: 'AI & LLM SEO' };

export default function AiLlmPage() {
  const { locale, localizePath: lp } = useLocale();
  const c = content[locale];
  const localizeLinks = (text: string) => text.replace(/\]\((\/[^)]+)\)/g, (_, path) => `](${lp(path)})`);
  const aiPackage: Package = locale === 'uk'
    ? { name: 'Видимість у AI та LLM', price: 'Індивідуально', links: 'GEO + стратегія сутностей', service: 'AI та LLM SEO' }
    : AI_PKG;
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  useSEO({
    title: c.seo.title,
    description: c.seo.description,
    canonical: `https://vladenza.com${lp('/services/ai-llm')}/`,
    noindex: true,
  });
  return (
    <ServicePageLayout>
      <OrderModal pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
      {/* Hero */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gray-950">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="aiGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.2"/>
              <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
            </radialGradient>
            <radialGradient id="aiGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <ellipse cx="1300" cy="200" rx="500" ry="400" fill="url(#aiGlow1)"/>
          <ellipse cx="200" cy="400" rx="400" ry="300" fill="url(#aiGlow2)"/>
          <circle cx="1200" cy="150" r="320" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.15"/>
          <circle cx="1200" cy="150" r="220" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.18"/>
          <circle cx="1200" cy="150" r="120" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.22"/>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((_, col) => (
              <circle key={`ai-${row}-${col}`} cx={col * 50 + 30} cy={row * 50 + 30} r="1.5" fill="#F97316" opacity={0.08} />
            ))
          )}
          <line x1="0" y1="600" x2="500" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.07"/>
          <line x1="80" y1="600" x2="580" y2="0" stroke="#F97316" strokeWidth="0.8" opacity="0.05"/>
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] text-xs font-semibold mb-6 tracking-wide uppercase">
              <Cpu size={12} />
              {c.hero.badge}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold text-white leading-[1.08] tracking-tight mb-6">
              {c.hero.title1}<br />
              <span className="text-[#F97316]">{c.hero.title2}</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              {c.hero.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setSelectedPkg(aiPackage)} className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2">
                {c.hero.cta} <ArrowRight size={14} />
              </button>
              <button onClick={() => setSelectedPkg(aiPackage)} className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white px-5 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-white/5 flex items-center gap-2">
                <Zap size={13} className="text-[#F97316]" /> {c.hero.ctaSecondary}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {c.whyItMatters.map((item) => (
              <div key={item.stat} className="text-center">
                <div className="text-3xl lg:text-4xl font-black text-[#F97316] mb-2">{item.stat}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-4">
              {c.servicesSection.badge}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{c.servicesSection.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">{c.servicesSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.services.map((s) => (
              <div key={s.title} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#F97316]/30 hover:shadow-sm transition-all duration-300 group">
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
                  <s.icon size={18} className="text-[#F97316]" />
                </div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{c.platforms.title}</h2>
            <p className="text-gray-400 text-sm">{c.platforms.desc}</p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {platformsData.map((p) => (
              <div key={p.name} className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${p.color}`}>
                <Star size={12} />
                {p.name}
                <span className="opacity-60 text-xs">· {p.company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">{c.approachSection.title}</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">{c.approachSection.desc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {c.approach.map((step) => (
              <div key={step.num} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[#F97316]/30 transition-all duration-300">
                <div className="text-[#F97316] font-black text-sm mb-3">{step.num}</div>
                <h4 className="text-white font-semibold text-sm mb-2">{step.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <button onClick={() => setSelectedPkg(aiPackage)} className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:shadow-lg">
              {c.approachSection.cta} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>
      <ServiceSeoBlock
        heading={c.seoBlock.heading}
        intro={c.seoBlock.intro}
        body={c.seoBlock.body.map(localizeLinks)}
        faqs={c.seoBlock.faqs.map((faq) => ({ ...faq, a: localizeLinks(faq.a) }))}
      />
    </ServicePageLayout>
  );
}
