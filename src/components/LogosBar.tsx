import React, { useEffect, useRef, useState } from 'react';
import { Users, Globe, TrendingUp } from 'lucide-react';

const row1 = [
  { name: 'LootBar',           domain: 'lootbar.gg' },
  { name: 'AG Renovations',    domain: 'ag-renovations.co.uk' },
  { name: 'Recently Followed', domain: 'recently-followed.com' },
  { name: 'Fields Builds',     domain: 'fields-builds.com' },
  { name: 'iGMS',              domain: 'igms.com' },
  { name: 'CasinoCanada',      domain: 'casinocanada.com' },
  { name: 'Limotek',           domain: 'limotek.co.uk' },
];

const row2 = [
  { name: 'Grafbase',          domain: 'grafbase.com' },
  { name: 'CarBuzz',           domain: 'carbuzz.com' },
  { name: 'Affspace',          domain: 'affspace.org' },
  { name: 'Helpware',          domain: 'helpware.com' },
  { name: 'Calday',            domain: 'calday.com' },
  { name: 'MyImageGPT',        domain: 'myimagegpt.fr' },
  { name: 'Botnation',         domain: 'botnation.ai' },
  { name: 'Foot Africa',       domain: 'foot-africa.com' },
];

const stats = [
  { value: 8,  suffix: '+', label: 'Years delivering SEO results globally', icon: Users,      note: 'Proven track record' },
  { value: 4,  suffix: 'x', label: 'Avg. ROI within 12 months',             icon: TrendingUp, note: 'Return on investment' },
  { value: 70, suffix: '%', label: 'Client retention rate',                  icon: Globe,      note: 'Long-term partnerships' },
];

function useCountUp(target: number, duration = 1400, start = false) {
  const [count, setCount] = useState(target);
  useEffect(() => {
    if (!start) return;
    setCount(0);
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, icon: Icon, note }: { value: number; suffix: string; label: string; icon: React.ElementType; note: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const count = useCountUp(value, 1400, visible);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex flex-col items-start gap-3 px-10 py-2">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Icon size={14} className="text-[#F97316]" />
        </div>
        <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest">{note}</span>
      </div>
      <div className="text-5xl md:text-6xl font-black leading-none tabular-nums" style={{ color: '#111' }}>
        {count}<span className="text-[#F97316]">{suffix}</span>
      </div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
    </div>
  );
}

interface LogoItem { name: string; domain: string; }

function LogoChip({ name, domain }: LogoItem) {
  return (
    <div className="flex-shrink-0 flex items-center gap-2.5 bg-white border border-gray-200/70 rounded-xl px-4 py-2.5 mx-2 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 cursor-default group">
      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt={name}
          width={20}
          height={20}
          className="w-5 h-5 object-contain"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      <span className="text-gray-500 group-hover:text-gray-700 font-semibold text-[12px] tracking-tight whitespace-nowrap transition-colors">
        {name}
      </span>
    </div>
  );
}

function MarqueeRow({ items, reverse = false }: { items: LogoItem[]; reverse?: boolean }) {
  const doubled = [...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div
        className={`flex ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ width: 'max-content' }}
      >
        {doubled.map((item, i) => (
          <LogoChip key={`${item.domain}-${i}`} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function LogosBar() {
  return (
    <section className="border-y border-orange-100/80 overflow-hidden" style={{ background: 'linear-gradient(180deg, #fef3e8 0%, #fef9f5 100%)' }}>
      <div className="py-12">

        {/* Label */}
        <p className="text-center text-[11px] text-gray-400 font-semibold uppercase tracking-[0.18em] mb-8">
          Trusted by industry leaders
        </p>

        {/* Marquee rows */}
        <div className="flex flex-col gap-3 mb-12">
          {/* Fade masks */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fef3e8, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fef9f5, transparent)' }} />
            <MarqueeRow items={row1} />
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #fef3e8, transparent)' }} />
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #fef9f5, transparent)' }} />
            <MarqueeRow items={row2} reverse />
          </div>
        </div>

        {/* Stats strip */}
        <div className="max-w-6xl mx-auto px-6 mt-10">
          <div className="relative rounded-2xl overflow-hidden border border-orange-100/80 bg-white/80 backdrop-blur-sm">
            {/* top accent line */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#F97316] to-transparent opacity-40" />
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-orange-100/60 py-2">
              {stats.map((s) => (
                <StatItem key={s.label} {...s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
