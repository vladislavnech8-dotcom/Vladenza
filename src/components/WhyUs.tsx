import { Target, BarChart2, Layers, TrendingUp, Users, Shield, Zap, Award } from 'lucide-react';

const topFeatures = [
  {
    icon: Target,
    title: 'Expertise in Hard Niches',
    desc: 'Deep understanding of competitive markets like iGaming, SaaS, and crypto where standard SEO doesn\'t work.',
  },
  {
    icon: BarChart2,
    title: 'Transparent Reporting',
    desc: 'Clear reports with full visibility into links, anchors, and monthly progress.',
  },
  {
    icon: Layers,
    title: 'Scalable Link Operations',
    desc: 'Proven processes built on real experience, designed to scale without losing quality.',
  },
  {
    icon: TrendingUp,
    title: 'Results-Driven Approach',
    desc: 'No shortcuts or hype — only tested systems focused on rankings, traffic, and revenue.',
  },
];

const bottomFeatures = [
  { icon: Users, title: 'Human QC on Every Link', desc: 'Every link is manually reviewed before reporting to ensure placement quality and relevance.' },
  { icon: Shield, title: 'Predictable Link Growth', desc: 'Backlink acquisition follows a natural, risk-free velocity to protect your domain\'s health.' },
  { icon: Zap, title: 'Risk-Free Scaling', desc: 'We scale campaigns systematically while monitoring anchor ratios and domain diversity.' },
  { icon: Award, title: 'Results-Driven Approach', desc: 'Monthly reporting with clear attribution to traffic and ranking improvements.' },
];

export default function WhyUs() {
  return (
    <section id="about" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fffcf9 100%)' }}>
      {/* WhyUs background vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="whyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Glow blob center-right */}
        <ellipse cx="1300" cy="400" rx="400" ry="350" fill="url(#whyGlow)"/>
        {/* Hexagon grid top-right — larger and more visible */}
        <g stroke="#F97316" strokeWidth="1.5" fill="none">
          <polygon points="1160,30 1210,58 1210,116 1160,144 1110,116 1110,58" opacity="0.12"/>
          <polygon points="1260,30 1310,58 1310,116 1260,144 1210,116 1210,58" opacity="0.1"/>
          <polygon points="1360,30 1410,58 1410,116 1360,144 1310,116 1310,58" opacity="0.08"/>
          <polygon points="1210,144 1260,172 1260,230 1210,258 1160,230 1160,172" opacity="0.1"/>
          <polygon points="1310,144 1360,172 1360,230 1310,258 1260,230 1260,172" opacity="0.08"/>
          <polygon points="1110,144 1160,172 1160,230 1110,258 1060,230 1060,172" opacity="0.07"/>
        </g>
        {/* Dot grid bottom-left */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 6 }).map((_, col) => (
            <circle key={`why-${row}-${col}`} cx={col * 42 + 20} cy={row * 42 + 500} r="2.5" fill="#F97316" opacity={0.08 + col * 0.012} />
          ))
        )}
        {/* Big decorative arcs */}
        <path d="M 0 600 Q 300 350 600 550" stroke="#F97316" strokeWidth="2" fill="none" opacity="0.1" strokeDasharray="10 16"/>
        <path d="M 0 650 Q 320 400 640 590" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.07" strokeDasharray="6 18"/>
        {/* Cross accent top-left */}
        <line x1="60" y1="60" x2="60" y2="140" stroke="#F97316" strokeWidth="3" opacity="0.18" strokeLinecap="round"/>
        <line x1="20" y1="100" x2="100" y2="100" stroke="#F97316" strokeWidth="3" opacity="0.18" strokeLinecap="round"/>
        {/* Second smaller cross */}
        <line x1="140" y1="50" x2="140" y2="90" stroke="#F97316" strokeWidth="2" opacity="0.12" strokeLinecap="round"/>
        <line x1="120" y1="70" x2="160" y2="70" stroke="#F97316" strokeWidth="2" opacity="0.12" strokeLinecap="round"/>
      </svg>
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            Built for Competitive Niches<br />with{' '}
            <span className="text-[#F97316]">Proven Systems</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            We've spent years building authority for sites in the most competitive verticals. Our systems are built for precision and scale.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {topFeatures.map((f) => (
            <div key={f.title} className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:border-[#F97316]/20 hover:shadow-sm transition-all duration-300">
              <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                <f.icon size={16} className="text-[#F97316]" />
              </div>
              <h3 className="text-gray-900 font-semibold text-sm mb-2">{f.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400 font-medium">Backlink Expansion</span>
                  <span className="text-xs text-[#F97316] font-bold bg-orange-50 px-2 py-0.5 rounded-full">+300</span>
                </div>
                <div className="flex items-end gap-1 h-16">
                  {[2, 3, 4, 5, 6, 8, 10, 13, 16].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#F97316] rounded-t opacity-80"
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Last Month</p>
              </div>
            </div>

            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {bottomFeatures.map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon size={14} className="text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold text-xs mb-1">{f.title}</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
