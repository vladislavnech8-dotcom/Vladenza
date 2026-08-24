import { Play, ArrowUpRight } from 'lucide-react';

interface Short {
  id: string;
  title: string;
}

interface Props {
  shorts?: Short[];
  title?: string;
  subtitle?: string;
}

const defaultShorts: Short[] = [
  { id: 'SjF40VJ_IXg', title: 'Link building tips' },
  { id: '_aTkizTHYyM', title: 'SEO insights' },
];

function thumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function shortUrl(id: string) {
  return `https://www.youtube.com/shorts/${id}`;
}

export default function ShortsBlock({ shorts = defaultShorts, title = 'Shorts', subtitle = 'Quick takes on link building and SEO from our YouTube channel.' }: Props) {
  return (
    <section className="py-20 md:py-24 bg-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-0.5 rounded-full bg-[#F97316]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#F97316]">YouTube</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-[1.1] tracking-tight">
              {title}
            </h2>
            <p className="text-gray-500 mt-4 text-[15px] max-w-md leading-relaxed">
              {subtitle}
            </p>
          </div>
          <a
            href="https://www.youtube.com/@serpnet"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 border border-gray-700 px-5 py-2.5 rounded-lg hover:border-gray-500 hover:text-white transition-all duration-200 shrink-0"
          >
            Visit channel <ArrowUpRight size={13} />
          </a>
        </div>

        <div className="flex flex-wrap gap-5">
          {shorts.map((s) => (
            <a
              key={s.id}
              href={shortUrl(s.id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${s.title} on YouTube`}
              className="group relative w-[210px] h-[374px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-[#F97316]/40 hover:-translate-y-1 transition-all duration-300 flex-shrink-0"
            >
              <img
                src={thumbUrl(s.id)}
                alt={s.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#F97316]/90 group-hover:bg-[#F97316] flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Play size={18} className="text-white ml-0.5" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{s.title}</p>
                <p className="text-gray-400 text-[11px] mt-1.5 flex items-center gap-1">
                  Watch on YouTube <ArrowUpRight size={11} />
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
