export interface FeaturedCase {
  slug: string;
  title: string;
  niche: string;
  metric: string;
  metricSub: string;
  result: string;
  color: string;
}

const enFeatured: FeaturedCase[] = [
  {
    slug: 'igaming-domain-authority',
    title: 'Boosting Domain Authority for an iGaming Portal',
    niche: 'iGaming',
    metric: '+300',
    metricSub: 'Referring Domains',
    result: 'DR rose from 28 to 54. Referring domains grew from 140 to 440+. Top 5 money pages moved from page 3–4 to page 1.',
    color: '#F97316',
  },
  {
    slug: 'saas-non-brand-traffic',
    title: 'Non-Brand Traffic Surge for a SaaS Platform',
    niche: 'SaaS',
    metric: '+40%',
    metricSub: 'Non-Brand Traffic',
    result: 'Non-brand organic sessions increased by 40% in 6 months. 3 category pages entered top-5 for competitive head terms. Trial sign-ups from organic grew by 22%.',
    color: '#16a34a',
  },
  {
    slug: 'crypto-page1-ranking',
    title: 'Fast Page-1 Entry for a Crypto Exchange',
    niche: 'Crypto',
    metric: 'P2 → P1',
    metricSub: 'Google Ranking',
    result: 'The page moved from position 14 to position 4 within 45 days. Estimated organic value of the keyword: $8,000+/month.',
    color: '#2563eb',
  },
];

const ukFeatured: FeaturedCase[] = [
  {
    slug: 'igaming-domain-authority',
    title: 'Підвищення авторитету домену для iGaming-порталу',
    niche: 'iGaming',
    metric: '+300',
    metricSub: 'Домени, що посилаються',
    result: 'DR зріс із 28 до 54. Домени, що посилаються, зросли з 140 до 440+. Топ-5 комерційних сторінок піднялися з 3–4 сторінки на 1-шу.',
    color: '#F97316',
  },
  {
    slug: 'saas-non-brand-traffic',
    title: 'Зростання небрендового трафіку для SaaS-платформи',
    niche: 'SaaS',
    metric: '+40%',
    metricSub: 'Небрендовий трафік',
    result: 'Небрендові органічні сесії зросли на 40% за 6 місяців. 3 сторінки категорій увійшли в топ-5 за конкурентними головними термінами. Реєстрації тріалу з органіки зросли на 22%.',
    color: '#16a34a',
  },
  {
    slug: 'crypto-page1-ranking',
    title: 'Швидкий вихід на 1-шу сторінку для криптобіржі',
    niche: 'Криптовалют',
    metric: 'P2 → P1',
    metricSub: 'Рейтинг Google',
    result: 'Сторінка піднялася з позиції 14 до позиції 4 за 45 днів. Оціночна органічна вартість ключового слова: $8,000+/місяць.',
    color: '#2563eb',
  },
];

export function getFeaturedCases(locale: string): FeaturedCase[] {
  return locale === 'uk' ? ukFeatured : enFeatured;
}
