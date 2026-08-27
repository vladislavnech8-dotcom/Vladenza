import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onGetQuote: () => void;
}

export default function Hero({ onGetQuote }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden pt-[86px]"
      style={{ background: 'linear-gradient(160deg, #ffffff 0%, #fff7f0 60%, #fef3e8 100%)' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-white pointer-events-none" />

      {/* Background vectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="1100" cy="0" rx="500" ry="400" fill="url(#heroGlow)"/>
        <circle cx="1150" cy="80" r="420" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.12"/>
        <circle cx="1150" cy="80" r="320" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
        <circle cx="1150" cy="80" r="220" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.09"/>
        <circle cx="1150" cy="80" r="120" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.12"/>
        {Array.from({ length: 9 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => (
            <circle key={`hero-${row}-${col}`} cx={col * 44 + 30} cy={row * 44 + 320} r="2.5" fill="#F97316" opacity={0.07 + col * 0.012} />
          ))
        )}
        <line x1="0" y1="600" x2="400" y2="0" stroke="#F97316" strokeWidth="1" opacity="0.06"/>
        <line x1="60" y1="640" x2="460" y2="40" stroke="#F97316" strokeWidth="0.8" opacity="0.04"/>
        <path d="M 40 110 L 20 110 L 20 210 L 40 210" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="110" y1="280" x2="110" y2="360" stroke="#F97316" strokeWidth="2.5" opacity="0.18" strokeLinecap="round"/>
        <line x1="70" y1="320" x2="150" y2="320" stroke="#F97316" strokeWidth="2.5" opacity="0.18" strokeLinecap="round"/>
        <line x1="0" y1="88" x2="600" y2="88" stroke="#F97316" strokeWidth="1" opacity="0.08" strokeDasharray="4 8"/>
      </svg>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center text-center">

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto text-balance">
          Link Building Services for{' '}
          <span className="text-[#F97316]">Search</span>
          {' and '}
          <span className="text-[#F97316]">AI Visibility</span>
        </h1>

        <p className="text-gray-500 text-lg md:text-xl leading-relaxed mb-9 max-w-2xl mx-auto">
          Linkbuilding service that improve Google rankings, strengthen your presence in AI search, and turn qualified traffic into revenue.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGetQuote}
            className="flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#ea6c0a] text-white font-semibold px-9 py-4 rounded-full text-base transition-all duration-200 hover:shadow-lg hover:shadow-orange-200 group"
          >
            Get a Custom Quote
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
}
