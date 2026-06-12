import { useState } from 'react';
import { useDevMode } from '../context/DevModeContext';
import { formatPartOfSpeech, getDisplayExample, getIntervalLabels } from '../utils/review';
import { ReviewCardSkeleton } from './Skeleton';

function ExampleSentence({ text, word }) {
  const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <div className="mx-auto mt-5 max-w-md text-left">
      <p className="text-xs font-semibold text-[var(--color-ink)]">Example:-</p>
      <div className="mt-1.5 rounded-xl bg-[var(--color-neutral)] px-4 py-3 text-sm italic text-[var(--color-ink-muted)]">
        &ldquo;
        {parts.map((part, i) =>
          part.toLowerCase() === word.toLowerCase() ? (
            <strong key={i} className="font-semibold text-[var(--color-ink)] not-italic">
              {part}
            </strong>
          ) : (
            part
          )
        )}
        &rdquo;
      </div>
    </div>
  );
}

function CrossIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 12l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ReviewMode({
  dueWords,
  dueCount,
  loading,
  error,
  submitting,
  onReview,
  onRefresh,
}) {
  const { devMode } = useDevMode();
  const [revealed, setRevealed] = useState(false);
  const current = dueWords[0];

  async function handleOutcome(outcome) {
    if (!current || submitting) return;
    await onReview(current._id, outcome);
    setRevealed(false);
  }

  if (loading) {
    return <ReviewCardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-warn)]/40 bg-[var(--color-warn-soft)]/40 px-6 text-center">
        <p className="text-lg font-bold text-[var(--color-ink)]">Could not load reviews</p>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-ink-muted)]">{error}</p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-4 rounded-full bg-[var(--color-primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--color-primary-hover)]"
        >
          Try again
        </button>
      </div>
    );
  }

  if (dueCount === 0 || !current) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)]/60 px-6 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-tertiary)] text-xl text-[var(--color-primary)]">
          ✓
        </div>
        <p className="text-xl font-bold">All caught up!</p>
        <p className="mt-2 max-w-sm text-sm text-[var(--color-ink-muted)]">
          No words are due for review right now.
        </p>
        <button
          type="button"
          onClick={onRefresh}
          className="mt-4 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          Refresh queue
        </button>
      </div>
    );
  }

  const pos = formatPartOfSpeech(current.partOfSpeech);
  const intervals = getIntervalLabels(devMode);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-[var(--color-ink-muted)]">
          {dueCount} {dueCount === 1 ? 'word' : 'words'} due
        </p>
        <span className="rounded-full bg-[var(--color-tertiary)] px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-[var(--color-primary)] uppercase">
          Review
        </span>
      </div>

      {!revealed ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-10 text-center shadow-sm sm:py-14">
          <h2 className="text-4xl font-bold capitalize text-[var(--color-primary)] sm:text-5xl">
            {current.word}
          </h2>
          {(current.phonetic || pos) && (
            <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
              {current.phonetic}
              {current.phonetic && pos && ' · '}
              {pos && <span className="lowercase">{pos}</span>}
            </p>
          )}
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="mt-8 rounded-full bg-[var(--color-primary)] px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
          >
            Reveal definition
          </button>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-8 text-center shadow-sm sm:px-8 sm:py-10">
            <h2 className="text-3xl font-bold capitalize text-[var(--color-primary)] sm:text-4xl">
              {current.word}
            </h2>

            {(current.phonetic || pos) && (
              <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
                {current.phonetic}
                {current.phonetic && pos && ' · '}
                {pos && <span className="lowercase">{pos}</span>}
              </p>
            )}

            <div className="mx-auto mt-5 h-px w-12 bg-[var(--color-border)]" />

            <div className="mx-auto mt-5 max-w-md text-left">
              <p className="text-xs font-semibold text-[var(--color-ink)]">Definition:-</p>
              <p className="mt-1.5 text-base leading-relaxed text-[var(--color-ink-muted)]">
                {current.definition || 'No definition available.'}
              </p>
            </div>

            <ExampleSentence
              text={getDisplayExample(current.word, current.definition, current.example)}
              word={current.word}
            />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOutcome('needs_work')}
              disabled={submitting}
              className="flex flex-col items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 transition hover:bg-red-100 disabled:opacity-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-[var(--color-warn)]">
                <CrossIcon />
              </span>
              <span className="text-sm font-bold text-[var(--color-warn)]">Needs Work</span>
              <span className="text-xs text-[var(--color-warn)]/80">{intervals.needsWork}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOutcome('got_it_right')}
              disabled={submitting}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-secondary)]/40 bg-[var(--color-tertiary)] px-4 py-4 transition hover:bg-[var(--color-secondary)]/20 disabled:opacity-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-secondary)]/30 text-[var(--color-primary)]">
                <CheckIcon />
              </span>
              <span className="text-sm font-bold text-[var(--color-primary)]">Got It Right</span>
              <span className="text-xs text-[var(--color-primary)]/80">{intervals.gotItRight}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
