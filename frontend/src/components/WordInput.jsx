import { useState } from 'react';

export default function WordInput({ onAdd, loading }) {
  const [word, setWord] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed || loading) return;

    const success = await onAdd(trimmed);
    if (success) setWord('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Search a word to add…"
        disabled={loading}
        className="rounded-input flex-1 border border-[var(--color-border)] bg-[var(--color-card)] px-5 py-3.5 text-base outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-tertiary)] disabled:opacity-60"
        autoComplete="off"
        spellCheck={false}
      />
      <button
        type="submit"
        disabled={loading || !word.trim()}
        className="rounded-input flex shrink-0 items-center justify-center gap-2 bg-[var(--color-primary)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!loading && (
          <span className="text-lg leading-none font-bold" aria-hidden>
            +
          </span>
        )}
        <span>{loading ? 'Adding…' : 'Add word'}</span>
      </button>
    </form>
  );
}
