interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="animate-fadeUp flex items-start gap-3.5 rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50 to-white p-4 text-left sm:p-5"
      role="alert"
    >
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 8v5M12 16.5h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-rose-900">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-1.5 text-sm font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
