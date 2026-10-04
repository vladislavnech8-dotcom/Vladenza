import { useState } from 'react';

interface VisualAssetProps {
  src: string;
  alt?: string;
  width: number;
  height: number;
  className?: string;
  objectPosition?: string;
  priority?: boolean;
  tone?: 'cream' | 'navy' | 'white';
}

export default function VisualAsset({ src, alt = '', width, height, className = '', objectPosition = 'center', priority = false, tone = 'cream' }: VisualAssetProps) {
  const [missing, setMissing] = useState(false);
  const toneClass = tone === 'navy' ? 'bg-navy border-white/15' : tone === 'white' ? 'bg-white border-ink/15' : 'bg-cream border-ink/15';

  return (
    <div className={`relative overflow-hidden border-2 ${toneClass} ${className}`} style={{ aspectRatio: `${width} / ${height}` }}>
      {!missing ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setMissing(true)}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
        />
      ) : (
        <div className="paper-grain flex h-full w-full items-center justify-center p-6" aria-label="Visual asset placeholder">
          <div className="relative h-16 w-24 border-2 border-signal/70">
            <span className="absolute -right-3 -top-3 h-6 w-6 border-2 border-signal" />
            <span className="absolute -bottom-3 -left-3 h-6 w-6 bg-signal" />
          </div>
        </div>
      )}
    </div>
  );
}
