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
    service: 'Guest Posting + Link Insertions',
    image: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A competitive casino portal stuck at DR 28 with minimal backlink diversity. Organic traffic had plateaued despite strong on-page SEO.',
    solution: 'We built a structured 9-month link acquisition campaign focused on DR 60–80+ domains in the iGaming and affiliate verticals. A mix of editorial guest posts and aged content inserts created a natural, diverse link profile.',
    result: 'DR rose from 28 to 54. Referring domains grew from 140 to 440+. Top 5 money pages moved from page 3–4 to page 1.',
    tags: ['iGaming', 'DR 60–80', 'Guest Posting', 'Link Insertions'],
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
    service: 'Link Insertions',
    image: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A key landing page for a high-volume crypto keyword was stuck on page 2, position 14. The domain had sufficient authority but the page lacked contextual link equity.',
    solution: 'We identified 12 aged, indexed pages in finance and crypto niches with existing topical authority. Contextual link insertions with exact-match and phrase-match anchors were placed within 2 weeks.',
    result: 'The page moved from position 14 to position 4 within 45 days. Estimated organic value of the keyword: $8,000+/month.',
    tags: ['Crypto', 'Finance', 'Link Insertions', 'Rapid Results'],
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
    service: 'Guest Posting + Link Insertions',
    image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A car parts e-commerce store had strong product catalogue SEO but only 60 referring domains. Competitors had 300–500+ RDs and were dominant across informational and commercial queries.',
    solution: 'We executed an 8-month mixed link building campaign: monthly batches of auto-niche guest posts (DR 40–65) and curated link inserts in enthusiast forums and review sites.',
    result: 'Referring domains grew from 60 to 188. 200+ previously unranked keywords entered the top 50. Category pages for "performance parts" entered page 1.',
    tags: ['Automotive', 'E-commerce', 'Guest Posts', 'Link Insertions'],
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
    service: 'Guest Posting + Crowd Marketing + Link Insertions',
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
    service: 'Link Insertions',
    image: 'https://images.pexels.com/photos/4064178/pexels-photo-4064178.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop',
    challenge: 'A dating website with 130k monthly visitors needed to break through in a highly competitive and sensitive niche. Standard outreach was largely ineffective — most publications rejected gambling-adjacent and dating content.',
    solution: 'We designed a niche edits campaign targeting DR 30+ domains with 1k+ monthly traffic. We started conservatively with 5 links in July, scaling systematically — 5 → 15 → 20 → 30 → 40 links per month — to maintain natural link velocity over 5 months.',
    result: 'Traffic surged from 130k to 690k monthly visitors — a fivefold increase. Keywords grew by 35%. Total investment: $5,500 for 110 placed links.',
    tags: ['Dating', 'Link Insertions', 'Traffic Growth', 'Scaled Campaign'],
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
    service: 'Forum Links + Link Insertions + Q&A',
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

export const casesUk: Record<string, Partial<CaseStudy>> = {
  'igaming-domain-authority': {
    title: 'Підвищення авторитету домену для iGaming-порталу',
    niche: 'iGaming',
    service: 'Гостьові публікації + розміщення посилань',
    challenge: 'Конкурентний казино-портал застряг на DR 28 із мінімальною різноманітністю беклінків. Органічний трафік вийшов на плато, незважаючи на сильний on-page SEO.',
    solution: 'Ми розробили структуровану 9-місячну кампанію з нарощування посилань, орієнтовану на домени DR 60–80+ у вертикалях iGaming та партнерського маркетингу. Поєднання редакційних гостьових публікацій та вставок у віковий контент створило природний, різноманітний профіль посилань.',
    result: 'DR зріс із 28 до 54. Домени, що посилаються, зросли з 140 до 440+. Топ-5 комерційних сторінок піднялися з 3–4 сторінки на 1-шу.',
    tags: ['iGaming', 'DR 60–80', 'Гостьові публікації', 'Розміщення посилань'],
    metricSub: 'Домени, що посилаються',
    period: '9 місяців',
    stats: [
      { label: 'Зростання DR', value: '28 → 54' },
      { label: 'Домени, що посилаються', value: '+300' },
      { label: 'Термін', value: '9 місяців' },
      { label: 'Сторінки в топі', value: '7 на 1 сторінці' },
    ],
    body: [
      {
        type: 'intro',
        text: 'SEO у сфері казино та азартних ігор — один із найконкурентніших вертикалей в інтернеті. Конкуренти мають значні бюджети, авторитетні домени та роки накопиченого посилального капіталу. Щоб подолати бар\'єр DR 28, потрібна була методична стратегія з довгим горизонтом планування — а не швидкі рішення.',
      },
      {
        type: 'h2',
        text: 'Ситуація до нашої роботи',
      },
      {
        type: 'p',
        text: 'Клієт керував казино-порталом, що охоплював огляди ігор, порівняння бонусів та рейтинги операторів. On-page SEO було на висоті — контент був вичерпним, метадані оптимізовані, внутрішнє перелінкування структуроване. Проблема полягала в авторитеті. За DR 28 і лише 140 доменів, що посилаються, у них просто не вистачало ваги домену, щоб конкурувати за комерційні ключові слова, де домінували конкуренти з DR 60–80+.',
      },
      {
        type: 'ul',
        items: [
          'DR 28 — значно нижче за топ-конкурентів (DR 55–75)',
          '140 доменів, що посилаються, з обмеженою тематичною різноманітністю',
          'Комерційні сторінки застрягли на 3–4 сторінці, незважаючи на хороші on-page сигнали',
          'Жодної систематичної стратегії нарощування посилань',
        ],
      },
      {
        type: 'h2',
        text: 'Наш підхід',
      },
      {
        type: 'h3',
        text: 'Фаза 1: Фундамент (Місяці 1–3)',
      },
      {
        type: 'p',
        text: 'Ми розпочали з ретельного аудиту існуючого профілю беклінків, щоб виявити прогалини та токсичні патерни. Перші три місяці були зосереджені на побудові базового авторитету через редакційні гостьові публікації на iGaming-орієнтованих майданчиках — сайтах, які Google вже асоціює з гемблінг-вертикаллю.',
      },
      {
        type: 'h3',
        text: 'Фаза 2: Нарощування темпу (Місяці 4–7)',
      },
      {
        type: 'p',
        text: 'Коли фундамент було закладено, ми прискорили темп розміщень. Ми націлилися на домени DR 60–80 у сферах iGaming, партнерського маркетингу та суміжних фінансових нішах. Вставки посилань у віковий проіндексований контент забезпечили швидше передавання посилального капіталу, ніж лише свіжі гостьові публікації.',
      },
      {
        type: 'h3',
        text: 'Фаза 3: Закріплення (Місяці 8–9)',
      },
      {
        type: 'p',
        text: 'Фінальна фаза була зосереджена на підсиленні найцінніших комерційних сторінок. Ми виявили конкретні ключові слова, що були в межах досяжності 1-ї сторінки, та спрямували додатковий посилальний капітал безпосередньо на ці сторінки.',
      },
      {
        type: 'table',
        headers: ['Місяць', 'Активність', 'Діапазон DR', 'Обсяг'],
        rows: [
          ['1–2', 'Аудит + фундаментальні гостьові публікації', 'DR 40–60', '8–10 посилань'],
          ['3–5', 'Гостьові публікації + розміщення посилань', 'DR 55–75', '12–15 посилань'],
          ['6–8', 'Розміщення посилань + високий DR', 'DR 65–80', '15–18 посилань'],
          ['9', 'Цільове закріплення', 'DR 60–80', '10 посилань'],
        ],
      },
      {
        type: 'h2',
        text: 'Стратегія анкорів',
      },
      {
        type: 'p',
        text: 'Анкор-профілі в iGaming вимагають надзвичайної обережності. Анкори з точним збігом для термінів на кшталт "найкраще онлайн-казино" швидко викликають прапорці перенасичення. Наш розподіл анкорів був розроблений з пріоритетом безпеки на весь 9-місячний період.',
      },
      {
        type: 'table',
        headers: ['Тип анкора', 'Цільовий %', 'Обґрунтування'],
        rows: [
          ['Бренд / URL', '45%', 'Безпечна база, будує розпізнавання сутності'],
          ['Брендовий частковий збіг', '25%', 'Природна варіація брендових термінів'],
          ['Загальний / навігаційний', '18%', '"відвідайте тут", "дізнайтеся більше", "перегляньте"'],
          ['Тематичний фразовий збіг', '9%', '"ігри казино", "гід онлайн-слотів"'],
          ['Точний збіг', '<3%', 'Суворо обмежено, щоб уникнути перенасичення'],
        ],
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: 'За 9 місяців авторитет домену трансформувався із гравця середнього рівня у довіреного конкурента в iGaming-просторі. Кількість доменів, що посилаються, потроїлась, а якість цих доменів значно зросла — від опортуністичних розміщень до редакційних посилань на визнаних iGaming-майданчиках.',
      },
      {
        type: 'callout',
        label: 'Ключовий результат',
        text: 'Domain Rating зріс із 28 до 54. Здобуто 300 нових доменів, що посилаються. 7 топових комерційних сторінок піднялися з 3–4 сторінки на 1-шу. Усе зростання було стабільним — жодних алгоритмічних штрафів чи відкатів трафіку.',
      },
      {
        type: 'blockquote',
        text: 'Ми раніше намагалися будувати посилання власними силами і щоразу натикалися на стіну. Якість розміщень і послідовність стратегії стали вирішальними — було очевидно, що це робила команда, яка знає саме iGaming-сферу.',
      },
    ],
  },
  'saas-non-brand-traffic': {
    title: 'Зростання небрендового трафіку для SaaS-платформи',
    niche: 'SaaS',
    service: 'Крауд-маркетинг + гостьові публікації',
    challenge: 'B2B SaaS-інструмент мав чудові позиції головної сторінки, але майже нульову видимість за небрендовими ключовими словами. Сторінки категорій не ранжувалися, незважаючи на хороший контент.',
    solution: 'Ми поєднали крауд-маркетингову кампанію на 30+ технічних форумах із цільовими гостьовими публікаціями, прив\'язаними до ключових слів рівня категорій. Розподіл анкорів був ретельно спланований, щоб уникнути перенасичення.',
    result: 'Небрендові органічні сесії зросли на 40% за 6 місяців. 3 сторінки категорій увійшли в топ-5 за конкурентними головними термінами. Реєстрації тріалу з органіки зросли на 22%.',
    tags: ['SaaS', 'B2B Tech', 'Крауд-маркетинг', 'Сторінки категорій'],
    metricSub: 'Небрендовий трафік',
    period: '6 місяців',
    stats: [
      { label: 'Небрендовий трафік', value: '+40%' },
      { label: 'Топ-5 позицій', value: '+3 сторінки' },
      { label: 'Термін', value: '6 місяців' },
      { label: 'Органічні реєстрації тріалу', value: '+22%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Класична пастка SaaS SEO: сильна присутність бренду маскує повністю порожній небрендовий ключовий слід. Продукт був справді хорошим, головна сторінка добре ранжувалася за брендовими термінами — але сторінки категорій, які мали б приносити реєстрації тріалу від людей, які ще не чули про компанію, були невидимі.',
      },
      {
        type: 'h2',
        text: 'Проблема ранжування лише за брендом',
      },
      {
        type: 'p',
        text: 'Коли SaaS-компанія ранжується лише за власною назвою бренду, органічний пошук працює як підказка для пам\'яті — а не як канал залучення. Справжня цінність SEO для SaaS полягає у захопленні шукачів на стадії прийняття рішення, які шукають рішення у вашій категорії, але ще не знають про вас.',
      },
      {
        type: 'p',
        text: 'Сторінки категорій цього клієнта — орієнтовані на терміни на кшталт "програмне забезпечення для управління проєктами", "інструмент командної співпраці" та "додаток для відстеження завдань" — не мали жодних зовнішніх беклінків. Увесь посилальний капітал був зосереджений на головній сторінці.',
      },
      {
        type: 'h2',
        text: 'Стратегія',
      },
      {
        type: 'h3',
        text: 'Крауд-маркетинг для обізнаності та різноманітності',
      },
      {
        type: 'p',
        text: 'Ми провели крауд-маркетингову кампанію на 30+ технічно орієнтованих форумах, сабредітах та Q&A-спільнотах. Мета була подвійною: побудувати різноманітний профіль доменів, що посилаються, який виглядав би органічним, та згенерувати прямий реферальний трафік із активних технічних спільнот.',
      },
      {
        type: 'ul',
        items: [
          'Відібрали майданчики зі справжньою технічною аудиторією та перевіреною індексацією',
          'Дотримувалися реалістичних співвідношень публікацій — максимум 1 посилання на 12–15 постів з одного акаунта',
          'Сильно варіювали анкор-текст — переважно брендові та частково збіжні терміни',
          'Націлилися на треди, де продукт був справді релевантною рекомендацією',
        ],
      },
      {
        type: 'h3',
        text: 'Гостьові публікації, прив\'язані до сторінок категорій',
      },
      {
        type: 'p',
        text: 'Одночасно ми запустили кампанію гостьових публікацій, спеціально розроблену для спрямування посилального капіталу на сторінки категорій — а не на головну сторінку. Це вимагало пошуку розміщень на майданчиках, що охоплюють програмне забезпечення, продуктивність та B2B-інструменти, і створення контенту з природними in-content посиланнями на сторінки категорій клієнта.',
      },
      {
        type: 'callout',
        label: 'Ключова тактика',
        text: 'Кожна гостьова публікація планувалася з призначенням сторінки на увазі спочатку — а не з майданчиком розміщення. Це перевернуло типовий процес гостьових публікацій і гарантувало, що всі розміщення безпосередньо служили комерційним цілям ранжування.',
      },
      {
        type: 'h2',
        text: 'Результати за 6 місяців',
      },
      {
        type: 'table',
        headers: ['Показник', 'До', 'Після', 'Зміна'],
        rows: [
          ['Небрендові органічні сесії', 'Базовий', '+40%', '+40%'],
          ['Сторінки категорій у топ-5', '0', '3', '+3'],
          ['Органічні реєстрації тріалу', 'Базовий', '+22%', '+22%'],
          ['Домени, що посилаються', '85', '180+', '+112%'],
        ],
      },
      {
        type: 'blockquote',
        text: 'У нас був чудовий контент на сторінках категорій, але вони просто не ранжувалися. За 4 місяці після старту кампанії ми побачили реальний рух — і реєстрації тріалу з органіки стали значною частиною нашого зростання.',
      },
    ],
  },
  'crypto-page1-ranking': {
    title: 'Швидкий вихід на 1-шу сторінку для криптобіржі',
    niche: 'Криптовалют',
    service: 'Розміщення посилань',
    challenge: 'Ключова цільова сторінка за високочастотним крипто-ключовим словом застрягла на 2-й сторінці, позиція 14. Домен мав достатній авторитет, але сторінці бракувало контекстного посилального капіталу.',
    solution: 'Ми виявили 12 вікових, проіндексованих сторінок у фінансових та крипто-нішах з існуючим тематичним авторитетом. Контекстні вставки посилань з анкорами точного та фразового збігу були розміщені протягом 2 тижнів.',
    result: 'Сторінка піднялася з позиції 14 до позиції 4 за 45 днів. Оціночна органічна вартість ключового слова: $8,000+/місяць.',
    tags: ['Криптовалют', 'Фінанси', 'Розміщення посилань', 'Швидкі результати'],
    metricSub: 'Рейтинг Google',
    period: '45 днів',
    stats: [
      { label: 'Зміна позиції', value: '14 → 4' },
      { label: 'Розміщених посилань', value: '12 вставок' },
      { label: 'Термін', value: '45 днів' },
      { label: 'Оцінка вартості ключового слова', value: '$8k/міс' },
    ],
    body: [
      {
        type: 'intro',
        text: '2-га сторінка, позиція 14. Розчаровуюче місце для цінного крипто-ключового слова. Домен мав авторитет, контент був якісним, конкуренти на 1-й сторінці не були значно сильнішими. Проблема була в одному факторі: конкретна цільова сторінка мала майже жодних зовнішніх посилань, спрямованих безпосередньо на неї.',
      },
      {
        type: 'h2',
        text: 'Діагностика проблеми',
      },
      {
        type: 'p',
        text: 'Детальний аналіз посилальних прогалин порівняв сторінку клієнта з топ-10 сторінками, що ранжуються. DR домену був конкурентоспроможним, але метрики посилань на рівні сторінок розповіли іншу історію — конкуренти на 1-й сторінці мали 15–30 контекстних посилань на свої конкретні сторінки. Сторінка клієнта мала лише 2.',
      },
      {
        type: 'p',
        text: 'Це чистий випадок використання розміщення посилань: сильний домен, слабкий капітал на рівні сторінки. Цільова кампанія вставок, а не широке нарощування авторитету, була правильним підходом.',
      },
      {
        type: 'h2',
        text: 'Пошук правильних майданчиків для розміщення',
      },
      {
        type: 'p',
        text: 'Для крипто- та фінансового контенту вибір майданчиків є критичним. Нам потрібні були сторінки, які вже ранжувалися, вже були проіндексовані, вже були довірені Google у фінанс/крипто-вертикалі — а не нові гостьові публікації, яким знадобляться тижні для накопичення авторитету.',
      },
      {
        type: 'ul',
        items: [
          'Сторінки з DR 45+ та вимірюваним органічним трафіком у крипто/фінанс-тематиці',
          'Контент, що вже контекстно обговорює цільовий кластер ключових слів',
          'Сторінки, проіндексовані щонайменше 6 місяців тому — віковий контент з усталеними сигналами довіри',
          'Жодних нещодавніх ручних санкцій чи алгоритмічних штрафів на хостинг-домені',
        ],
      },
      {
        type: 'h2',
        text: 'Виконання',
      },
      {
        type: 'p',
        text: 'Усі 12 вставок були виконані протягом 14-денного вікна. Анкор-текст був розподілений між точним збігом (4 посилання), фразовим збігом (5 посилань) та брендовим частковим збігом (3 посилання). Час розміщення був розподілений протягом двотижневого вікна, щоб уникнути неприродного спайку швидкості посилань.',
      },
      {
        type: 'callout',
        label: 'Чому розміщення посилань працює швидше',
        text: 'Посилання, вставлене у вікову, проіндексовану сторінку з існуючим тематичним авторитетом, передає сигнали ранжування негайно — не потрібно чекати, поки нова сторінка накопичить власну довіру. Саме тому розміщення посилань зазвичай показує рух у ранжуванні на 30–50% швидше, ніж еквівалентні гостьові публікації на новому контенті.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: 'Рух позицій розпочався на 18-й день і стабільно тривав. До 45-го дня сторінка піднялася з позиції 14 до позиції 4 — тепер міцно на 1-й сторінці, отримуючи оціночні $8,000+/місяць органічного трафіку за те єдине ключове слово.',
      },
      {
        type: 'table',
        headers: ['День', 'Позиція', 'Примітки'],
        rows: [
          ['День 1', '14', 'Базова лінія — усі посилання розміщені до 14-го дня'],
          ['День 18', '11', 'Перший рух зафіксовано'],
          ['День 28', '7', 'Вхід на 1-шу сторінку'],
          ['День 45', '4', 'Фінальна позиція — топ-5'],
        ],
      },
      {
        type: 'blockquote',
        text: 'Швидкість результату була справді дивовижною. Ми місяцями застрягли на 2-й сторінці. За шість тижнів після публікації вставок ми міцно закріпилися на 1-й сторінці.',
      },
    ],
  },
  'health-organic-growth': {
    title: 'Бренд харчових добавок масштабує органіку до 80k/міс',
    niche: 'Здоров\'я',
    service: 'Повна SEO-підписка',
    challenge: 'E-commerce-бренд добавок генерував 33k органічних сесій на місяць, але не міг пробитися за конкурентні головні терміни через тонкий авторитет і слабкі E-E-A-T-сигнали.',
    solution: '12-місячна повна SEO-підписка: щомісячні гостьові публікації на health-майданчиках (DR 50–75+), E-E-A-T-сигнали через експертні авторські підписи, виправлення технічного аудиту та впровадження структурованих даних.',
    result: 'Щомісячні органічні сесії зросли з 33k до 80k. Дохід з органіки зріс на 67%. Domain Rating піднявся з 34 до 61.',
    tags: ['Здоров\'я', 'E-commerce', 'E-E-A-T', 'Повний SEO'],
    metricSub: 'Органічні сесії',
    period: '12 місяців',
    stats: [
      { label: 'Органічні сесії', value: '33k → 80k' },
      { label: 'Зростання DR', value: '34 → 61' },
      { label: 'Термін', value: '12 місяців' },
      { label: 'Органічний дохід', value: '+67%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Харчові добавки — це YMYL-категорія, де вимоги Google до E-E-A-T застосовуються найсуворіше. 33k сесій на місяць уже було значним показником, але бренд вийшов на плато — не здатний ранжуватися за конкурентними головними термінами, де домінували конкуренти з DR 50+ та контентом, написаним експертами.',
      },
      {
        type: 'h2',
        text: 'Чому YMYL-сайти потребують іншого підходу',
      },
      {
        type: 'p',
        text: 'Оцінювачі якості Google перевіряють контент про здоров\'я за суворими критеріями Досвіду, Експертності, Авторитетності та Достовірності. Сайт добавок без видимих експертних авторів, медичних рецензій та сторонніх цитат з довірених health-джерел матиме труднощі, незалежно від on-page оптимізації.',
      },
      {
        type: 'p',
        text: 'Контент клієнта був хорошим, але йому бракувало E-E-A-T-сигналів. Статті публікувалися без атрибуції авторів. Жоден процес експертної перевірки не був видимим. Профіль посилань був розрідженим і домінувався загальними каталогами, а не тематичними редакційними розміщеннями.',
      },
      {
        type: 'h2',
        text: '12-місячний план',
      },
      {
        type: 'h3',
        text: 'Квартал 1: Фундамент',
      },
      {
        type: 'ul',
        items: [
          'Повний технічний SEO-аудит — виявлено 23 критичні проблеми, включно з блоками сканування та відсутніми структурованими даними',
          'Додано сторінки авторів з професійними кваліфікаціями для всіх контриб\'юторів',
          'Впроваджено Article та Product schema на сторінках категорій та продуктів',
          'Перша партія гостьових публікацій на health-майданчиках для запуску сигналів авторитету',
        ],
      },
      {
        type: 'h3',
        text: 'Квартали 2–3: Нарощування авторитету',
      },
      {
        type: 'p',
        text: 'Щомісячні гостьові публікації на DR 50–75+ майданчиках про здоров\'я, велнес та харчування. Кожне розміщення включало підписи авторів, що посилалися на експертні сторінки авторів сайту — підсилюючи цикл E-E-A-T-сигналів. Контент писався кваліфікованим нутриціологом для забезпечення редакційного прийняття.',
      },
      {
        type: 'h3',
        text: 'Квартал 4: Закріплення',
      },
      {
        type: 'p',
        text: 'Коли авторитет домену був усталений, фінальний квартал зосередився на просуванні найцінніших комерційних термінів. Розміщення посилань у віковому health-контенті прискорило рух у ранжуванні для ключових слів сторінок категорій продуктів.',
      },
      {
        type: 'callout',
        label: 'E-E-A-T-інсайт',
        text: 'Найшвидше покращення E-E-A-T прийшло від однієї зміни: додавання імен авторів з кваліфікаціями та біографій до кожної статті. Системи якості Google виявляють цей сигнал швидко — ми побачили вимірюване покращення ранжування за 6 тижнів після впровадження.',
      },
      {
        type: 'h2',
        text: 'Результати за 12 місяців',
      },
      {
        type: 'table',
        headers: ['Показник', 'Місяць 1', 'Місяць 12', 'Зміна'],
        rows: [
          ['Щомісячні органічні сесії', '33,000', '80,000', '+143%'],
          ['Domain Rating', '34', '61', '+27 пунктів'],
          ['Домени, що посилаються', '120', '280+', '+133%'],
          ['Внесок органічного доходу', 'Базовий', '+67%', 'Значний приріст'],
        ],
      },
      {
        type: 'blockquote',
        text: 'Ми два роки намагалися пробитися у простір ключових слів про здоров\'я. Розуміння того, що E-E-A-T — це не лише про контент, а про всю систему сигналів авторитету — експертні автори, довірені посилання, структуровані дані — стало зрушенням, який змусив усе інше запрацювати.',
      },
    ],
  },
  'automotive-keyword-rankings': {
    title: 'Магазин автозапчастин ранжується за 200+ ключовими словами',
    niche: 'Авто',
    service: 'Гостьові публікації + розміщення посилань',
    challenge: 'E-commerce-магазин автозапчастин мав сильний SEO каталогу продуктів, але лише 60 доменів, що посилаються. Конкуренти мали 300–500+ RD і домінували в інформаційних та комерційних запитах.',
    solution: 'Ми виконали 8-місячну змішану кампанію з нарощування посилань: щомісячні партії гостьових публікацій в авто-ніші (DR 40–65) та кураторські вставки посилань на ентузіастських форумах і сайтах з оглядами.',
    result: 'Домени, що посилаються, зросли з 60 до 188. 200+ раніше не ранжованих ключових слів увійшли в топ-50. Сторінки категорій "performance parts" вийшли на 1-шу сторінку.',
    tags: ['Авто', 'E-commerce', 'Гостьові публікації', 'Розміщення посилань'],
    metricSub: 'Домени, що посилаються',
    period: '8 місяців',
    stats: [
      { label: 'Домени, що посилаються', value: '60 → 188' },
      { label: 'Нові ключі в топ-50', value: '200+' },
      { label: 'Термін', value: '8 місяців' },
      { label: 'Рейтинг сторінки категорії', value: '1-ша сторінка' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Авто-e-commerce — це категорія, де розрив між добре-посиленими та слабо-посиленими сайтами величезний. Маючи 60 доменів, що посилаються, проти конкурентів з 300–500+, клієнт не просто відставав — він був структурно невидимим для всього, окрім вузьких long-tail запитів.',
      },
      {
        type: 'h2',
        text: 'Аналіз стартової позиції',
      },
      {
        type: 'p',
        text: 'Магазин мав справді чудові сторінки продуктів — детальні характеристики, якісні зображення та сильну on-page оптимізацію. Вони добре ранжувалися за точними запитами продуктів (номери деталей, модельно-специфічні запити), але не мали жодної присутності в інформаційних та категорійних комерційних запитах, де домінували конкуренти з сильними профілями посилань.',
      },
      {
        type: 'ul',
        items: [
          '60 доменів, що посилаються, проти середнього по конкурентах 300–500+',
          'Нуль ранжувань за інформаційними запитами ("як вибрати performance parts", "найкращі гальмівні колодки для X")',
          'Сторінки категорій "performance parts" та "suspension upgrades" за 3-ю сторінкою',
          'Сильний SEO на рівні продуктів без підтримки редакційного авторитету',
        ],
      },
      {
        type: 'h2',
        text: 'Структура кампанії',
      },
      {
        type: 'h3',
        text: 'Гостьові публікації на авто-майданчиках',
      },
      {
        type: 'p',
        text: 'Ми націлилися на ентузіастські авто-видання, блоги про авто-культуру та новини автоспорту в діапазоні DR 40–65. Контент гостьових публікацій був переважно інформаційним ("як-зробити" гайди, гайди з вибору, статті-порівняння) з контекстними посиланнями на відповідні сторінки категорій. Це будувало тематичний авторитет, спрямовуючи капітал туди, де він був потрібен.',
      },
      {
        type: 'h3',
        text: 'Розміщення посилань у контенті форумів та оглядів',
      },
      {
        type: 'p',
        text: 'Авто-форуми — золоті копальні вікового, проіндексованого, трафіко-генеруючого контенту. Ми виявили існуючі треди та статті-огляди, що обговорювали конкретні моделі авто та категорії запчастин, які цікавили клієнта, і вставили контекстні посилання в ці обговорення.',
      },
      {
        type: 'callout',
        label: 'Тактична примітка',
        text: 'Вставки посилань на форумах в авто-спільнотах перевищували еквівалентні гостьові публікації з DR приблизно в 2 рази за швидкістю впливу на ранжування. Віковий контент форумів з існуючим тематичним авторитетом передавав сигнали швидше, ніж свіжий редакційний контент.',
      },
      {
        type: 'h2',
        text: 'Результати за 8 місяців',
      },
      {
        type: 'table',
        headers: ['Показник', 'Старт', 'Місяць 8', 'Зміна'],
        rows: [
          ['Домени, що посилаються', '60', '188', '×3.1'],
          ['Ключі в топ-50', '~180', '380+', '+200 ключів'],
          ['Позиція сторінки категорії', '3+ сторінка', '1-ша сторінка', 'Повна видимість категорії'],
          ['Інформаційні ранжування', 'Жодних', '40+ термінів', 'Новий канал трафіку'],
        ],
      },
      {
        type: 'blockquote',
        text: 'Покращення видимості ключових слів було драматичнішим, ніж ми очікували. Ми роками фокусувалися на сторінках продуктів і ніколи не будували посилання на категорії. Коли сторінки категорій отримали авторитет, увесь сайт почав підніматися.',
      },
    ],
  },
  'fintech-lead-generation': {
    title: 'B2B FinTech подвоює демо-запити через SEO',
    niche: 'FinTech',
    service: 'SEO-аудит + гостьові публікації',
    challenge: 'B2B-компанія платіжної інфраструктури мала сильний продукт, але слабку органічну видимість. Їхній блог містив 20+ статей без жодних беклінків. Сторінки з високим наміром не ранжувалися.',
    solution: 'Ми розпочали з повного SEO-аудиту для усунення технічних бар\'єрів, а потім запустили 5-місячну кампанію гостьових публікацій на fintech- та бізнес-майданчиках (DR 55–80+), орієнтованих на ключові слова стадії пошуку рішення.',
    result: 'Органічні кваліфіковані ліди зросли на 58%. Завершення форм демо-запитів з органіки зросли з 8 до 21/місяць. Вплив на MRR, зумовлений органікою: +$14k.',
    tags: ['FinTech', 'B2B', 'Генерація лідів', 'SEO-аудит'],
    metricSub: 'Кваліфіковані ліди',
    period: '5 місяців',
    stats: [
      { label: 'Кваліфіковані ліди', value: '+58%' },
      { label: 'Щомісячні демо', value: '8 → 21' },
      { label: 'Термін', value: '5 місяців' },
      { label: 'Вплив на MRR', value: '+$14k' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Для B2B SaaS органічний SEO — це гра на якість лідів, а не лише на обсяг. Демо-запити з органічного пошуку конвертуються в 3–5 разів швидше за платний трафік, бо шукач уже провів своє дослідження. Цей клієнт залишав лідів з високим наміром на столі, бо їхні сторінки рішень не ранжувалися.',
      },
      {
        type: 'h2',
        text: 'Спершу аудит',
      },
      {
        type: 'p',
        text: 'Перед будь-яким нарощуванням посилань ми провели повний технічний та on-page аудит. Два критичні бар\'єри були виявлені негайно: ключові комерційні сторінки були випадково деіндексовані внаслідок міграції CMS, а внутрішнє перелінкування сайту спрямовувало весь капітал до блогу, а не до демо- та solution-сторінок, які реально конвертують.',
      },
      {
        type: 'ul',
        items: [
          'Кілька сторінок рішень були деіндексовані через помилку міграції CMS',
          'Капітал внутрішніх посилань був сильно зміщений до контенту блогу, а не комерційних сторінок',
          'Canonical-теги були неправильно налаштовані на кількох ключових цільових сторінках',
          'Жодних структурованих даних на сторінках рішень — пропущені можливості FAQ та SoftwareApplication schema',
        ],
      },
      {
        type: 'p',
        text: 'Виправлення лише цих проблем дало вимірюване покращення ще до того, як було побудоване хоч одне нове посилання. Урок: завжди аудитуйте перед будівництвом.',
      },
      {
        type: 'h2',
        text: 'Кампанія з нарощування посилань',
      },
      {
        type: 'p',
        text: 'Після усунення технічних проблем ми запустили 5-місячну кампанію гостьових публікацій, орієнтовану на FinTech-видання, блоги бізнес-операцій та ресурси платіжної індустрії в діапазоні DR 55–80+. Кожне розміщення було спеціально прив\'язане до сторінок рішень та демо — а не до головної сторінки чи блогу.',
      },
      {
        type: 'h3',
        text: 'Таргетинг на видання',
      },
      {
        type: 'p',
        text: 'Ми зосередилися на виданнях, які читає точна персона-покупець клієнта: фінансові оператори, керівники платіжних команд та CTO середніх бізнесів. Авторитет домену був другорядним порівняно з відповідністю аудиторії — сайт DR 55, який читають платіжні професіонали, був ціннішим за загальнотехнічний блог DR 75.',
      },
      {
        type: 'callout',
        label: 'B2B-інсайт',
        text: 'Для B2B-генерації лідів якість аудиторії на сайті, що посилається, важить не менше за авторитет домену. Посилання з видань, які читають ваші покупці, приносять реферальні візити зі справжнім наміром конверсії.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'table',
        headers: ['Показник', 'До', 'Місяць 5', 'Зміна'],
        rows: [
          ['Щомісячні органічні квал. ліди', 'Базовий', '+58%', 'Значний приріст'],
          ['Завершення демо-форм (органіка)', '8/міс', '21/міс', '+163%'],
          ['MRR з органіки', 'Базовий', '+$14,000', '+$14k MRR'],
          ['Сторінки рішень у топ-10', '1', '4', '+3 сторінки'],
        ],
      },
      {
        type: 'blockquote',
        text: 'Результати аудиту були вражаючими — ми не знали, що наші сторінки рішень були виключені з індексу Google. Поєднання технічних виправлень і нарощування посилань дало результати набагато швидше, ніж дала б кампанія лише з посиланнями.',
      },
    ],
  },
  'igaming-20k-traffic': {
    title: 'iGaming-сайт зростає зі 100 до 20,000+ щомісячних відвідувачів',
    niche: 'iGaming',
    service: 'Гостьові публікації + крауд-маркетинг + розміщення посилань',
    challenge: 'Новий iGaming-проєкт, орієнтований на конкурентний ринок Великої Британії, мав домен з дуже низьким авторитетом порівняно з усталеними конкурентами, що обмежувало ранжування за всіма комерційними ключовими словами.',
    solution: 'Ми тісно співпрацювали з внутрішньою SEO-командою клієнта, щоб побудувати 2,000+ якісних посилань за 2 роки. Початок з невеликих обсягів і масштабування на ~15% щомісяця забезпечило природне зростання для нового домену. Кожне розміщення було на 100% ручним — без автоматизації.',
    result: 'Щомісячні органічні відвідувачі зросли зі 100 до 20,000+. 500+ ключових слів увійшли в топ-3 Google. Кількість доменів, що посилаються, стабільно зростала місяць за місяцем протягом кампанії.',
    tags: ['iGaming', 'Ринок Великої Британії', 'Масштабоване зростання', 'Ручні розміщення'],
    metricSub: 'Органічний трафік',
    period: '2 роки',
    stats: [
      { label: 'Зростання трафіку', value: '100 → 20k+' },
      { label: 'Розміщених посилань', value: '2,000+' },
      { label: 'Термін', value: '>2 роки' },
      { label: 'Топ-3 ключові слова', value: '500+' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Побудова нового iGaming-бренду на ринку Великої Британії з нуля — один із найскладніших викликів в SEO. Британська гемблінг-вертикаль має одних з найбільш усталених, щедро фінансованих конкурентів в інтернеті. Через два роки та 2,000+ посилань цей клієнт пройшов від 100 щомісячних відвідувачів до 20,000+.',
      },
      {
        type: 'h2',
        text: 'Виклик старту з нуля',
      },
      {
        type: 'p',
        text: 'Новий домен не має довіри, історії та авторитету. Google консервативно підходить до ранжування нових доменів за конкурентними запитами — особливо в YMYL-категоріях на кшталт гемблінгу. Стратегія зростання мала бути відкаліброваною під специфічні обмеження нового домену, а не під тактики, що працюють для усталеного сайту.',
      },
      {
        type: 'ul',
        items: [
          'Нуль історії домену — Google ставиться до нових гемблінг-доменів зі значним скепсисом',
          'Британські iGaming-конкуренти мають 5–15 років накопиченого авторитету та тисячі доменів, що посилаються',
          'Комерційні ключові слова вимагають мінімум DR 50+ для появи на 1-й сторінці у більшості випадків',
          'Будь-яка неприродна швидкість посилань на новому домені викликає алгоритмічний контроль',
        ],
      },
      {
        type: 'h2',
        text: 'Стратегія: повільно й стійко',
      },
      {
        type: 'p',
        text: 'Ми працювали безпосередньо з внутрішнім SEO-спеціалістом клієнта, щоб узгодити стратегію на кожному етапі. Ключовим принципом була терплячість — поступове нарощування авторитету так, щоб пройти алгоритмічну перевірку та компаундувати з часом.',
      },
      {
        type: 'table',
        headers: ['Фаза', 'Термін', 'Щомісячні посилання', 'Фокус'],
        rows: [
          ['Фундамент', 'Місяці 1–4', '8–12', 'Брендові сигнали, низькоризикові розміщення'],
          ['Зростання', 'Місяці 5–12', '15–20', 'iGaming-видання, посилання на форумах'],
          ['Прискорення', 'Місяці 13–18', '22–30', 'Гостьові публікації + розміщення посилань'],
          ['Закріплення', 'Місяці 19–24', '25–35', 'Високий DR, уточнення анкорів'],
        ],
      },
      {
        type: 'h3',
        text: '100% ручні розміщення',
      },
      {
        type: 'p',
        text: 'Кожне посилання було розміщене вручну — без автоматизованих інструментів, без PBN, без лінк-ферм. У сфері iGaming, де спам-детекція Google особливо агресивна, пріоритет якості над обсягом був безкомпромісним.',
      },
      {
        type: 'callout',
        label: 'Ключовий принцип',
        text: 'Нові домени потребують нижчої початкової швидкості та довшого часу побудови, ніж усталені сайти. Правило 15% щомісячного зростання зберігало профіль природним упродовж усього часу — жодних спайків, жодних плато, лише послідовний поступ.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: 'Крива зростання слідувала характерному SEO-патерну: повільний початковий рух, точка перелому приблизно на 10-му місяці, коли авторитет накопичився достатньо, а потім прискорене зростання, коли ранжування за конкурентними термінами почало матеріалізуватися.',
      },
      {
        type: 'blockquote',
        text: 'Терплячість, яка була потрібна, стала найскладнішою частиною для нашої команди. Перші шість місяців результати були скромними. До 12-го місяця ми побачили реальний рух. До 24-го місяця ми мали справді конкурентоспроможний сайт в одній з найскладніших ніш в інтернеті.',
      },
    ],
  },
  'dating-5x-traffic': {
    title: '5-кратне зростання трафіку для сайту в ніші дейтингу',
    niche: 'Дейтинг',
    service: 'Розміщення посилань',
    challenge: 'Сайт знайомств зі 130k щомісячних відвідувачів мав пробитися у висококонкурентній та делікатній ніші. Стандартний outreach був переважно неефективним — більшість видань відхиляли контент, суміжний з гемблінгом та дейтингом.',
    solution: 'Ми розробили кампанію розміщення посилань, орієнтовану на домени DR 30+ з 1k+ щомісячним трафіком. Ми почали консервативно з 5 посилань у липні, масштабуючи систематично — 5 → 15 → 20 → 30 → 40 посилань на місяць — для підтримання природної швидкості посилань протягом 5 місяців.',
    result: 'Трафік зріс зі 130k до 690k щомісячних відвідувачів — п\'ятикратне збільшення. Ключові слова зросли на 35%. Загальні інвестиції: $5,500 за 110 розміщених посилань.',
    tags: ['Дейтинг', 'Розміщення посилань', 'Зростання трафіку', 'Масштабована кампанія'],
    metricSub: 'Органічний трафік',
    period: '5 місяців',
    stats: [
      { label: 'Трафік', value: '130k → 690k' },
      { label: 'Розміщених посилань', value: '110' },
      { label: 'Термін', value: '5 місяців' },
      { label: 'Зростання ключових слів', value: '+35%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Дейтинг — ніша, яку більшість лінкбілдерів вважає складною — подібне редакційне фільтрування до гемблінгу, обмежені тематичні видання та інтенсивна конкуренція за трафік. Рішенням тут стали розміщення посилань у масштабі, розгорнуті з ретельним контролем швидкості.',
      },
      {
        type: 'h2',
        text: 'Чому розміщення посилань для дейтингу',
      },
      {
        type: 'p',
        text: 'Гостьові публікації для дейтинг-контенту складні. Видання з справжніми редакційними стандартами часто мають політику повної заборони на дейтинг-, стосунковий чи дорослий-суміжний контент. Рівень відмов для outreach-кампаній перевищує 80% у цій категорії. Розміщення посилань розв\'язує це, працюючи з існуючим контентом, а не пітчачи нові статті — мова про релевантне вставлення посилання, а не про побудову нових контентних відносин.',
      },
      {
        type: 'h2',
        text: 'Підхід з контролем швидкості',
      },
        {
        type: 'p',
        text: 'Клієнт уже мав значний трафік (130k/міс), що означало певний усталений авторитет домену. Ризик перенасичення був реальним — раптовий спайк нових посилань виглядав би неприродним. Ми розробили масштабований графік, що зростав обсяг посилань місяць за місяцем.',
      },
      {
        type: 'table',
        headers: ['Місяць', 'Розміщених посилань', 'Накопичено', 'Бюджет'],
        rows: [
          ['Липень', '5', '5', '$250'],
          ['Серпень', '15', '20', '$750'],
          ['Вересень', '20', '40', '$1,000'],
          ['Жовтень', '30', '70', '$1,500'],
          ['Листопад', '40', '110', '$2,000'],
        ],
      },
      {
        type: 'h2',
        text: 'Стандарти якості розміщень',
      },
      {
        type: 'ul',
        items: [
          'DR 30+ мінімум на всіх доменах розміщень',
          'Мінімум 1,000 органічних відвідувань на місяць на домені, що посилається',
          'Середня ціна за посилання: $50',
          'Лише dofollow-розміщення в контекстно-релевантному контенті',
          'Жодних лінк-ферм, PBN чи розміщень у футері/сайдбарі',
        ],
      },
      {
        type: 'callout',
        label: 'Інсайт щодо результатів',
        text: 'Мультиплікатор трафіку в цій кампанії був незвично високим (5x за 5 місяців), бо домен уже мав сильний on-page SEO — багато сторінок ранжувалися на 2-й сторінці і потребували лише маргінального покращення авторитету, щоб увійти на 1-шу сторінку та отримати значно більше кліків.',
      },
      {
        type: 'h2',
        text: 'Фінальні результати',
      },
      {
        type: 'p',
        text: 'Трафік зріс зі 130,000 до 690,000 щомісячних відвідувачів. Ключові слова зросли на 35%. Загальні інвестиції в кампанію склали $5,500 за 110 розміщених посилань — ROI, що відображає ефективність таргетування на можливості біля 1-ї сторінки цільовими розміщеннями посилань.',
      },
      {
        type: 'blockquote',
        text: 'Ми раніше намагалися купувати посилання з різними результатами. Різницею тут була якість розміщень і контрольоване масштабування — це виглядало як природне зростання, бо так і було задумано.',
      },
    ],
  },
  'crypto-forum-x10-traffic': {
    title: 'Форумні посилання дають 10-кратний трафік для криптопроєкту',
    niche: 'Криптовалют',
    service: 'Форумні беклінки',
    challenge: 'Сайт блокчейн-нодів у ніші криптовалют мав покращити органічну видимість та ранжування ключових слів зі скромним бюджетом. Тема була глибоко технічною — інфраструктура блокчейн-нодів — що обмежувало варіанти розміщень.',
    solution: 'Починаючи з вересня 2022 року, ми розміщували 15 форумних беклінків на місяць у тематично-релевантних тредах. Кожне розміщення було вручну написаним коментарем на 300+ символів, органічно вписаним у тред. Обсяг збільшувався на 5–10% щомісяця. Клієнт поєднав форумні посилання з розміщеннями та гостьовими публікаціями для диверсифікованого профілю.',
    result: 'Трафік зріс із 600 до 9,000+ щомісячних відвідувачів — 10-кратне збільшення за 1,5 роки. Ключові слова зросли на ~60%. Domain Rating та домени, що посилаються, також стабільно зростали. Загальні витрати: $3,500 за 585 розміщених посилань по $6/посилання.',
    tags: ['Криптовалют', 'Блокчейн', 'Форумні посилання', 'Довгострокове зростання'],
    metricSub: 'Органічний трафік',
    period: '1,5 роки',
    stats: [
      { label: 'Трафік', value: '600 → 9k+' },
      { label: 'Розміщених посилань', value: '585' },
      { label: 'Термін', value: '1,5 роки' },
      { label: 'Зростання ключових слів', value: '+60%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Інфраструктура блокчейн-нодів — ніша в ніші. Технічна специфічність обмежувала варіанти розміщень, але й означала, що конкуренція була менш жорсткою, ніж за загальні крипто-терміни. Послідовна стратегія форумних посилань у поєднанні зі скромним бюджетом дала 10-кратне зростання трафіку за 18 місяців.',
      },
      {
        type: 'h2',
        text: 'Про нішу',
      },
      {
        type: 'p',
        text: 'Блокчейн-ноди — технічний хребет криптовалютних мереж — вони валідують транзакції, зберігають копії блокчейну та забезпечують основні функції децентралізованих систем. Це високотехнічна тема з відданою, але спеціалізованою аудиторією розробників, операторів нод та професіоналів крипто-інфраструктури.',
      },
      {
        type: 'h2',
        text: 'Чому форумні посилання були правильним інструментом',
      },
      {
        type: 'p',
        text: 'Для технічної крипто-теми форуми та спільноти розробників — там, де живе справжня аудиторія. Bitcointalk, крипто-специфічні сабредіти, Stack Exchange та спеціалізовані форуми блокчейн-розробників усі мають справжню аудиторію, що активно обговорює інфраструктуру нод. Розміщення посилань у цих спільнотах дають як SEO-сигнали, так і прямий реферальний трафік від висококваліфікованих відвідувачів.',
      },
      {
        type: 'ul',
        items: [
          'Економічно ефективні за $6/посилання — підходять для бюджетної довгострокової кампанії',
          'Домени форумів часто мають високий DR та справжній органічний трафік',
          'Технічні обговорення природно вміщують посилання на зовнішні ресурси',
          'Спільнота валідує контент, що покращує клікабельність розміщених посилань',
        ],
      },
      {
        type: 'h2',
        text: 'Деталі виконання',
      },
      {
        type: 'p',
        text: 'Ми розміщували посилання лише в тредах, що специфічно обговорюють блокчейн-ноди, налаштування валідаторів чи пов\'язані теми інфраструктури. Кожен коментар мав щонайменше 300 символів і справді робив внесок в обговорення. Розміщення розподілялися протягом 10–14 днів щомісяця, щоб уникнути неприродних патернів швидкості.',
      },
      {
        type: 'table',
        headers: ['Період', 'Щомісячні посилання', 'Накопичено', 'Щомісячні витрати'],
        rows: [
          ['Місяць 1–3', '15', '45', '$90'],
          ['Місяць 4–9', '16–20', '~145', '$96–120'],
          ['Місяць 10–14', '20–25', '~370', '$120–150'],
          ['Місяць 15–18', '25–30', '585', '$150–180'],
        ],
      },
      {
        type: 'callout',
        label: 'Важливий контекст',
        text: 'Форумні посилання самі по собі не були всією картиною. Клієнт використовував форумні розміщення як базовий шар ширшої стратегії, що включала розміщення посилань та гостьові публікації. Саме поєднання типів посилань дало результат 10x — форумні посилання як диверсифікація, редакційні посилання як будівники авторитету.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: 'За 18 місяців трафік зріс із 600 до 9,000+ щомісячних відвідувачів. Ключові слова зросли на 60%. Поступовий, послідовний підхід дав компаундне зростання — спочатку повільне, а потім прискорене, коли накопичений авторитет подолав пороги ранжування для конкурентніших термінів.',
      },
      {
        type: 'blockquote',
        text: 'Бюджетні обмеження насправді змусили нас до кращої стратегії. Підхід з крапельним розміщенням виглядав абсолютно природно, а форумні розміщення в спільнотах розробників приносили справжній реферальний трафік від людей, які справді хотіли читати наш контент.',
      },
    ],
  },
  'software-263-traffic': {
    title: 'ПЗ для управління паролями досягає 263% зростання трафіку',
    niche: 'ПЗ',
    service: 'Форумні беклінки + розміщення посилань + Q&A',
    challenge: 'Сайт програмного забезпечення для управління паролями мав базовий профіль посилань з 804 доменами, що посилаються. Потрібно було сильніше ранжування за конкурентними ключовими словами на англомовних ринках (США, Велика Британія, Канада) з контрольованим щомісячним бюджетом.',
    solution: 'Ми впровадили стратегію змішаного нарощування посилань за $500/місяць, орієнтовану на 10–15% щомісячного зростання беклінків. Мікс включав форумні беклінки, розміщення посилань/outreach та Q&A-пости. Ми оцінювали розміщення за трафіком, кількістю ключових слів та присутністю аудиторії США — а не лише за DR. Кожна щомісячна кампанія тривала 25 днів зі збалансованим розподілом.',
    result: '400+ беклінків розміщено на різноманітних майданчиках за 6 місяців. Ключові слова зросли на 25%, причому багато увійшло в топові позиції. Органічний трафік зріс на 263%. Домени, що посилаються, та загальний авторитет стабільно зростали протягом усього часу.',
    tags: ['ПЗ', 'SaaS', 'Змішана стратегія', 'Англомовні ринки'],
    metricSub: 'Органічний трафік',
    period: '6 місяців',
    stats: [
      { label: 'Зростання трафіку', value: '+263%' },
      { label: 'Розміщених посилань', value: '400+' },
      { label: 'Щомісячний бюджет', value: '$500/міс' },
      { label: 'Зростання ключових слів', value: '+25%' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Управління паролями — переповнена категорія ПЗ, де домінують великі гравці з роками накопиченого SEO-авторитету. Пробитися за $500/місяць вимагає максимальної ефективності — кожне посилання має відпрацьовувати. Змішана стратегія з трьох типів посилань дала 263% зростання трафіку за 6 місяців.',
      },
      {
        type: 'h2',
        text: 'Стартова позиція',
      },
      {
        type: 'p',
        text: 'Сайт не стартував з нуля — 804 домени, що посилаються, є поважним фундаментом. Проблема була в стагнації: профіль перестав зростати, ранжування за конкурентними ключовими словами на кшталт "найкращий менеджер паролів для команд" та "корпоративний захист паролів" були плоскими, і сайт поступався конкурентам, які активно будували посилання.',
      },
      {
        type: 'h2',
        text: 'Змішана стратегія за $500/місяць',
      },
      {
        type: 'p',
        text: 'Ми розподілили щомісячний бюджет між трьома типами посилань, щоб забезпечити якісне покриття та диверсифікацію профілю. Розподіл змінювався від місяця до місяця залежно від того, що давало найкращі результати для конкретних цільових ключових слів.',
      },
      {
        type: 'table',
        headers: ['Тип посилання', 'Щомісячний обсяг', 'Прибл. вартість', 'Основна мета'],
        rows: [
          ['Форумні беклінки', '20–25', '$120–150', 'Диверсифікація профілю, домени, що посилаються'],
          ['Розміщення посилань', '8–10', '$200–240', 'Авторитет на рівні сторінок для цільових сторінок'],
          ['Q&A (Quora/Reddit)', '8–12', '$80–110', 'Тематичний авторитет + реферальний трафік'],
        ],
      },
      {
        type: 'h3',
        text: 'Критерії оцінки поза DR',
      },
      {
        type: 'p',
        text: 'Ми не використовували Domain Rating як основний показник якості розміщення. Для ПЗ-продукту, орієнтованого на користувачів у США, Великій Британії та Канаді, важливішим було те, чи має домен, що посилається, справжній органічний трафік з цих ринків, скільки ключових слів він ранжує (що вказує на справжній редакційний контент) та чи є контент сторінки тематично-релевантним для ПЗ безпеки та продуктивності.',
      },
      {
        type: 'callout',
        label: 'Стандарт розміщення',
        text: 'Кожне розміщення оцінювалося з використанням даних трафіку Ahrefs, географії аудиторії SimilarWeb та ручної перевірки контенту. DR був вторинним фільтром, а не основним.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: '400+ посилань розміщено на різноманітних доменах за 6 місяців. Органічний трафік зріс на 263%. На 25% більше ключових слів увійшло в ранжування, причому багато піднялося в топові позиції за конкурентними термінами ПЗ. Загальні витрати склали $3,000 — ефективна кампанія для висококонкурентної вертикалі.',
      },
      {
        type: 'blockquote',
        text: 'Диверсифікований підхід був ключовим. Раніше ми фокусувалися лише на гостьових публікаціях і бачили повільні результати. Додавання форумних посилань та Q&A-розміщень змінило швидкість — а покращення вартості за посилання було значним.',
      },
    ],
  },
  'health-google-update-recovery': {
    title: 'Health-сайт відновлюється після Google Core Update з форумними посиланнями',
    niche: 'Здоров\'я',
    service: 'Форумні беклінки',
    challenge: 'Після волатильного Google Core Update квітня 2024 року health-сайт, присвячений оливковій олії, зазнав значного падіння видимості ключових слів та трафіку. Клієнту потрібне було недороге рішення для стабілізації та відновлення ранжувань.',
    solution: 'Ми порекомендували форумні беклінки як економічно ефективний спосіб диверсифікувати профіль посилань, додати природні цитування та підсилити сигнали ключових слів. Ми розміщували 50 унікальних форумних посилань на місяць протягом 3 місяців — кожне як справжній коментар на 300+ символів у health-релевантному треді. Пріоритет віддавався стабільному крапельному розміщенню для органічного вигляду.',
    result: 'Після 3–4 місяців послідовного розміщення сайт показав зростання показів Google, приріст доменів, що посилаються, покращення видимості ключових слів та відновлення трафіку. Загальні витрати: $900 за 150 форумних посилань по $6/посилання.',
    tags: ['Здоров\'я', 'Відновлення після Google', 'Форумні посилання', 'Низький бюджет'],
    metricSub: 'Форумні посилання',
    period: '3 місяці',
    stats: [
      { label: 'Розміщених посилань', value: '150' },
      { label: 'Бюджет', value: '$900' },
      { label: 'Термін', value: '3 місяці' },
      { label: 'Вартість за посилання', value: '$6' },
    ],
    body: [
      {
        type: 'intro',
        text: 'Google Core Update квітня 2024 був одним із найволатильніших за останні часи. Багато легітимних health- та лайфстайл-сайтів побачили значне падіння ранжування — не через спам, а через зміни в тому, як Google оцінював E-E-A-T та сигнали якості контенту. Форумні посилання стали недорогим механізмом стабілізації у період відновлення.',
      },
      {
        type: 'h2',
        text: 'Розуміння ситуації після апдейту',
      },
      {
        type: 'p',
        text: 'Сайт клієнта охоплював оливкову олію — користь для здоров\'я, рецепти, гайди з покупки та огляди виробників. До апдейту він стабільно зростав. Квітневий апдейт 2024 року вдарив по ньому падінням трафіку на 35–40%. Сам контент не змінився; змінилася оцінка Google.',
      },
      {
        type: 'p',
        text: 'Аналіз після апдейту припустив, що основною проблемою був тонкий профіль доменів, що посилаються — сайт мав хороший контент, але обмежені сторонні цитування. Оновлена оцінка якості Google надавала більше ваги зовнішнім сигналам, що підтверджують достовірність сайту у його темі.',
      },
      {
        type: 'h2',
        text: 'Чому форумні посилання для відновлення',
      },
      {
        type: 'ul',
        items: [
          'Економічно ефективні за $6/посилання — бюджети відновлення часто обмежені',
          'Швидко додає унікальні домени, що посилаються, з проіндексованих майданчиків зі справжнім трафіком',
          'Природне крапельне розміщення узгоджується з тим, як справжні спільноти посилаються на контент',
          'Релевантні форуми про здоров\'я та їжу дають справжні сигнали тематичного авторитету',
          'Жодного ризику ручних санкцій за правильного виконання — форумні посилання є прийнятою практикою',
        ],
      },
      {
        type: 'h2',
        text: 'Виконання кампанії',
      },
      {
        type: 'p',
        text: 'Ми розміщували 50 форумних беклінків на місяць у спільнотах про здоров\'я, харчування, кулінарію та середземноморську дієту. Кожен коментар писався так, щоб справді додати цінності до обговорення — щонайменше 300 символів, прямо релевантний темі треду, з посиланням, що природно з\'являлося як ресурсна рекомендація, а не промо-вставка.',
      },
      {
        type: 'callout',
        label: 'Послідовність над обсягом',
        text: 'Клієнт спочатку хотів прискорити темп для швидшого відновлення. Ми порадили проти — раптовий спайк нових посилань після апдейту, ймовірно, виглядав би маніпулятивним для систем Google. Стабільні 50/місяць протягом 3 місяців — це вигляд сайту, що органічно зростає.',
      },
      {
        type: 'h2',
        text: 'Результати',
      },
      {
        type: 'p',
        text: 'Після 3 місяців розміщення та 4-го місяця спостереження вимірювані покращення були видимі за всіма відстежуваними метриками: покази Google Search Console зросли, кількість доменів, що посилаються, збільшилась від додаткових, позиції ключових слів для основних термінів покращилися, а загальний трафік почав відновлюватися. Прогнози повного відновлення були на шляху до 5-го місяця.',
      },
      {
        type: 'table',
        headers: ['Показник', 'Мінімум після апдейту', 'Місяць 4', 'Напрямок'],
        rows: [
          ['Покази GSC', 'Значне падіння', 'Відновлюється', 'Висхідний тренд'],
          ['Домени, що посилаються', 'Стагнація', '+150 нових доменів', 'Зростання'],
          ['Видимість ключових слів', 'Падіння ~35%', 'Часткове відновлення', 'Покращення'],
          ['Органічний трафік', 'Падіння ~35–40%', 'Відновлюється', 'Висхідний тренд'],
        ],
      },
      {
        type: 'blockquote',
        text: 'Апдейт був жорстоким, і ми не знали, з чого почати. Форумні посилання здавалися майже занадто простим рішенням — але приріст доменів, що посилаються, був саме тим, що потрібно профілю. Це дало Google більше сторонніх сигналів, що контент легітимний.',
      },
    ],
  },
};
