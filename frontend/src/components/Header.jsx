import { useState } from 'react';
import { useDevMode } from '../context/DevModeContext';
import TerminalIcon from './TerminalIcon';
import DevSettingsModal from './DevSettingsModal';

export default function Header({ onTimeAdvanced }) {
  const { devMode } = useDevMode();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-neutral)]">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <TerminalIcon />
            </div>
            <span className="text-lg font-bold text-[var(--color-primary)] sm:text-xl">
              Vocab Builder
            </span>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] font-semibold tracking-wide uppercase transition ${
              devMode
                ? 'bg-[var(--color-primary)] text-[var(--color-tertiary)]'
                : 'border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-ink-muted)] hover:border-[var(--color-secondary)]'
            }`}
            aria-label="Open dev mode settings"
          >
            <TerminalIcon className={devMode ? 'text-[var(--color-tertiary)]' : 'text-[var(--color-primary)]'} />
            {devMode ? 'Dev Mode: On' : 'Dev Mode: Off'}
          </button>
        </div>
      </header>

      <DevSettingsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTimeAdvanced={(msg) => {
          onTimeAdvanced?.(msg);
          if (!msg) setModalOpen(false);
        }}
      />
    </>
  );
}
