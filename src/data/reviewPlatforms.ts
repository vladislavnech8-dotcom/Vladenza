export interface ReviewPlatform {
  name: string;
  domain: string;
  href: string;
  accent: string;
}

export const REVIEW_PLATFORMS: ReviewPlatform[] = [
  { name: 'Fiverr', domain: 'fiverr.com', href: 'https://www.fiverr.com/fittranslate?public_mode=true', accent: '#1DBF73' },
  { name: 'Clutch', domain: 'clutch.co', href: 'https://clutch.co/profile/vladenza', accent: '#EF3E27' },
];
