import { TrendingUp, Link2, Globe, ArrowUpRight } from 'lucide-react';

const trafficBars = [18, 24, 20, 32, 28, 40, 44, 52, 60, 72, 80, 96];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const max = Math.max(...trafficBars);

const links = [
  { domain: 'techcrunch.com', dr: 92, dofollow: true },
  { domain: 'forbes.com', dr: 94, dofollow: true },
  { domain: 'searchenginejournal.com', dr: 88, dofollow: true },
  { domain: 'ahrefs.com', dr: 91, dofollow: false },
];

function DrGauge({ value, max: gaugeMax = 100 }: { value: number; max?: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = (value / gaugeMax) * circ * 0.75;

  return (
    <svg viewBox="0 0 96 96" className="w-full h-full" style={{ transform: 'rotate(135deg)' }}>
      <circle cx="48" cy="48" r={r} fill="none" stroke="#1f2937" strokeWidth="8" strokeDasharray={`${circ * 0.75} ${circ}`} strokeLinecap="round" />
      <circle cx="48" cy="48" r={r} fill="none" stroke="#F97316" strokeWidth="8" strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }} />
    </svg>
  );
}

interface CTAProps {
  onOpenModal: () => void;
}

export default function CTA({ onOpenModal }: CTAProps) {
  return (
    <section id="contact" className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[400px] opacity-10 pointer-events-none">
        <div className="w-full h-full bg-[#F97316] rounded-full blur-[100px]" />
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="ctaGlowL2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#F97316" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="-80" cy="300" rx="380" ry="300" fill="url(#ctaGlowL2)"/>
        <circle cx="-40" cy="300" r="340" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.18"/>
        <circle cx="-40" cy="300" r="240" fill="none" stroke="#F97316" strokeWidth="2" opacity="0.22"/>
        <circle cx="-40" cy="300" r="140" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.28"/>
        <circle cx="-40" cy="300" r="60" fill="none" stroke="#F97316" strokeWidth="3" opacity="0.35"/>
        <line x1="1440" y1="0" x2="700" y2="600" stroke="#F97316" strokeWidth="1.5" opacity="0.1"/>
        <line x1="1440" y1="0" x2="900" y2="600" stroke="#F97316" strokeWidth="1" opacity="0.07"/>
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => (
            <circle key={`cta2-${row}-${col}`} cx={1120 + col * 44} cy={360 + row * 44} r="2.5" fill="#F97316" opacity={0.12 + col * 0.01} />
          ))
        )}
        <polyline points="60,500 110,450 60,400" fill="none" stroke="#F97316" strokeWidth="3" opacity="0.22" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="100,510 150,460 100,410" fill="none" stroke="#F97316" strokeWidth="2.5" opacity="0.14" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-orange-300 text-xs font-semibold uppercase tracking-wide mb-6">
              Get Started Today
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Ready to scale your<br />
              <span className="text-[#F97316]">organic growth?</span>
            </h2>
            <p className="text-gray-400 text-base mb-8 leading-relaxed max-w-lg">
              Get your personalized link strategy. No commitments, no fluff — just a clear plan built for your niche and goals.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button
                onClick={onOpenModal}
                className="bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold px-7 py-3 rounded-lg text-sm transition-all duration-200 hover:shadow-lg hover:shadow-orange-900/40 flex items-center gap-2"
              >
                Get Proposal <ArrowUpRight size={14} />
              </button>
              <button
                onClick={onOpenModal}
                className="border border-white/20 hover:border-white/30 text-gray-300 hover:text-white px-7 py-3 rounded-lg text-sm transition-all duration-200 hover:bg-white/5"
              >
                Book a Call
              </button>
            </div>
          </div>

          {/* Analytics widget */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Domain Rating</p>
                <div className="relative w-20 h-20">
                  <DrGauge value={68} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ paddingTop: '6px' }}>
                    <span className="text-white font-black text-xl leading-none">68</span>
                    <span className="text-[#F97316] text-[9px] font-bold mt-0.5">+26 pts</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-2">
                  <Link2 size={11} className="text-[#F97316]" />
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Backlinks</p>
                </div>
                <div>
                  <p className="text-white font-black text-2xl leading-none">4,210</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={10} className="text-green-400" />
                    <span className="text-green-400 text-[11px] font-semibold">+847 this month</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-2">
                  <Globe size={11} className="text-[#F97316]" />
                  <p className="text-gray-400 text-[10px] uppercase tracking-widest">Keywords</p>
                </div>
                <div>
                  <p className="text-white font-black text-2xl leading-none">1,893</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={10} className="text-green-400" />
                    <span className="text-green-400 text-[11px] font-semibold">312 top-10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-400 text-[10px] uppercase tracking-widest">Organic Traffic</p>
                <span className="text-[#F97316] text-xs font-bold bg-[#F97316]/10 px-2 py-0.5 rounded-full">+432% YoY</span>
              </div>
              <div className="flex items-end gap-1 h-14">
                {trafficBars.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${(h / max) * 56}px`,
                        background: i >= trafficBars.length - 3
                          ? '#F97316'
                          : `rgba(249,115,22,${0.2 + (i / trafficBars.length) * 0.4})`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {months.filter((_, i) => i % 3 === 0).map(m => (
                  <span key={m} className="text-[9px] text-gray-600 font-medium">{m}</span>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-3">Recent Links Placed</p>
              <div className="flex flex-col gap-2">
                {links.map((l, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] flex-shrink-0" />
                      <span className="text-gray-300 text-xs font-mono">{l.domain}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/80 bg-white/5 px-1.5 py-0.5 rounded">DR {l.dr}</span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${l.dofollow ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-white/5'}`}>
                        {l.dofollow ? 'DoFollow' : 'NoFollow'}
                      </span>
                    </div>
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
