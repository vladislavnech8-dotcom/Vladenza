export interface ReviewPlatform {
  name: string;
  domain: string;
  score: string;
  reviewCount: string;
  href: string;
  accent: string;
}

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  { name: 'Trustpilot', domain: 'trustpilot.com', score: '4.9', reviewCount: '50+ reviews', href: 'https://www.trustpilot.com/review/vladenza.com', accent: '#00B67A' },
  { name: 'Clutch',     domain: 'clutch.co',      score: '4.9', reviewCount: '40+ reviews', href: 'https://clutch.co/profile/vladenza',              accent: '#EF3E27' },
  { name: 'Fiverr',     domain: 'fiverr.com',      score: '4.9', reviewCount: '200+ orders', href: 'https://www.fiverr.com/vladenza',                 accent: '#1DBF73' },
  { name: 'Google',     domain: 'google.com',      score: '4.9', reviewCount: '60+ reviews', href: 'https://g.page/r/vladenza',                       accent: '#4285F4' },
];
