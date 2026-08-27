import { Search, Map, Link2, BarChart2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    num: 1,
    title: 'Website & Competitor Analysis',
    desc: 'We audit your site and study top competitors to identify link gaps, anchor patterns, and quick-win opportunities.',
  },
  {
    icon: Map,
    num: 2,
    title: 'Link Strategy & Anchor Planning',
    desc: 'A custom link building roadmap is created based on your niche, domain authority, and growth goals.',
  },
  {
    icon: Link2,
    num: 3,
    title: 'Monthly Link Operations',
    desc: 'Our team manually builds high-quality backlinks through guest posts, niche inserts, and crowd placements.',
  },
  {
    icon: BarChart2,
    num: 4,
    title: 'Reporting & Optimization',
    desc: 'You receive full transparency with monthly reports covering all links placed, anchors used, and ranking shifts.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #f7f7f7 0%, #fdf6f0 100%)' }}>
      {/* HowItWorks background vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="howGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.11"/>
            <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Glow blob bottom-right */}
        <ellipse cx="1400" cy="700" rx="450" ry="350" fill="url(#howGlow)"/>
        {/* Big S-curve wave across section */}
        <path d="M 0 320 C 300 180, 600 500, 900 320 S 1200 140, 1500 320" stroke="#F97316" strokeWidth="2" fill="none" opacity="0.1" strokeDasharray="12 18"/>
        <path d="M 0 360 C 300 220, 600 540, 900 360 S 1200 180, 1500 360" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.07" strokeDasharray="8 20"/>
        {/* Dot grid top-left */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => (
            <circle key={`how-${row}-${col}`} cx={col * 40 + 20} cy={row * 40 + 30} r="2.5" fill="#F97316" opacity={0.07 + row * 0.01} />
          ))
        )}
        {/* Concentric circles bottom-right — big and bold */}
        <circle cx="1420" cy="820" r="280" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.1"/>
        <circle cx="1420" cy="820" r="200" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
        <circle cx="1420" cy="820" r="120" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.14"/>
        <circle cx="1420" cy="820" r="50" fill="none" stroke="#F97316" strokeWidth="3" opacity="0.18"/>
        {/* Rotated diamonds top-right */}
        <rect x="1260" y="40" width="32" height="32" transform="rotate(45 1276 56)" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.2"/>
        <rect x="1320" y="50" width="20" height="20" transform="rotate(45 1330 60)" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.14"/>
        <rect x="1370" y="30" width="14" height="14" transform="rotate(45 1377 37)" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
        {/* Left vertical accent bar */}
        <line x1="24" y1="450" x2="24" y2="750" stroke="#F97316" strokeWidth="3" opacity="0.12" strokeLinecap="round"/>
        <circle cx="24" cy="450" r="5" fill="#F97316" opacity="0.2"/>
        <circle cx="24" cy="600" r="5" fill="#F97316" opacity="0.16"/>
        <circle cx="24" cy="750" r="5" fill="#F97316" opacity="0.2"/>
      </svg>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-[#F97316] text-xs font-semibold uppercase tracking-wide mb-5">
            Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            From strategy to{' '}
            <span className="text-[#F97316]">measurable link growth</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            A proven 4-step system that delivers measurable results within weeks, not months.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="hidden lg:block absolute top-[28px] left-[calc(12.5%)] right-[calc(12.5%)] h-px bg-gray-200 z-0" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center text-center group">
                <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center mb-5 group-hover:border-[#F97316]/40 group-hover:shadow-sm transition-all duration-300 relative z-10">
                  <step.icon size={18} className="text-[#F97316]" />
                </div>
                <div className="text-[#F97316] text-xs font-bold mb-1">Step {step.num}</div>
                <h3 className="text-gray-900 font-semibold text-sm mb-2 leading-tight">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Traditional Way — 6–9 months</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="grid grid-cols-5 gap-1 mb-2">
                {['Research', 'Planning', 'Outreach', 'Wait...', 'Results?'].map((l) => (
                  <div key={l} className="text-center">
                    <div className="h-2 bg-gray-100 rounded-full mb-1" />
                    <span className="text-[10px] text-gray-300">{l}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-0.5 bg-[#F97316]/30" />
                <span className="text-xs text-[#F97316] font-semibold uppercase tracking-widest">Our Systematic Way — 1–2 months</span>
                <div className="flex-1 h-0.5 bg-[#F97316]/30" />
              </div>
              <div className="grid grid-cols-4 gap-1">
                {steps.map((s) => (
                  <div key={s.num} className="text-center">
                    <div className="h-2 bg-[#F97316]/20 rounded-full mb-1 border border-[#F97316]/30" />
                    <span className="text-[10px] text-gray-400 leading-tight block">{s.title.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
