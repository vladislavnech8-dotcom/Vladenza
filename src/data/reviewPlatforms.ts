export interface ReviewPlatform {
  name: string;
  domain: string;
  score: string;
  reviewCount: string;
  href: string;
  accent: string;
}

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  { name: 'Fiverr', domain: 'fiverr.com', score: '4.9', reviewCount: '1.1K reviews', href: 'https://www.fiverr.com/fittranslate?public_mode=true', accent: '#1DBF73' },
  { name: 'Clutch', domain: 'clutch.co', score: '5.0', reviewCount: '11 reviews', href: 'https://clutch.co/profile/vladenza', accent: '#EF3E27' },
];
