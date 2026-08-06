interface PlatformIconProps {
  domain: string;
  name: string;
  size?: number;
  className?: string;
}

export default function PlatformIcon({ domain, name, size = 16, className = '' }: PlatformIconProps) {
  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt={name}
      width={size}
      height={size}
      loading="lazy"
      className={`rounded-sm flex-shrink-0 ${className}`}
    />
  );
}
