export interface NicheEditPlacement {
  id: number;
  url: string;
  domain: string;
  niche: string;
  dr: number;
  traffic: number;
  keywords?: number;
  screenshot: string;
}

export const nicheEditPlacements: NicheEditPlacement[] = [
  { id: 1, url: 'https://droven.io/why-predictability-matters-in-networking/', domain: 'droven.io', niche: 'Tech', dr: 37, traffic: 260464, keywords: 35, screenshot: '/samples/niche-edit-droven.jpg' },
  { id: 2, url: 'https://www.agicent.com/blog/instagram-growth-hacks-to-get-followers/', domain: 'agicent.com', niche: 'Marketing', dr: 54, traffic: 21972, keywords: 464, screenshot: '/samples/niche-edit-agicent.jpg' },
  { id: 3, url: 'https://thefoxmagazine.com/technology/apps/6-techniques-for-gaining-followers-on-instagram-in-2025/', domain: 'thefoxmagazine.com', niche: 'Tech', dr: 52, traffic: 1258, keywords: 405, screenshot: '/samples/niche-edit-thefoxmagazine.jpg' },
  { id: 4, url: 'https://www.intelligentliving.co/digital-marketing-actionable-insight/', domain: 'intelligentliving.co', niche: 'Marketing', dr: 64, traffic: 524, keywords: 444, screenshot: '/samples/niche-edit-intelligentliving.jpg' },
  { id: 5, url: 'https://ccr-mag.com/unlocking-your-best-smile-dental-innovations-for-a-confident-you/', domain: 'ccr-mag.com', niche: 'Health', dr: 64, traffic: 1076, keywords: 571, screenshot: '/samples/niche-edit-ccrmag.jpg' },
  { id: 6, url: 'https://theglobalhues.com/a-beginners-guide-to-choosing-the-right-hosting-plan-for-your-website/', domain: 'theglobalhues.com', niche: 'Tech', dr: 52, traffic: 7028, keywords: 766, screenshot: '/samples/niche-edit-theglobalhues.jpg' },
];

export function getPlacementNiches(): string[] {
  return Array.from(new Set(nicheEditPlacements.map((p) => p.niche))).sort();
}
