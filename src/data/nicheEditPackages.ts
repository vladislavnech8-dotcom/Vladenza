export interface NicheEditPackage {
  id: string;
  label: string;
  dr: string;
  traffic: string;
  price: number;
  highlight: boolean;
}

export const nicheEditPackages: NicheEditPackage[] = [
  { id: 'dr10', label: 'DR10+', dr: 'DR 10+', traffic: '500–1,000 monthly traffic', price: 1, highlight: false },
  { id: 'dr20', label: 'DR20+', dr: 'DR 20+', traffic: '1,000–5,000 monthly traffic', price: 90, highlight: false },
  { id: 'dr30', label: 'DR30+', dr: 'DR 30+', traffic: '1,000–10,000 monthly traffic', price: 110, highlight: false },
  { id: 'dr40', label: 'DR40+', dr: 'DR 40+', traffic: '1,000–20,000 monthly traffic', price: 200, highlight: true },
  { id: 'dr50', label: 'DR50+', dr: 'DR 50+', traffic: '1,000–30,000 monthly traffic', price: 280, highlight: false },
  { id: 'dr60', label: 'DR60+', dr: 'DR 60+', traffic: '1,000–60,000 monthly traffic', price: 400, highlight: false },
];

export const NICHE_EDIT_STARTING_PRICE = nicheEditPackages[0].price;

export interface PackageExample {
  domain: string;
  dr: number | null;
  traffic: string;
  url: string;
}

export const packageExamples: Record<string, PackageExample | null> = {
  dr10: null,
  dr20: null,
  dr30: null,
  dr40: null,
  dr50: null,
  dr60: null,
};

export const sampleReportUrl = '';

