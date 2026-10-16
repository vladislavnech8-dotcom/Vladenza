import type { Locale } from './i18n';

interface ProductDisplay {
  name: string;
  description: string;
}

const productDisplayEn: Record<string, ProductDisplay> = {
  'niche-edit-good-place': { name: 'Link Insertion — GOOD PLACE', description: 'DR20+ · 1K+ organic traffic' },
  'niche-edit-better-place': { name: 'Link Insertion — BETTER PLACE', description: 'DR40+ · 5K+ organic traffic' },
  'niche-edit-picky-mode': { name: 'Link Insertion — PICKY MODE', description: 'DR50+ · 10K+ organic traffic' },
  'guest-post-start': { name: 'Guest Posting — START', description: 'includes 3 guest posts' },
  'guest-post-grow': { name: 'Guest Posting — GROW', description: 'includes 5 guest posts' },
  'guest-post-scale': { name: 'Guest Posting — SCALE', description: 'includes 10 guest posts' },
  'crowd-marketing-start': { name: 'Crowd Marketing — START', description: '25 placements' },
  'crowd-marketing-grow': { name: 'Crowd Marketing — GROW', description: '50 placements' },
  'crowd-marketing-scale': { name: 'Crowd Marketing — SCALE', description: '100 placements' },
};

const productDisplayUk: Record<string, ProductDisplay> = {
  'niche-edit-good-place': { name: 'Розміщення посилань — GOOD PLACE', description: 'DR20+ · 1K+ органічного трафіку' },
  'niche-edit-better-place': { name: 'Розміщення посилань — BETTER PLACE', description: 'DR40+ · 5K+ органічного трафіку' },
  'niche-edit-picky-mode': { name: 'Розміщення посилань — PICKY MODE', description: 'DR50+ · 10K+ органічного трафіку' },
  'guest-post-start': { name: 'Гостьові публікації — START', description: 'включає 3 гостьові публікації' },
  'guest-post-grow': { name: 'Гостьові публікації — GROW', description: 'включає 5 гостьових публікацій' },
  'guest-post-scale': { name: 'Гостьові публікації — SCALE', description: 'включає 10 гостьових публікацій' },
  'crowd-marketing-start': { name: 'Крауд-маркетинг — START', description: '25 розміщень' },
  'crowd-marketing-grow': { name: 'Крауд-маркетинг — GROW', description: '50 розміщень' },
  'crowd-marketing-scale': { name: 'Крауд-маркетинг — SCALE', description: '100 розміщень' },
};

export function getProductDisplay(productId: string, locale: Locale): ProductDisplay | null {
  const table = locale === 'uk' ? productDisplayUk : productDisplayEn;
  return table[productId] ?? null;
}

export function getCartItemName(productId: string, fallbackName: string, locale: Locale): string {
  return getProductDisplay(productId, locale)?.name ?? fallbackName;
}

export function getCartItemDescription(productId: string, fallbackDescription: string, locale: Locale): string {
  return getProductDisplay(productId, locale)?.description ?? fallbackDescription;
}
