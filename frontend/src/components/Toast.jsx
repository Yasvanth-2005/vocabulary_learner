export default function Toast({ message, type = 'success', onDismiss }) {
  if (!message) return null;

  const styles = {
    success: 'border-[var(--color-secondary)] bg-[var(--color-tertiary)] text-[var(--color-primary)]',
    error: 'border-[var(--color-warn)] bg-[var(--color-warn-soft)] text-[var(--color-warn)]',
    info: 'border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-ink)]',
  };

  return (
    <div
      className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-lg ${styles[type]}`}
      role="status"
    >
      <div className="flex items-start justify-between gap-3">
        <p>{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="shrink-0 opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
