import { useEffect } from 'react';
import { useDevMode } from '../context/DevModeContext';
import { api } from '../api/client';
import TerminalIcon from './TerminalIcon';

export default function DevSettingsModal({ open, onClose, onTimeAdvanced }) {
  const { devMode, toggleDevMode } = useDevMode();

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  async function handleAdvanceTime(days) {
    try {
      await api.advanceTime(days, true);
      onTimeAdvanced?.();
    } catch (err) {
      onTimeAdvanced?.(err.message);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close modal"
      />

      <div
        className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dev-settings-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-semibold tracking-widest text-[var(--color-ink-muted)] uppercase">
              Developer
            </p>
            <h2 id="dev-settings-title" className="mt-1 text-lg font-bold text-[var(--color-ink)]">
              Dev Mode &amp; Intervals
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-ink-muted)] hover:bg-[var(--color-tertiary)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-[var(--color-tertiary)] p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink)]">Dev Mode</p>
              <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                Compress review intervals for testing
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDevMode}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                devMode ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-secondary)]/40'
              }`}
              aria-pressed={devMode}
              aria-label="Toggle dev mode"
            >
              <span
                className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  devMode ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[var(--color-border)] p-4">
          <p className="font-mono text-[10px] font-semibold tracking-widest text-[var(--color-ink-muted)] uppercase">
            Review Intervals
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--color-ink-muted)]">Needs work</span>
              <span className="font-semibold text-[var(--color-primary)]">
                {devMode ? '1 minute' : '1 day'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[var(--color-ink-muted)]">Got it right</span>
              <span className="font-semibold text-[var(--color-primary)]">
                {devMode ? '3 minutes' : '3 days'}
              </span>
            </div>
          </div>
        </div>

        {devMode && (
          <div className="mt-4">
            <p className="mb-2 font-mono text-[10px] font-semibold tracking-widest text-[var(--color-ink-muted)] uppercase">
              Simulate Time
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleAdvanceTime(1)}
                className="rounded-full bg-[var(--color-tertiary)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/30"
              >
                Advance 1 day
              </button>
              <button
                type="button"
                onClick={() => handleAdvanceTime(3)}
                className="rounded-full bg-[var(--color-tertiary)] px-4 py-2 text-xs font-semibold text-[var(--color-primary)] hover:bg-[var(--color-secondary)]/30"
              >
                Advance 3 days
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-[var(--color-neutral)] px-3 py-2.5">
          <TerminalIcon className="text-[var(--color-primary)]" />
          <p className="text-xs text-[var(--color-ink-muted)]">
            {devMode
              ? 'Dev Mode is on — reviewers can test the full lifecycle in minutes.'
              : 'Turn on Dev Mode to test spaced repetition without waiting days.'}
          </p>
        </div>
      </div>
    </div>
  );
}
