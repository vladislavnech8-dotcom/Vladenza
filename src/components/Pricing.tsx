import { Check, Store, TrendingUp, Building2 } from 'lucide-react';

/* ─── Plan header illustrations ───────────────────────────────── */

function StarterIllustration() {
  return (
    <svg viewBox="0 0 400 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="144" fill="#111827" />
      {/* Background grid lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1="0" y1={36 * (i+1)} x2="400" y2={36 * (i+1)} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.05" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9].map(i => (
        <line key={i} x1={40 * (i+1)} y1="0" x2={40 * (i+1)} y2="144" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.05" />
      ))}
      {/* Glow */}
      <ellipse cx="60" cy="72" rx="100" ry="80" fill="#F97316" fillOpacity="0.15" />
      {/* Domain Rating arc widget */}
      <circle cx="72" cy="72" r="44" stroke="#1f2937" strokeWidth="8" />
      <circle cx="72" cy="72" r="44" stroke="#F97316" strokeWidth="8" strokeDasharray="138 276" strokeLinecap="round" transform="rotate(-90 72 72)" strokeOpacity="0.9" />
      <text x="72" y="68" textAnchor="middle" fill="white" fontSize="18" fontWeight="800" fontFamily="Inter,sans-serif">DR</text>
      <text x="72" y="86" textAnchor="middle" fill="#F97316" fontSize="13" fontWeight="700" fontFamily="Inter,sans-serif">28</text>
      {/* Right side bars */}
      <rect x="148" y="100" width="16" height="28" rx="3" fill="#F97316" fillOpacity="0.3" />
      <rect x="172" y="84" width="16" height="44" rx="3" fill="#F97316" fillOpacity="0.4" />
      <rect x="196" y="68" width="16" height="60" rx="3" fill="#F97316" fillOpacity="0.55" />
      <rect x="220" y="52" width="16" height="76" rx="3" fill="#F97316" fillOpacity="0.7" />
      <rect x="244" y="36" width="16" height="92" rx="3" fill="#F97316" fillOpacity="0.85" />
      <rect x="268" y="24" width="16" height="104" rx="3" fill="#F97316" />
      {/* Dotted trend line */}
      <polyline points="156,96 180,76 204,60 228,44 252,28 276,20" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 4" fill="none" />
      {/* Label */}
      <text x="310" y="48" fill="white" fontSize="10" fontOpacity="0.5" fontFamily="Inter,sans-serif" fill-opacity="0.4">Referring</text>
      <text x="310" y="62" fill="white" fontSize="10" fontFamily="Inter,sans-serif" fill-opacity="0.4">Domains</text>
      <text x="310" y="82" fill="#F97316" fontSize="20" fontWeight="800" fontFamily="Inter,sans-serif">+120</text>
      {/* Horizontal rule */}
      <line x1="148" y1="128" x2="380" y2="128" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.2" />
      <text x="148" y="140" fill="white" fontSize="8" fontFamily="Inter,sans-serif" fill-opacity="0.3">6 months</text>
    </svg>
  );
}

function GrowthIllustration() {
  return (
    <svg viewBox="0 0 400 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="144" fill="#0f1623" />
      {/* Glow */}
      <ellipse cx="200" cy="72" rx="200" ry="90" fill="#F97316" fillOpacity="0.12" />
      <ellipse cx="320" cy="30" rx="120" ry="70" fill="#F97316" fillOpacity="0.08" />
      {/* Traffic area chart */}
      <defs>
        <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M 20,120 L 60,108 L 100,100 L 140,88 L 180,72 L 220,58 L 260,40 L 300,24 L 340,14 L 380,8 L 380,136 L 20,136 Z" fill="url(#growthGrad)" />
      <path d="M 20,120 L 60,108 L 100,100 L 140,88 L 180,72 L 220,58 L 260,40 L 300,24 L 340,14 L 380,8" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Data points */}
      {[[20,120],[100,100],[180,72],[260,40],[340,14]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#F97316" stroke="#0f1623" strokeWidth="2" />
      ))}
      {/* Stat overlay */}
      <rect x="240" y="20" width="130" height="62" rx="8" fill="#1f2937" fillOpacity="0.9" />
      <rect x="240" y="20" width="130" height="62" rx="8" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.4" />
      <text x="255" y="40" fill="white" fontSize="9" fontFamily="Inter,sans-serif" fillOpacity="0.5">Organic Traffic</text>
      <text x="255" y="58" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter,sans-serif">+247%</text>
      <text x="255" y="74" fill="#F97316" fontSize="9" fontWeight="600" fontFamily="Inter,sans-serif">↑ vs. last quarter</text>
      {/* Subtle grid */}
      {[40,80,120].map(y => (
        <line key={y} x1="20" y1={y} x2="220" y2={y} stroke="white" strokeWidth="0.5" strokeOpacity="0.04" />
      ))}
    </svg>
  );
}

function EnterpriseIllustration() {
  return (
    <svg viewBox="0 0 400 144" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="400" height="144" fill="#111827" />
      {/* Corner glow */}
      <ellipse cx="380" cy="0" rx="180" ry="120" fill="#F97316" fillOpacity="0.12" />
      {/* Concentric rings */}
      <circle cx="370" cy="144" r="80" stroke="#F97316" strokeWidth="1" strokeOpacity="0.15" fill="none" />
      <circle cx="370" cy="144" r="120" stroke="#F97316" strokeWidth="1" strokeOpacity="0.1" fill="none" />
      <circle cx="370" cy="144" r="160" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.07" fill="none" />
      {/* World map dots suggestion */}
      {[[60,50],[90,40],[130,55],[170,45],[200,60],[230,50],[260,65],[100,80],[140,90],[180,75],[220,85]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#F97316" fillOpacity={0.3 + (i % 3) * 0.2} />
      ))}
      {/* Connection lines between dots */}
      <polyline points="60,50 90,40 130,55 170,45 200,60 230,50 260,65" stroke="#F97316" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
      <polyline points="100,80 140,90 180,75 220,85" stroke="#F97316" strokeWidth="0.8" strokeOpacity="0.15" fill="none" />
      <line x1="90" y1="40" x2="100" y2="80" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.15" />
      <line x1="170" y1="45" x2="180" y2="75" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.15" />
      <line x1="230" y1="50" x2="220" y2="85" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.15" />
      {/* Bottom panel */}
      <rect x="0" y="100" width="400" height="44" fill="#0f1623" fillOpacity="0.8" />
      <line x1="0" y1="100" x2="400" y2="100" stroke="#F97316" strokeWidth="0.5" strokeOpacity="0.3" />
      <text x="20" y="118" fill="white" fontSize="9" fontFamily="Inter,sans-serif" fillOpacity="0.4">Markets active</text>
      <text x="20" y="134" fill="#F97316" fontSize="16" fontWeight="800" fontFamily="Inter,sans-serif">24 countries</text>
      <text x="160" y="118" fill="white" fontSize="9" fontFamily="Inter,sans-serif" fillOpacity="0.4">Avg DR gain</text>
      <text x="160" y="134" fill="white" fontSize="16" fontWeight="800" fontFamily="Inter,sans-serif">+<tspan fill="#F97316">26</tspan></text>
      <text x="270" y="118" fill="white" fontSize="9" fontFamily="Inter,sans-serif" fillOpacity="0.4">Links placed</text>
      <text x="270" y="134" fill="white" fontSize="16" fontWeight="800" fontFamily="Inter,sans-serif">12<tspan fill="#F97316">k+</tspan></text>
    </svg>
  );
}

const plans = [
  {
    name: 'Starter',
    price: 'From $1K',
    period: '/mo',
    tagline: 'Build a safe SEO foundation',
    highlight: false,
    icon: Store,
    illustration: <StarterIllustration />,
    accentColor: 'text-[#F97316]',
    features: [
      'Natural link growth velocity',
      'Branded & URL anchor placements',
      'Niche-relevant platforms',
      'Manual quality checks',
      'Monthly progress report',
      'Risk-free link velocity',
    ],
    cta: 'Get Started',
  },
  {
    name: 'Growth',
    price: 'From $3K',
    period: '/mo',
    tagline: 'Scale authority fast',
    highlight: true,
    icon: TrendingUp,
    illustration: <GrowthIllustration />,
    accentColor: 'text-[#F97316]',
    features: [
      'Everything in Starter',
      'Guest posts on DR 50+ sites',
      'Contextual link inserts',
      'Anchor text diversification',
      'Competitor gap analysis',
      'Bi-weekly reporting & calls',
    ],
    cta: 'Get Proposal',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: ' pricing',
    tagline: 'Multi-market domination',
    highlight: false,
    icon: Building2,
    illustration: <EnterpriseIllustration />,
    accentColor: 'text-[#F97316]',
    features: [
      'Everything in Growth',
      'Clean link foundation audit',
      'Multi-market SEO strategy',
      'Dedicated account manager',
      'Priority link placements',
      'Custom KPI dashboard',
    ],
    cta: 'Contact Us',
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24" style={{ background: 'linear-gradient(180deg, #f5f5f5 0%, #fef6ee 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
            Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Link Growth Plans,<br />Built for{' '}
            <span className="text-[#F97316]">Every Stage</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            No hidden fees. No long-term lock-ins. Just link building that moves the needle.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl flex flex-col transition-all duration-300 overflow-hidden group ${
                plan.highlight
                  ? 'bg-white border-2 border-[#F97316]/50 shadow-lg shadow-[#F97316]/10 hover:shadow-xl hover:shadow-[#F97316]/15 scale-[1.02]'
                  : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-[#F97316] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                    Popular
                  </span>
                </div>
              )}

              {/* Illustration header */}
              <div className="relative h-36 overflow-hidden rounded-t-2xl">
                {plan.illustration}
                {/* Plan name overlay bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4">
                  <p className="text-white font-bold text-base tracking-tight">{plan.name}</p>
                  <p className="text-white/60 text-[11px]">{plan.tagline}</p>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="mb-5">
                  <div className="flex items-end gap-1">
                    <span className="text-2xl font-black text-gray-900">{plan.price}</span>
                    <span className="text-gray-400 text-sm mb-0.5">{plan.period}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Check size={10} className="text-[#F97316]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`text-center py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? 'bg-[#F97316] text-white hover:bg-[#EA580C] hover:shadow-md hover:shadow-orange-200'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
