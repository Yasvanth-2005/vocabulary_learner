import {
  WORD_CARD_SHELL,
  WORD_DEFINITION_CLASS,
  WORD_FOOTER_CLASS,
  WORD_GRID_CLASS,
  WORD_META_CLASS,
  WORD_SKIP_CLASS,
  WORD_TITLE_CLASS,
} from './wordCardLayout';

function Bone({ className = '' }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden />;
}

export function WordCardSkeleton({ devMode = false }) {
  return (
    <li className={WORD_CARD_SHELL} aria-hidden>
      <div className={`${WORD_TITLE_CLASS} w-36`}>
        <Bone className="h-7 w-full" />
      </div>
      <div className={WORD_META_CLASS}>
        <Bone className="h-5 w-52 max-w-full" />
      </div>
      <div className={WORD_DEFINITION_CLASS}>
        <div className="flex h-full flex-col justify-start gap-2">
          <Bone className="h-3.5 w-full" />
          <Bone className="h-3.5 w-full" />
          <Bone className="h-3.5 w-[88%]" />
        </div>
      </div>
      <div className={WORD_FOOTER_CLASS}>
        <Bone className="h-3.5 w-3.5 shrink-0 rounded-sm" />
        <Bone className="h-3.5 w-28" />
      </div>
      <div className={WORD_SKIP_CLASS}>
        {devMode ? (
          <Bone className="h-4 w-24" />
        ) : (
          <span className="invisible">Skip to review</span>
        )}
      </div>
    </li>
  );
}

export function WordListSkeleton({ count = 12, devMode = false }) {
  return (
    <ul className={WORD_GRID_CLASS} aria-label="Loading words" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <WordCardSkeleton key={i} devMode={devMode} />
      ))}
    </ul>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div aria-label="Loading review" aria-busy="true">
      <div className="mb-3 flex min-h-5 items-center justify-between px-1">
        <Bone className="h-3 w-16" />
        <Bone className="h-5 w-14 rounded-full" />
      </div>
      <div className="min-h-[280px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-10 text-center shadow-sm sm:min-h-[320px] sm:py-14">
        <Bone className="mx-auto h-10 w-48 sm:h-12 sm:w-56" />
        <Bone className="mx-auto mt-3 h-4 w-40" />
        <Bone className="mx-auto mt-8 h-10 w-44 rounded-full" />
      </div>
    </div>
  );
}
