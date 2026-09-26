import { NICHE_EDIT_STARTING_PRICE } from './nicheEditPackages';

export const PRICING = {
  linkInsertions: { from: NICHE_EDIT_STARTING_PRICE, coverage: '12-month coverage' },
  guestPosts: { from: 100, coverage: '12-month coverage' },
  crowdMarketing: { from: 290, coverage: '30-day replacement coverage' },
  managedCampaigns: { from: 500, coverage: null },
  whiteLabel: { from: 700, coverage: null },
} as const;

export const PRICING_LABELS_EN = {
  linkInsertions: `From $${PRICING.linkInsertions.from}`,
  guestPosts: `From $${PRICING.guestPosts.from}`,
  crowdMarketing: `From $${PRICING.crowdMarketing.from}`,
  managedCampaigns: `From $${PRICING.managedCampaigns.from}/month`,
  whiteLabel: 'Custom volume pricing',
} as const;

export const PRICING_LABELS_UK = {
  linkInsertions: `Від $${PRICING.linkInsertions.from}`,
  guestPosts: `Від $${PRICING.guestPosts.from}`,
  crowdMarketing: `Від $${PRICING.crowdMarketing.from}`,
  managedCampaigns: `Від $${PRICING.managedCampaigns.from}/міс`,
  whiteLabel: 'Індивідуальні ціни',
} as const;

export const COVERAGE_LABELS_EN = {
  linkInsertions: PRICING.linkInsertions.coverage!,
  guestPosts: PRICING.guestPosts.coverage!,
  crowdMarketing: PRICING.crowdMarketing.coverage!,
} as const;

export const COVERAGE_LABELS_UK = {
  linkInsertions: '12-місячне покриття',
  guestPosts: '12-місячне покриття',
  crowdMarketing: '30-денне покриття заміни',
} as const;
