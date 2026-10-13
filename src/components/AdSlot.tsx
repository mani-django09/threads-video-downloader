interface AdSlotProps {
  /** Identifies placement for analytics/config, e.g. "below-hero", "result-page". */
  slot: string;
  className?: string;
  variant?: 'banner' | 'square' | 'leaderboard';
}

const SIZE_CLASSES: Record<NonNullable<AdSlotProps['variant']>, string> = {
  banner: 'min-h-[100px]',
  square: 'min-h-[250px] max-w-[300px]',
  leaderboard: 'min-h-[90px]',
};

/**
 * Reserves layout space for an ad unit so its arrival never causes layout
 * shift. Wire an actual ad network (AdSense etc.) here later behind
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID; renders nothing visually intrusive when unset.
 */
export function AdSlot({ slot, className = '', variant = 'banner' }: AdSlotProps) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <div
      data-ad-slot={slot}
      className={`container-app my-2 flex w-full items-center justify-center ${className}`}
      aria-hidden={!adsenseClient}
    >
      <div
        className={`flex w-full items-center justify-center rounded-xl border border-dashed border-line bg-brand-soft/50 text-xs font-medium text-ink-3 ${SIZE_CLASSES[variant]}`}
      >
        {adsenseClient ? null : 'Advertisement'}
      </div>
    </div>
  );
}
