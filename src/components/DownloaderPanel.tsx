import { Downloader } from './Downloader';

interface DownloaderPanelProps {
  className?: string;
  ctaLabel?: string;
  placeholder?: string;
}

/**
 * The animated-gradient frame around the URL input, shared by every page that
 * embeds the downloader. Defined once so the look stays identical everywhere.
 */
export function DownloaderPanel({ className = '', ctaLabel, placeholder }: DownloaderPanelProps) {
  return (
    <div className={`glow-border w-full ${className}`}>
      <div className="rounded-[calc(2rem-1.5px)] bg-white/95 p-3 backdrop-blur-xl sm:p-4">
        <Downloader ctaLabel={ctaLabel} placeholder={placeholder} />
      </div>
    </div>
  );
}
