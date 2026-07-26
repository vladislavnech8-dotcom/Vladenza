export interface CaseStat {
  label: string;
  value: string;
}

export interface CaseSection {
  type: 'intro' | 'h2' | 'h3' | 'p' | 'ul' | 'ol' | 'blockquote' | 'callout' | 'table';
  text?: string;
  items?: string[];
  label?: string;
  rows?: string[][];
  headers?: string[];
}

export interface CaseStudy {
  id: number;
  slug: string;
  metric: string;
  metricSub: string;
  period: string;
  title: string;
  niche: string;
  service: string;
  challenge: string;
  solution: string;
  result: string;
  tags: string[];
  bars: number[];
  color: string;
  stats: CaseStat[];
  image: string;
  body: CaseSection[];
  published?: boolean;
  screenshots?: string[];
  placementReport?: Record<string, string>[];
}

export const cases: CaseStudy[] = [
  {
    id: 1,
    slug: 'igaming-domain-authority',
    metric: '+300',
    metricSub: 'Referring Domains',
    period: '9 months',
    title: 'Boosting Domain Authority for an iGaming Portal',
    niche: 'iGaming',
    service: 'Guest Posting + Niche Edits',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A competitive casino portal stuck at DR 28 with minimal backlink diversity. Organic traffic had plateaued despite strong on-page SEO.',
    solution: 'We built a structured 9-month link acquisition campaign focused on DR 60–80+ domains in the iGaming and affiliate verticals. A mix of editorial guest posts and aged content inserts created a natural, diverse link profile.',
    result: 'DR rose from 28 to 54. Referring domains grew from 140 to 440+. Top 5 money pages moved from page 3–4 to page 1.',
    tags: ['iGaming', 'DR 60–80', 'Guest Posting', 'Niche Edits'],
    bars: [2, 3, 5, 7, 9, 12, 15, 18, 22],
    color: '#F97316',
    stats: [
      { label: 'DR increase', value: '28 → 54' },
      { label: 'Referring domains', value: '+300' },
      { label: 'Timeline', value: '9 months' },
      { label: 'Top pages ranking', value: '7 on page 1' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Casino and gambling SEO is one of the most contested verticals on the internet. Competitors have deep budgets, established domains, and years of link equity. Breaking through at DR 28 required a methodical, long-horizon strategy — not quick fixes.',
      },
      {
        type: 'h2',
        text: 'The Situation Before We Started',
      },
      {
        type: 'p',
        text: 'The client operated a casino portal covering game reviews, bonus comparisons, and operator rankings. Their on-page SEO was solid — content was comprehensive, metadata was optimised, and internal linking was structured. The problem was authority. At DR 28 with only 140 referring domains, they simply didn\'t have the domain weight to compete for commercial keywords dominated by DR 60–80+ competitors.',
      },
      {
        type: 'ul',
        items: [
          'DR 28 — significantly below top competitors (DR 55–75)',
          '140 referring domains with limited topical diversity',
          'Money pages stuck on page 3–4 despite good on-page signals',
          'No systematic link acquisition strategy in place',
        ],
      },
      {
        type: 'h2',
        text: 'Our Approach',
      },
      {
        type: 'h3',
        text: 'Phase 1: Foundation (Months 1–3)',
      },
      {
        type: 'p',
        text: 'We began with a thorough audit of the existing backlink profile to identify gaps and toxic patterns. The first three months focused on building foundational authority through editorial guest posts on iGaming-native publications — sites that Google already associates with the gambling vertical.',
      },
      {
        type: 'h3',
        text: 'Phase 2: Velocity Build (Months 4–7)',
      },
      {
        type: 'p',
        text: 'Once the foundation was established, we accelerated placement cadence. We targeted DR 60–80 domains in iGaming, affiliate marketing, and adjacent finance niches. Niche edits into aged, indexed content provided faster link equity transfer than fresh guest posts alone.',
      },
      {
        type: 'h3',
        text: 'Phase 3: Consolidation (Months 8–9)',
      },
      {
        type: 'p',
        text: 'The final phase focused on reinforcing the highest-value money pages. We identified the specific keywords within striking distance of page 1 and directed additional link equity precisely at those pages.',
      },
      {
        type: 'table',
        headers: ['Month', 'Activity', 'DR Range', 'Volume'],
        rows: [
          ['1–2', 'Audit + foundation guest posts', 'DR 40–60', '8–10 links'],
          ['3–5', 'Guest posts + niche edits', 'DR 55–75', '12–15 links'],
          ['6–8', 'Niche edits + high-DR placements', 'DR 65–80', '15–18 links'],
          ['9', 'Targeted consolidation', 'DR 60–80', '10 links'],
        ],
      },
      {
        type: 'h2',
        text: 'Anchor Strategy',
      },
      {
        type: 'p',
        text: 'iGaming anchor profiles require extreme care. Exact-match anchors for terms like "best online casino" trigger over-optimisation flags quickly. Our anchor distribution was designed for safety over the full 9-month horizon.',
      },
      {
        type: 'table',
        headers: ['Anchor Type', 'Target %', 'Rationale'],
        rows: [
          ['Brand / URL', '45%', 'Safe baseline, builds entity recognition'],
          ['Branded partial match', '25%', 'Natural variation on brand terms'],
          ['Generic / navigational', '18%', '"visit here", "learn more", "check out"'],
          ['Topical phrase match', '9%', '"casino games", "online slots guide"'],
          ['Exact match', '<3%', 'Strictly limited to avoid over-optimisation'],
        ],
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: 'Over 9 months, the domain\'s authority transformed from a mid-tier player to a credible competitor in the iGaming space. The referring domain count tripled and the quality of those domains improved significantly — from opportunistic placements to editorial links on recognised iGaming publications.',
      },
      {
        type: 'callout',
        label: 'Key result',
        text: 'Domain Rating rose from 28 to 54. 300 net new referring domains acquired. 7 top money pages moved from page 3–4 to page 1. All growth was maintained — no algorithmic penalties or traffic reversals.',
      },
      {
        type: 'blockquote',
        text: 'We\'d tried in-house link building before and hit a wall every time. The quality of placements and the consistency of the strategy made the difference — this was clearly done by a team that knows the iGaming space specifically.',
      },
    ],
  },
  {
    id: 2,
    slug: 'saas-non-brand-traffic',
    metric: '+40%',
    metricSub: 'Non-Brand Traffic',
    period: '6 months',
    title: 'Non-Brand Traffic Surge for a SaaS Platform',
    niche: 'SaaS',
    service: 'Crowd Marketing + Guest Posts',
    image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: "A B2B SaaS tool had excellent homepage rankings but almost zero non-brand keyword visibility. Category pages weren't ranking despite good content.",
    solution: 'We combined a crowd marketing campaign across 30+ tech forums with targeted guest posts anchored to category-level keywords. Anchor distribution was carefully mapped to avoid over-optimisation.',
    result: 'Non-brand organic sessions increased by 40% in 6 months. 3 category pages entered top-5 for competitive head terms. Trial sign-ups from organic grew by 22%.',
    tags: ['SaaS', 'B2B Tech', 'Crowd Marketing', 'Category Pages'],
    bars: [3, 4, 4, 5, 6, 8, 10, 12, 14],
    color: '#16a34a',
    stats: [
      { label: 'Non-brand traffic', value: '+40%' },
      { label: 'Top-5 rankings', value: '+3 pages' },
      { label: 'Timeline', value: '6 months' },
      { label: 'Organic trial sign-ups', value: '+22%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'The classic SaaS SEO trap: a strong brand presence masks a completely hollow non-brand keyword footprint. The product was genuinely good, the homepage ranked well for branded terms — but the category pages that would drive trial sign-ups from people who hadn\'t heard of them yet were invisible.',
      },
      {
        type: 'h2',
        text: 'The Problem with Brand-Only Rankings',
      },
      {
        type: 'p',
        text: 'When a SaaS company only ranks for its own brand name, organic search is functioning as a memory aid — not an acquisition channel. The real value of SEO for SaaS is capturing decision-stage searchers who are looking for solutions in your category but don\'t know you exist yet.',
      },
      {
        type: 'p',
        text: 'This client\'s category pages — targeting terms like "project management software", "team collaboration tool", and "task tracking app" — had zero external backlinks pointing to them. All link equity was concentrated on the homepage.',
      },
      {
        type: 'h2',
        text: 'The Strategy',
      },
      {
        type: 'h3',
        text: 'Crowd Marketing for Awareness and Diversification',
      },
      {
        type: 'p',
        text: 'We ran a crowd marketing campaign across 30+ tech-focused forums, subreddits, and Q&A communities. The goal was twofold: build a diverse referring domain profile that looked organic, and generate direct referral traffic from engaged tech communities.',
      },
      {
        type: 'ul',
        items: [
          'Selected platforms with genuine tech audiences and verified indexation',
          'Maintained realistic posting ratios — maximum 1 link per 12–15 posts per account',
          'Varied anchor text heavily — primarily branded and partial-match terms',
          'Targeted threads where the product was a genuinely relevant recommendation',
        ],
      },
      {
        type: 'h3',
        text: 'Guest Posts Anchored to Category Pages',
      },
      {
        type: 'p',
        text: 'Simultaneously, we ran a guest posting campaign specifically designed to direct link equity to the category pages — not the homepage. This required finding placements on publications that covered software, productivity, and B2B tools, and crafting content with natural in-content links to the client\'s category pages.',
      },
      {
        type: 'callout',
        label: 'Key tactic',
        text: 'Every guest post was planned with the destination page in mind first — not the host publication. This reversed the typical guest post process and ensured all placements served the commercial ranking goals directly.',
      },
      {
        type: 'h2',
        text: 'Results After 6 Months',
      },
      {
        type: 'table',
        headers: ['Metric', 'Before', 'After', 'Change'],
        rows: [
          ['Non-brand organic sessions', 'Baseline', '+40%', '+40%'],
          ['Category pages in top 5', '0', '3', '+3'],
          ['Organic trial sign-ups', 'Baseline', '+22%', '+22%'],
          ['Referring domains', '85', '180+', '+112%'],
        ],
      },
      {
        type: 'blockquote',
        text: 'We had great content on our category pages but they just weren\'t ranking. Within 4 months of the campaign starting we saw real movement — and the trial sign-ups from organic have been a meaningful part of our growth.',
      },
    ],
  },
  {
    id: 3,
    slug: 'crypto-page1-ranking',
    metric: 'P2 → P1',
    metricSub: 'Google Ranking',
    period: '45 days',
    title: 'Fast Page-1 Entry for a Crypto Exchange',
    niche: 'Crypto',
    service: 'Niche Edits',
    image: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A key landing page for a high-volume crypto keyword was stuck on page 2, position 14. The domain had sufficient authority but the page lacked contextual link equity.',
    solution: 'We identified 12 aged, indexed pages in finance and crypto niches with existing topical authority. Contextual link insertions with exact-match and phrase-match anchors were placed within 2 weeks.',
    result: 'The page moved from position 14 to position 4 within 45 days. Estimated organic value of the keyword: $8,000+/month.',
    tags: ['Crypto', 'Finance', 'Niche Edits', 'Rapid Results'],
    bars: [8, 7, 7, 6, 5, 4, 3, 2, 1],
    color: '#2563eb',
    stats: [
      { label: 'Position change', value: '14 → 4' },
      { label: 'Links placed', value: '12 inserts' },
      { label: 'Timeline', value: '45 days' },
      { label: 'Est. keyword value', value: '$8k/mo' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Page 2, position 14. A frustrating place to be for a high-value crypto keyword. The domain had the authority, the content was solid, competitors on page 1 weren\'t dramatically stronger. The issue was a single factor: the specific landing page had almost no external links pointing at it directly.',
      },
      {
        type: 'h2',
        text: 'Diagnosing the Problem',
      },
      {
        type: 'p',
        text: 'A detailed link gap analysis compared the client\'s page against the top 10 ranking pages. The domain DR was competitive, but page-level link metrics told a different story — competitors on page 1 had 15–30 contextual links pointing to their specific ranking pages. The client\'s page had 2.',
      },
      {
        type: 'p',
        text: 'This is the niche edits use case in its purest form: strong domain, weak page-level equity. A targeted insertion campaign rather than a broad authority-building effort was the correct approach.',
      },
      {
        type: 'h2',
        text: 'Finding the Right Placement Sites',
      },
      {
        type: 'p',
        text: 'For crypto and finance content, placement site selection is critical. We needed pages that were already ranking, already indexed, already trusted by Google in the finance/crypto vertical — not new guest posts that would take weeks to accumulate authority.',
      },
      {
        type: 'ul',
        items: [
          'Pages with DR 45+ and measurable organic traffic in crypto/finance topics',
          'Content already contextually discussing the target keyword cluster',
          'Pages indexed at least 6 months prior — aged content with established trust signals',
          'No recent manual actions or algorithmic penalties on the hosting domain',
        ],
      },
      {
        type: 'h2',
        text: 'Execution',
      },
      {
        type: 'p',
        text: 'All 12 insertions were completed within a 14-day window. Anchor text was split between exact match (4 links), phrase match (5 links), and branded partial match (3 links). Placement timing was distributed across the two-week window to avoid an unnatural link velocity spike.',
      },
      {
        type: 'callout',
        label: 'Why niche edits work faster',
        text: 'A link inserted into an aged, indexed page with existing topical authority transfers ranking signals immediately — there\'s no waiting for a new page to accumulate its own credibility. This is why niche edits typically show ranking movement 30–50% faster than equivalent guest posts on new content.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: 'Position movement began at day 18 and continued steadily. By day 45, the page had moved from position 14 to position 4 — now firmly on page 1 and capturing an estimated $8,000+/month in organic traffic value for that single keyword.',
      },
      {
        type: 'table',
        headers: ['Day', 'Position', 'Notes'],
        rows: [
          ['Day 1', '14', 'Baseline — all links placed by day 14'],
          ['Day 18', '11', 'First movement detected'],
          ['Day 28', '7', 'Page 1 entry'],
          ['Day 45', '4', 'Final position — top 5'],
        ],
      },
      {
        type: 'blockquote',
        text: 'The speed of the result was genuinely surprising. We\'d been stuck on page 2 for months. Within six weeks of the insertions going live, we were solidly on page 1.',
      },
    ],
  },
  {
    id: 4,
    slug: 'health-organic-growth',
    metric: '×2.4',
    metricSub: 'Organic Sessions',
    period: '12 months',
    title: 'Health Supplement Brand Scales Organic to 80k/mo',
    niche: 'Health',
    service: 'Full SEO Subscription',
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: "A supplement e-commerce brand was generating 33k monthly organic sessions but couldn't break through on competitive head terms due to thin authority and weak E-E-A-T signals.",
    solution: 'A 12-month full SEO subscription: monthly guest posts on health publications (DR 50–75+), E-E-A-T signals via expert bylines, technical audit fixes, and structured data implementation.',
    result: 'Monthly organic sessions grew from 33k to 80k. Revenue from organic increased by 67%. Domain Rating rose from 34 to 61.',
    tags: ['Health', 'E-commerce', 'E-E-A-T', 'Full SEO'],
    bars: [3, 4, 5, 6, 8, 9, 11, 13, 15],
    color: '#dc2626',
    stats: [
      { label: 'Organic sessions', value: '33k → 80k' },
      { label: 'DR growth', value: '34 → 61' },
      { label: 'Timeline', value: '12 months' },
      { label: 'Organic revenue', value: '+67%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Health supplements is a YMYL category where Google\'s E-E-A-T requirements are enforced most strictly. 33k monthly sessions was already meaningful, but the brand had plateaued — unable to rank for competitive head terms where DR 50+ competitors with expert-authored content dominated.',
      },
      {
        type: 'h2',
        text: 'Why YMYL Sites Need a Different Approach',
      },
      {
        type: 'p',
        text: 'Google\'s Quality Raters evaluate health content against strict Experience, Expertise, Authoritativeness, and Trustworthiness criteria. A supplement site without visible expert authorship, medical review disclosures, and third-party citations from credible health sources will struggle regardless of on-page optimisation.',
      },
      {
        type: 'p',
        text: 'The client\'s content was good, but it lacked E-E-A-T signals. Articles were published without author attribution. No expert review process was visible. The link profile was sparse and dominated by generic directories rather than health-specific editorial placements.',
      },
      {
        type: 'h2',
        text: 'The 12-Month Plan',
      },
      {
        type: 'h3',
        text: 'Quarter 1: Foundations',
      },
      {
        type: 'ul',
        items: [
          'Full technical SEO audit — identified 23 critical issues including crawl blocks and missing structured data',
          'Added author pages with professional credentials for all content contributors',
          'Implemented Article and Product schema across category and product pages',
          'First batch of health publication guest posts to begin authority signalling',
        ],
      },
      {
        type: 'h3',
        text: 'Quarters 2–3: Authority Build',
      },
      {
        type: 'p',
        text: 'Monthly guest posts on DR 50–75+ health, wellness, and nutrition publications. Each placement included author bylines that linked back to the site\'s expert author pages — reinforcing the E-E-A-T signal loop. Content was written by a qualified nutritionist to ensure editorial acceptance.',
      },
      {
        type: 'h3',
        text: 'Quarter 4: Consolidation',
      },
      {
        type: 'p',
        text: 'With domain authority established, the final quarter focused on pushing the highest-value commercial terms. Niche edits on aged health content accelerated ranking movement for product category keywords.',
      },
      {
        type: 'callout',
        label: 'E-E-A-T insight',
        text: 'The fastest E-E-A-T improvement came from a single change: adding credentialed author names and bios to every article. Google\'s quality systems detect this signal quickly — we saw measurable ranking improvement within 6 weeks of implementation.',
      },
      {
        type: 'h2',
        text: 'Results After 12 Months',
      },
      {
        type: 'table',
        headers: ['Metric', 'Month 1', 'Month 12', 'Change'],
        rows: [
          ['Monthly organic sessions', '33,000', '80,000', '+143%'],
          ['Domain Rating', '34', '61', '+27 points'],
          ['Referring domains', '120', '280+', '+133%'],
          ['Organic revenue contribution', 'Baseline', '+67%', 'Significant lift'],
        ],
      },
      {
        type: 'blockquote',
        text: 'We\'d been trying to crack the health keyword space for two years. Understanding that E-E-A-T wasn\'t just about content but about the whole authority signal system — expert authors, credible links, structured data — was the shift that made everything else work.',
      },
    ],
  },
  {
    id: 5,
    slug: 'automotive-keyword-rankings',
    metric: '×3.1',
    metricSub: 'Referring Domains',
    period: '8 months',
    title: 'Automotive Parts Store Ranks for 200+ Keywords',
    niche: 'Automotive',
    service: 'Guest Posting + Niche Edits',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A car parts e-commerce store had strong product catalogue SEO but only 60 referring domains. Competitors had 300–500+ RDs and were dominant across informational and commercial queries.',
    solution: 'We executed an 8-month mixed link building campaign: monthly batches of auto-niche guest posts (DR 40–65) and curated link inserts in enthusiast forums and review sites.',
    result: 'Referring domains grew from 60 to 188. 200+ previously unranked keywords entered the top 50. Category pages for "performance parts" entered page 1.',
    tags: ['Automotive', 'E-commerce', 'Guest Posts', 'Niche Edits'],
    bars: [2, 2, 3, 5, 6, 8, 10, 13, 16],
    color: '#d97706',
    stats: [
      { label: 'Referring domains', value: '60 → 188' },
      { label: 'New top-50 keywords', value: '200+' },
      { label: 'Timeline', value: '8 months' },
      { label: 'Category page rank', value: 'Page 1' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Automotive e-commerce is a category where the gap between well-linked and under-linked sites is enormous. With 60 referring domains against competitors carrying 300–500+, the client wasn\'t just behind — they were structurally invisible for everything except highly specific long-tail searches.',
      },
      {
        type: 'h2',
        text: 'Starting Point Analysis',
      },
      {
        type: 'p',
        text: 'The store had genuinely excellent product pages — detailed specs, high-quality images, and strong on-page optimisation. They ranked well for exact-match product searches (part numbers, model-specific queries) but had zero presence for informational and category-level commercial queries where competitors with strong link profiles dominated.',
      },
      {
        type: 'ul',
        items: [
          '60 referring domains vs competitor averages of 300–500+',
          'Zero rankings for informational queries ("how to choose performance parts", "best brake pads for X")',
          'Category pages for "performance parts" and "suspension upgrades" beyond page 3',
          'Strong product-level SEO with no supporting editorial authority',
        ],
      },
      {
        type: 'h2',
        text: 'Campaign Structure',
      },
      {
        type: 'h3',
        text: 'Guest Posts on Auto Publications',
      },
      {
        type: 'p',
        text: 'We targeted automotive enthusiast publications, car culture blogs, and motor sport news sites in the DR 40–65 range. Guest post content was primarily informational ("how to" guides, buying guides, comparison articles) with contextual links to the relevant category pages. This built topical authority while directing equity where it was needed.',
      },
      {
        type: 'h3',
        text: 'Niche Edits in Forum and Review Content',
      },
      {
        type: 'p',
        text: 'Automotive forums are goldmines for aged, indexed, traffic-generating content. We identified existing threads and review articles discussing the specific car models and part categories the client targeted, and inserted contextual links into those discussions.',
      },
      {
        type: 'callout',
        label: 'Tactic note',
        text: 'Forum link inserts in automotive communities outperformed equivalent DR guest posts on speed of ranking impact by approximately 2x. Aged forum content with existing topical authority transferred signals faster than fresh editorial content.',
      },
      {
        type: 'h2',
        text: 'Results After 8 Months',
      },
      {
        type: 'table',
        headers: ['Metric', 'Start', 'Month 8', 'Change'],
        rows: [
          ['Referring domains', '60', '188', '×3.1'],
          ['Top-50 keywords', '~180', '380+', '+200 keywords'],
          ['Category page position', 'Page 3+', 'Page 1', 'Full category visibility'],
          ['Informational rankings', 'None', '40+ terms', 'New traffic channel'],
        ],
      },
      {
        type: 'blockquote',
        text: 'The keyword visibility improvement was more dramatic than we expected. We\'d focused on product pages for years and never built links to categories. Once the category pages got authority, the whole site started climbing.',
      },
    ],
  },
  {
    id: 6,
    slug: 'fintech-lead-generation',
    metric: '+58%',
    metricSub: 'Qualified Leads',
    period: '5 months',
    title: 'B2B FinTech Doubles Demo Requests via SEO',
    niche: 'FinTech',
    service: 'SEO Audit + Guest Posting',
    image: 'https://images.pexels.com/photos/7567486/pexels-photo-7567486.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: "A B2B payment infrastructure company had a strong product but poor organic visibility. Their blog had 20+ articles with zero backlinks. High-intent commercial pages weren't ranking.",
    solution: 'We started with a full SEO audit to fix technical blockers, then launched a 5-month guest posting campaign on fintech and business publications (DR 55–80+) targeting solution-aware keywords.',
    result: 'Organic qualified leads increased by 58%. Demo request form completions from organic grew from 8 to 21/month. MRR impact attributed to organic: +$14k.',
    tags: ['FinTech', 'B2B', 'Lead Gen', 'SEO Audit'],
    bars: [3, 3, 4, 5, 7, 9, 11, 13, 15],
    color: '#0ea5e9',
    stats: [
      { label: 'Qualified leads', value: '+58%' },
      { label: 'Monthly demos', value: '8 → 21' },
      { label: 'Timeline', value: '5 months' },
      { label: 'MRR impact', value: '+$14k' },
    ],
    body: [
      {
        type: 'intro',
        text: 'For B2B SaaS, organic SEO is a lead quality game — not just a volume game. Demo requests from organic search convert at 3–5x the rate of paid traffic because the searcher has already done their research. This client was leaving high-intent leads on the table because their solution pages weren\'t ranking.',
      },
      {
        type: 'h2',
        text: 'The Audit First',
      },
      {
        type: 'p',
        text: 'Before any link building, we conducted a full technical and on-page audit. Two critical blockers were identified immediately: key commercial pages were accidentally noindexed from a CMS migration, and the site\'s internal linking was directing all equity toward blog posts rather than the demo and solution pages that actually convert.',
      },
      {
        type: 'ul',
        items: [
          'Several solution pages were noindexed due to a CMS migration error',
          'Internal link equity was heavily skewed toward blog content, not commercial pages',
          'Canonical tags were misconfigured on several key landing pages',
          'No structured data on solution pages — missing FAQ and SoftwareApplication schema opportunities',
        ],
      },
      {
        type: 'p',
        text: 'Fixing these issues alone produced measurable improvement before a single new link was built. The lesson: always audit before you build.',
      },
      {
        type: 'h2',
        text: 'The Link Building Campaign',
      },
      {
        type: 'p',
        text: 'With technical issues resolved, we launched a 5-month guest posting campaign targeting FinTech publications, business operations blogs, and payment industry resources in the DR 55–80+ range. Every placement was specifically anchored to the solution and demo pages — not the homepage or blog.',
      },
      {
        type: 'h3',
        text: 'Publication Targeting',
      },
      {
        type: 'p',
        text: 'We focused on publications read by the client\'s exact buyer persona: finance operators, payment team leads, and CTOs at mid-market businesses. Domain authority was secondary to audience fit — a DR 55 site read by payment professionals was worth more than a DR 75 general tech blog.',
      },
      {
        type: 'callout',
        label: 'B2B insight',
        text: 'For B2B lead generation, the quality of the audience on the linking site matters as much as the domain authority. Links from publications your buyers read drive referral visits that have genuine conversion intent.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'table',
        headers: ['Metric', 'Before', 'Month 5', 'Change'],
        rows: [
          ['Monthly organic qualified leads', 'Baseline', '+58%', 'Significant uplift'],
          ['Demo form completions (organic)', '8/mo', '21/mo', '+163%'],
          ['MRR from organic', 'Baseline', '+$14,000', '+$14k MRR'],
          ['Solution pages in top 10', '1', '4', '+3 pages'],
        ],
      },
      {
        type: 'blockquote',
        text: 'The audit findings were eye-opening — we had no idea our solution pages were being excluded from Google\'s index. The combination of technical fixes and link building produced results much faster than a link-only campaign would have.',
      },
    ],
  },
  {
    id: 7,
    slug: 'igaming-20k-traffic',
    metric: '+19,900%',
    metricSub: 'Organic Traffic',
    period: '2 years',
    title: 'iGaming Site Grows from 100 to 20,000+ Monthly Visitors',
    niche: 'iGaming',
    service: 'Guest Posting + Crowd Marketing + Niche Edits',
    image: 'https://images.pexels.com/photos/6801874/pexels-photo-6801874.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: "A brand-new iGaming project targeting the competitive UK market had an extremely low-authority domain compared to established competitors, limiting rankings for all commercial keywords.",
    solution: "We worked closely with the client's in-house SEO team to build 2,000+ high-quality links over 2 years. Starting small and scaling volume by ~15% each month ensured natural growth for a new domain. Every placement was 100% manual — no automation.",
    result: 'Monthly organic visitors grew from 100 to 20,000+. 500+ keywords entered Google Top 3. Referring domain count grew steadily month over month throughout the campaign.',
    tags: ['iGaming', 'UK Market', 'Scalable Growth', 'Manual Placements'],
    bars: [1, 2, 3, 4, 6, 8, 11, 15, 20],
    color: '#059669',
    stats: [
      { label: 'Traffic growth', value: '100 → 20k+' },
      { label: 'Links built', value: '2,000+' },
      { label: 'Timeline', value: '>2 years' },
      { label: 'Top-3 keywords', value: '500+' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Building a new iGaming brand in the UK market from zero is one of the hardest challenges in SEO. The UK gambling vertical has some of the most established, heavily-funded competitors on the internet. Two years and 2,000+ links later, this client went from 100 monthly visitors to 20,000+.',
      },
      {
        type: 'h2',
        text: 'The Challenge of Starting from Zero',
      },
      {
        type: 'p',
        text: 'A brand-new domain has no trust, no history, and no authority. Google is conservative about ranking new domains for competitive queries — particularly in YMYL categories like gambling. The growth strategy had to be calibrated for the specific constraints of a new domain, not the tactics that work for an established site.',
      },
      {
        type: 'ul',
        items: [
          'Zero domain history — Google treats new gambling domains with significant scepticism',
          'UK iGaming competitors have 5–15 years of accumulated authority and thousands of referring domains',
          'Commercial keywords require DR 50+ minimum to appear on page 1 in most cases',
          'Any unnatural link velocity on a new domain triggers algorithmic scrutiny',
        ],
      },
      {
        type: 'h2',
        text: 'The Strategy: Slow and Sustainable',
      },
      {
        type: 'p',
        text: 'We worked directly with the client\'s in-house SEO specialist to align strategy at every stage. The core principle was patience — building authority gradually in a way that would pass algorithmic scrutiny and compound over time.',
      },
      {
        type: 'table',
        headers: ['Phase', 'Timeline', 'Monthly Links', 'Focus'],
        rows: [
          ['Foundation', 'Months 1–4', '8–12', 'Brand signals, low-risk placements'],
          ['Growth', 'Months 5–12', '15–20', 'iGaming publications, forum links'],
          ['Acceleration', 'Months 13–18', '22–30', 'Guest posts + niche edits'],
          ['Consolidation', 'Months 19–24', '25–35', 'High-DR placements, anchor refinement'],
        ],
      },
      {
        type: 'h3',
        text: '100% Manual Placements',
      },
      {
        type: 'p',
        text: 'Every single link was manually placed — no automated tools, no PBN, no link farms. In the iGaming space especially, Google\'s spam detection is aggressive. The commitment to quality over volume was non-negotiable.',
      },
      {
        type: 'callout',
        label: 'Key principle',
        text: 'New domains need a lower initial velocity and a longer build timeline than established sites. The 15% monthly growth rule kept the profile looking natural throughout — no spikes, no plateaus, just consistent upward progress.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: 'The growth curve followed a characteristic SEO pattern: slow initial movement, a tipping point around month 10 where authority had accumulated sufficiently, then accelerating growth as rankings for competitive terms began materialising.',
      },
      {
        type: 'blockquote',
        text: 'The patience required was the hardest part for our team. For the first six months, results were modest. By month 12, we were seeing real movement. By month 24, we had a genuinely competitive site in one of the toughest niches online.',
      },
    ],
  },
  {
    id: 8,
    slug: 'dating-5x-traffic',
    metric: '×5',
    metricSub: 'Organic Traffic',
    period: '5 months',
    title: '5x Traffic Growth for a Dating Niche Website',
    niche: 'Dating',
    service: 'Niche Edits',
    image: 'https://images.pexels.com/photos/4064178/pexels-photo-4064178.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A dating website with 130k monthly visitors needed to break through in a highly competitive and sensitive niche. Standard outreach was largely ineffective — most publications rejected gambling-adjacent and dating content.',
    solution: 'We designed a niche edits campaign targeting DR 30+ domains with 1k+ monthly traffic. We started conservatively with 5 links in July, scaling systematically — 5 → 15 → 20 → 30 → 40 links per month — to maintain natural link velocity over 5 months.',
    result: 'Traffic surged from 130k to 690k monthly visitors — a fivefold increase. Keywords grew by 35%. Total investment: $5,500 for 110 placed links.',
    tags: ['Dating', 'Niche Edits', 'Traffic Growth', 'Scaled Campaign'],
    bars: [2, 3, 4, 7, 9, 12, 15, 17, 20],
    color: '#e11d48',
    stats: [
      { label: 'Traffic', value: '130k → 690k' },
      { label: 'Links placed', value: '110' },
      { label: 'Timeline', value: '5 months' },
      { label: 'Keyword growth', value: '+35%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Dating is a niche that most link builders find frustrating — similar editorial gatekeeping to gambling, limited niche-specific publication options, and intense competition for traffic. The solution here was niche edits at scale, deployed with careful velocity control.',
      },
      {
        type: 'h2',
        text: 'Why Niche Edits for Dating',
      },
      {
        type: 'p',
        text: 'Guest posting for dating content is difficult. Publications with genuine editorial standards often have blanket policies against dating, relationship, or adult-adjacent content. The rejection rate for outreach campaigns exceeds 80% in this category. Niche edits solve this by working with existing content rather than pitching new articles — the placement is about a relevant link insertion, not a whole new content relationship.',
      },
      {
        type: 'h2',
        text: 'The Velocity-Controlled Approach',
      },
      {
        type: 'p',
        text: 'The client already had significant traffic (130k/mo), which meant the domain had some established authority. The risk of over-accelerating was real — a sudden spike in new links would look unnatural. We designed a scaled ramp that grew link volume month by month.',
      },
      {
        type: 'table',
        headers: ['Month', 'Links Placed', 'Cumulative', 'Budget'],
        rows: [
          ['July', '5', '5', '$250'],
          ['August', '15', '20', '$750'],
          ['September', '20', '40', '$1,000'],
          ['October', '30', '70', '$1,500'],
          ['November', '40', '110', '$2,000'],
        ],
      },
      {
        type: 'h2',
        text: 'Placement Quality Standards',
      },
      {
        type: 'ul',
        items: [
          'DR 30+ minimum on all placement domains',
          'Minimum 1,000 monthly organic visits to the linking domain',
          'Average price per link: $50',
          'Only dofollow placements in contextually relevant content',
          'No link farms, PBNs, or footer/sidebar placements',
        ],
      },
      {
        type: 'callout',
        label: 'Results insight',
        text: 'The traffic multiplier effect in this campaign was unusually high (5x in 5 months) because the domain already had solid on-page SEO — many pages were ranking on page 2 and needed only marginal authority improvement to enter page 1 and capture significantly more clicks.',
      },
      {
        type: 'h2',
        text: 'Final Results',
      },
      {
        type: 'p',
        text: 'Traffic went from 130,000 to 690,000 monthly visitors. Keywords grew by 35%. The total campaign investment was $5,500 for 110 placed links — an ROI that reflects the efficiency of targeting near-page-1 opportunities with targeted niche edit placements.',
      },
      {
        type: 'blockquote',
        text: 'We\'d tried buying links before with mixed results. The difference here was the quality of the placements and the controlled scaling — it looked like natural growth because it was designed to look that way.',
      },
    ],
  },
  {
    id: 9,
    slug: 'crypto-forum-x10-traffic',
    metric: '×10',
    metricSub: 'Organic Traffic',
    period: '1.5 years',
    title: 'Forum Link Building Delivers 10x Traffic for Crypto Project',
    niche: 'Crypto',
    service: 'Forum Backlinks',
    image: 'https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A blockchain nodes website in the cryptocurrency niche needed to improve organic visibility and keyword rankings with a lean budget. The topic was deep and technical — blockchain node infrastructure — which limited placement options.',
    solution: 'Starting in September 2022, we placed 15 forum backlinks per month in niche-relevant threads. Each placement was a manually written comment of 300+ characters organically fitting the thread. Volume was increased by 5–10% each month. The client combined forum links with niche edits and guest posts for a diversified profile.',
    result: 'Traffic grew from 600 to 9,000+ monthly visitors — a 10x increase over 1.5 years. Keywords increased by ~60%. Domain Rating and referring domains also grew steadily. Total spend: $3,500 for 585 placed links at $6/link.',
    tags: ['Crypto', 'Blockchain', 'Forum Links', 'Long-Term Growth'],
    bars: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    color: '#7c3aed',
    stats: [
      { label: 'Traffic', value: '600 → 9k+' },
      { label: 'Links placed', value: '585' },
      { label: 'Timeline', value: '1.5 years' },
      { label: 'Keyword growth', value: '+60%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Blockchain node infrastructure is a niche within a niche. The technical specificity limited placement options but also meant competition was less fierce than general crypto terms. A consistent forum link strategy, combined with a modest budget, delivered 10x traffic growth over 18 months.',
      },
      {
        type: 'h2',
        text: 'About the Niche',
      },
      {
        type: 'p',
        text: 'Blockchain nodes are the technical backbone of cryptocurrency networks — they validate transactions, maintain copies of the blockchain, and enable the core functions of decentralised systems. This is a highly technical topic with a dedicated but specialised audience of developers, node operators, and crypto infrastructure professionals.',
      },
      {
        type: 'h2',
        text: 'Why Forum Links Were the Right Tool',
      },
      {
        type: 'p',
        text: 'For a technical crypto topic, forums and developer communities are where the real audience lives. Bitcointalk, crypto-specific subreddits, Stack Exchange, and specialist blockchain developer forums all have genuine audiences actively discussing node infrastructure. Link placements in these communities deliver both SEO signals and direct referral traffic from highly qualified visitors.',
      },
      {
        type: 'ul',
        items: [
          'Cost-effective at $6/link — suitable for a budget-conscious long-term campaign',
          'Forum domains often have high DR and genuine organic traffic',
          'Technical discussions naturally accommodate links to external resources',
          'Community validation of the content improves click-through on placed links',
        ],
      },
      {
        type: 'h2',
        text: 'Execution Details',
      },
      {
        type: 'p',
        text: 'We placed links only in threads specifically discussing blockchain nodes, validator setup, or related infrastructure topics. Every comment was at least 300 characters and genuinely contributed to the discussion. Placements were distributed over 10–14 days each month to avoid unnatural velocity patterns.',
      },
      {
        type: 'table',
        headers: ['Period', 'Monthly Links', 'Cumulative', 'Monthly Spend'],
        rows: [
          ['Month 1–3', '15', '45', '$90'],
          ['Month 4–9', '16–20', '~145', '$96–120'],
          ['Month 10–14', '20–25', '~370', '$120–150'],
          ['Month 15–18', '25–30', '585', '$150–180'],
        ],
      },
      {
        type: 'callout',
        label: 'Important context',
        text: 'Forum links alone were not the full picture. The client used forum placements as the base layer of a broader strategy that included niche edits and guest posts. The combination of link types is what produced the 10x result — forum links as diversification, editorial links as authority builders.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: 'Over 18 months, traffic grew from 600 to 9,000+ monthly visitors. Keywords increased by 60%. The gradual, consistent approach produced compounding growth — slow initially, then accelerating as accumulated authority hit ranking thresholds for more competitive terms.',
      },
      {
        type: 'blockquote',
        text: 'The budget constraints actually forced us into a better strategy. The drip-feed approach looked completely natural, and the forum placements in developer communities drove genuine referral traffic from people who actually wanted to read our content.',
      },
    ],
  },
  {
    id: 10,
    slug: 'software-263-traffic',
    metric: '+263%',
    metricSub: 'Organic Traffic',
    period: '6 months',
    title: 'Password Management Software Achieves 263% Traffic Growth',
    niche: 'Software',
    service: 'Forum Backlinks + Niche Edits + Q&A',
    image: 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A password management software site had a basic link profile with 804 referring domains. It needed stronger rankings for competitive keywords in English-speaking markets (US, UK, Canada) with a controlled monthly budget.',
    solution: 'We implemented a $500/month mixed link building strategy targeting 10–15% monthly backlink growth. The mix included forum backlinks, niche edits/outreach, and Q&A posts. We evaluated placements by traffic, keyword count, and US-audience presence — not just DR. Each monthly campaign ran over 25 days with balanced distribution.',
    result: '400+ backlinks placed across diverse platforms in 6 months. Keywords grew by 25% with many entering top positions. Organic traffic increased by 263%. Referring domains and overall authority grew steadily throughout.',
    tags: ['Software', 'SaaS', 'Mixed Strategy', 'English Markets'],
    bars: [3, 4, 5, 7, 9, 11, 14, 17, 20],
    color: '#0284c7',
    stats: [
      { label: 'Traffic growth', value: '+263%' },
      { label: 'Links placed', value: '400+' },
      { label: 'Monthly budget', value: '$500/mo' },
      { label: 'Keyword growth', value: '+25%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Password management is a crowded software category dominated by major players with years of accumulated SEO authority. Breaking through at $500/month requires maximum efficiency — every link has to pull its weight. A mixed strategy across three link types delivered 263% traffic growth in 6 months.',
      },
      {
        type: 'h2',
        text: 'The Starting Position',
      },
      {
        type: 'p',
        text: 'The site wasn\'t starting from zero — 804 referring domains is a respectable foundation. The issue was stagnation: the profile had stopped growing, rankings for competitive keywords like "best password manager for teams" and "enterprise password security" were flat, and the site was losing ground to competitors that were actively building.',
      },
      {
        type: 'h2',
        text: 'The $500/Month Mixed Strategy',
      },
      {
        type: 'p',
        text: 'We split the monthly budget across three link types to ensure both quality coverage and profile diversification. The allocation shifted slightly month by month based on what was delivering the best results for the specific keyword targets.',
      },
      {
        type: 'table',
        headers: ['Link Type', 'Monthly Volume', 'Approx. Cost', 'Primary Goal'],
        rows: [
          ['Forum backlinks', '20–25', '$120–150', 'Profile diversity, referring domains'],
          ['Niche edits', '8–10', '$200–240', 'Page-level authority for target pages'],
          ['Q&A (Quora/Reddit)', '8–12', '$80–110', 'Topical authority + referral traffic'],
        ],
      },
      {
        type: 'h3',
        text: 'Evaluation Criteria Beyond DR',
      },
      {
        type: 'p',
        text: 'We didn\'t use Domain Rating as the primary placement quality metric. For a software product targeting US, UK, and Canadian users, what mattered more was whether the linking domain had genuine organic traffic from those markets, how many keywords it ranked for (indicating real editorial content), and whether the page content was topically relevant to security and productivity software.',
      },
      {
        type: 'callout',
        label: 'Placement standard',
        text: 'Every placement was evaluated using Ahrefs traffic data, SimilarWeb audience geography, and manual content review. DR was a secondary filter, not the primary one.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: '400+ links placed across diverse domains over 6 months. Organic traffic grew by 263%. 25% more keywords entered rankings with many climbing into top positions for competitive software terms. The total spend was $3,000 — an efficient campaign for a highly competitive vertical.',
      },
      {
        type: 'blockquote',
        text: 'The diversified approach was key. We\'d previously focused only on guest posts and seen slow results. Adding forum links and Q&A placements changed the velocity — and the cost per link improvement was significant.',
      },
    ],
  },
  {
    id: 11,
    slug: 'health-google-update-recovery',
    metric: '+150',
    metricSub: 'Forum Links',
    period: '3 months',
    title: 'Health Site Recovers After Google Core Update with Forum Links',
    niche: 'Health',
    service: 'Forum Backlinks',
    image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'After the volatile Google Core Update of April 2024, a health website focused on olive oil experienced a significant drop in keyword visibility and traffic. The client needed a low-cost solution to stabilise and recover their rankings.',
    solution: 'We recommended forum backlinks as a cost-effective way to diversify the link profile, add natural citations, and strengthen keyword signals. We placed 50 unique forum links per month over 3 months — each written as a genuine 300+ character comment in a health-relevant thread. Steady drip placement was prioritised to appear organic.',
    result: 'After 3–4 months of consistent placement, the site showed increased Google impressions, growth in referring domains, improved keyword visibility, and recovering traffic. Total spend: $900 for 150 forum links at $6/link.',
    tags: ['Health', 'Google Recovery', 'Forum Links', 'Low Budget'],
    bars: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    color: '#16a34a',
    stats: [
      { label: 'Links placed', value: '150' },
      { label: 'Budget', value: '$900' },
      { label: 'Timeline', value: '3 months' },
      { label: 'Cost per link', value: '$6' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Google\'s April 2024 Core Update was one of the most volatile in recent history. Many legitimate health and lifestyle sites saw significant ranking drops — not due to spam, but due to shifts in how Google evaluated E-E-A-T and content quality signals. Forum links provided a low-cost stabilisation mechanism during the recovery period.',
      },
      {
        type: 'h2',
        text: 'Understanding the Post-Update Situation',
      },
      {
        type: 'p',
        text: 'The client\'s site covered olive oil — health benefits, recipes, buying guides, and producer reviews. Before the update, it had been growing steadily. The April 2024 update hit it with a 35–40% traffic decline. The content itself hadn\'t changed; Google\'s evaluation of it had.',
      },
      {
        type: 'p',
        text: 'Post-update analysis suggested the primary issue was a thin referring domain profile — the site had good content but limited third-party citations. Google\'s updated quality assessment was placing more weight on external signals confirming the site\'s credibility in its topic area.',
      },
      {
        type: 'h2',
        text: 'Why Forum Links for Recovery',
      },
      {
        type: 'ul',
        items: [
          'Cost-effective at $6/link — recovery budgets are often constrained',
          'Rapidly adds unique referring domains from indexed, real-traffic platforms',
          'Natural-looking drip placement is aligned with how real communities link to content',
          'Relevant health and food forums provide genuine topical authority signals',
          'No risk of triggering manual actions if done correctly — forum links are an accepted practice',
        ],
      },
      {
        type: 'h2',
        text: 'Campaign Execution',
      },
      {
        type: 'p',
        text: 'We placed 50 forum backlinks per month across health, nutrition, cooking, and Mediterranean diet communities. Every comment was written to genuinely add value to the discussion — at least 300 characters, directly relevant to the thread topic, with the link appearing naturally as a resource recommendation rather than a promotional insert.',
      },
      {
        type: 'callout',
        label: 'Consistency over volume',
        text: 'The client initially wanted to accelerate the pace to recover faster. We advised against it — a sudden spike in new links post-update would likely look manipulative to Google\'s systems. Steady 50/month over 3 months is what an organically growing site looks like.',
      },
      {
        type: 'h2',
        text: 'Results',
      },
      {
        type: 'p',
        text: 'After 3 months of placement and a 4th month of observation, measurable improvements were visible across all tracked metrics: Google Search Console impressions increased, referring domain count grew from the additions, keyword positions for core terms improved, and overall traffic began recovering. Full recovery projections were on track by month 5.',
      },
      {
        type: 'table',
        headers: ['Metric', 'Post-Update Low', 'Month 4', 'Direction'],
        rows: [
          ['GSC impressions', 'Significant drop', 'Recovering', 'Upward trend'],
          ['Referring domains', 'Stagnant', '+150 new domains', 'Growth'],
          ['Keyword visibility', 'Dropped ~35%', 'Partial recovery', 'Improving'],
          ['Organic traffic', 'Dropped ~35–40%', 'Recovering', 'Upward trend'],
        ],
      },
      {
        type: 'blockquote',
        text: 'The update was brutal and we weren\'t sure where to start. Forum links felt almost too simple a solution — but the referring domain growth was exactly what the profile needed. It gave Google more third-party signals that the content was legitimate.',
      },
    ],
  },
];

export const niches = ['All', 'iGaming', 'SaaS', 'Crypto', 'Health', 'Automotive', 'FinTech', 'Dating', 'Software'] as const;
