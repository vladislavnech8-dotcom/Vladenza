import { Youtube, Play, ExternalLink } from 'lucide-react';

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
];

function thumbUrl(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function shortUrl(id: string) {
  return `https://www.youtube.com/shorts/${id}`;
}

export default function ShortsBlock({ shorts = defaultShorts, title = 'Watch our Shorts', subtitle = 'Quick insights on link building and SEO — straight from our YouTube channel.' }: Props) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 text-red-600 text-xs font-semibold mb-5 tracking-wide uppercase">
            <Youtube size={14} />
            YouTube Shorts
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-500 text-sm max-w-lg mx-auto">{subtitle}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {shorts.map((short) => (
            <a
              key={short.id}
              href={shortUrl(short.id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Watch ${short.title} on YouTube`}
              className="group relative w-[200px] h-[356px] rounded-2xl overflow-hidden bg-gray-900 border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#F97316]/40 transition-all duration-300 flex-shrink-0"
            >
              <img
                src={thumbUrl(short.id)}
                alt={short.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                  <Play size={22} className="text-red-600 ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between gap-3">
                <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{short.title}</p>
                <ExternalLink size={15} className="text-white/80 flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
