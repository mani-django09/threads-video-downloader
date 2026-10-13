const STEPS = ['Checking the link', 'Fetching the media', 'Getting your preview ready'];

export function LoadingState({ step = 0 }: { step?: number }) {
  const current = Math.min(step, STEPS.length - 1);

  return (
    <div
      className="animate-fadeUp overflow-hidden rounded-3xl border border-line bg-white p-5 shadow-card sm:p-6"
      role="status"
      aria-live="polite"
    >
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={label} className="flex items-center gap-2.5 text-sm">
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-accent text-white' : 'bg-brand-soft text-ink-3'
                }`}
              >
                {done ? '✓' : active ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : i + 1}
              </span>
              <span className={active ? 'font-semibold text-ink' : done ? 'text-ink-2' : 'text-ink-3'}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr]">
        <div className="skeleton aspect-[9/16] max-h-64 w-full animate-shimmer rounded-2xl sm:max-h-none" />
        <div className="space-y-3 py-1">
          <div className="skeleton h-5 w-24 animate-shimmer rounded-full" />
          <div className="skeleton h-4 w-full animate-shimmer rounded" />
          <div className="skeleton h-4 w-4/5 animate-shimmer rounded" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="skeleton h-14 animate-shimmer rounded-xl" />
            <div className="skeleton h-14 animate-shimmer rounded-xl" />
            <div className="skeleton h-14 animate-shimmer rounded-xl" />
          </div>
          <div className="skeleton mt-4 h-12 w-full animate-shimmer rounded-full" />
        </div>
      </div>
    </div>
  );
}
