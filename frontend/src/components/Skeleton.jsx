function Bone({ className = '' }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden />;
}

export function WordCardSkeleton() {
  return (
    <li className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <Bone className="h-6 w-36" />
      <Bone className="mt-2 h-4 w-52" />
      <div className="mt-3 space-y-2">
        <Bone className="h-3.5 w-full" />
        <Bone className="h-3.5 w-[80%]" />
      </div>
      <Bone className="mt-4 h-3.5 w-32" />
    </li>
  );
}

export function WordListSkeleton({ count = 3 }) {
  return (
    <ul className="space-y-3" aria-label="Loading words" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <WordCardSkeleton key={i} />
      ))}
    </ul>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div aria-label="Loading review" aria-busy="true">
      <div className="mb-3 flex items-center justify-between px-1">
        <Bone className="h-3 w-16" />
        <Bone className="h-5 w-14 rounded-full" />
      </div>
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] px-6 py-10 text-center shadow-sm sm:py-14">
        <Bone className="mx-auto h-10 w-48 sm:h-12 sm:w-56" />
        <Bone className="mx-auto mt-3 h-4 w-40" />
        <Bone className="mx-auto mt-8 h-10 w-44 rounded-full" />
      </div>
    </div>
  );
}
