import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useDevMode } from '../context/DevModeContext';
import { api } from '../api/client';
import { showToast } from '../store/slices/uiSlice';
import { formatNextReviewLabel } from '../utils/review';
import { WordListSkeleton } from './Skeleton';

const SORT_OPTIONS = [
  { id: 'newest', label: 'Recent first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'az', label: 'Alphabetical (A–Z)' },
  { id: 'za', label: 'Alphabetical (Z–A)' },
];

const PAGE_SIZE = 12;

function SortIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M7 12h10M10 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.2 4.2L17.5 8 13.2 9.2 12 13.5 10.8 9.2 6.5 8l4.3-1.8L12 2zM5 14l.8 2.8L8.5 18l-2.7 1.2L5 22l-.8-2.8L1.5 18l2.7-1.2L5 14zM19 14l.8 2.8L22.5 18l-2.7 1.2L19 22l-.8-2.8L15.5 18l2.7-1.2L19 14z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

function WordCard({ word, devMode, onSkip, onError }) {
  const review = formatNextReviewLabel(word.nextReviewAt, devMode);

  async function handleSkip() {
    try {
      await api.skipToReview(word._id, devMode);
      onSkip?.();
    } catch (err) {
      onError(err.message);
    }
  }

  return (
    <li className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm">
      <h3 className="text-xl font-bold capitalize text-[var(--color-ink)]">{word.word}</h3>
      {(word.phonetic || word.partOfSpeech) && (
        <p className="mt-0.5 font-mono text-sm text-[var(--color-ink-muted)]">
          {word.phonetic}
          {word.phonetic && word.partOfSpeech && ' · '}
          {word.partOfSpeech && word.partOfSpeech.replace(/_/g, ' ')}
        </p>
      )}

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {word.definition}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[var(--color-primary)]">
        <CalendarIcon />
        <span>{review.long}</span>
      </div>

      {devMode && (
        <button
          type="button"
          onClick={handleSkip}
          className="mt-3 text-left text-xs font-medium text-[var(--color-secondary)] hover:underline"
        >
          Skip to review
        </button>
      )}
    </li>
  );
}

function AddMoreCard() {
  function scrollToAddWord() {
    document.getElementById('add-word')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    document.querySelector('#add-word input')?.focus();
  }

  return (
    <li
      className="flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)]/60 p-5 text-center transition hover:border-[var(--color-secondary)] hover:bg-[var(--color-tertiary)]/40"
      onClick={scrollToAddWord}
      onKeyDown={(e) => e.key === 'Enter' && scrollToAddWord()}
      role="button"
      tabIndex={0}
    >
      <SparkleIcon />
      <p className="mt-3 text-sm text-[var(--color-ink-muted)]">Add more words to grow your library</p>
    </li>
  );
}

function SortMenu({ sortBy, onChange }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`rounded-lg p-2 transition hover:bg-[var(--color-tertiary)] ${
          open ? 'bg-[var(--color-tertiary)] text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)]'
        }`}
        aria-label="Sort words"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <SortIcon />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 z-20 mt-2 min-w-[200px] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-lg"
          role="listbox"
          aria-label="Sort options"
        >
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={sortBy === option.id}
              onClick={() => {
                onChange(option.id);
                setOpen(false);
              }}
              className={`flex w-full items-center px-4 py-2.5 text-left text-sm transition hover:bg-[var(--color-tertiary)] ${
                sortBy === option.id
                  ? 'font-semibold text-[var(--color-primary)]'
                  : 'text-[var(--color-ink-muted)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function WordList({ reloadKey = 0, onSkipReview }) {
  const dispatch = useDispatch();
  const { devMode } = useDevMode();
  const [words, setWords] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, sortBy]);

  useEffect(() => {
    let cancelled = false;

    async function loadWords() {
      setLoading(true);
      try {
        const data = await api.listWords(
          { page, limit: PAGE_SIZE, search: debouncedQuery, sort: sortBy },
          devMode
        );
        if (!cancelled) {
          setWords(data.words);
          setPagination(data.pagination);
        }
      } catch (err) {
        if (!cancelled) {
          dispatch(showToast({ message: err.message, type: 'error' }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWords();
    return () => {
      cancelled = true;
    };
  }, [page, debouncedQuery, sortBy, devMode, reloadKey, refreshCounter, dispatch]);

  function handleSkipReview() {
    onSkipReview?.();
    setRefreshCounter((n) => n + 1);
  }

  function handleError(message) {
    dispatch(showToast({ message, type: 'error' }));
  }

  const isInitialLoad = loading && pagination === null;
  const isEmptyLibrary = !loading && pagination?.total === 0 && !debouncedQuery;

  if (isEmptyLibrary) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)]/60 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-[var(--color-ink)]">No words yet</p>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Add your first vocabulary word above to get started.
        </p>
      </div>
    );
  }

  if (isInitialLoad) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[var(--color-ink)]">Your Library</h2>
          <div className="flex items-center gap-2 opacity-40">
            <SortIcon />
            <SearchIcon />
          </div>
        </div>
        <WordListSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[var(--color-ink)]">Your Library</h2>
        <div className="flex items-center gap-2">
          <SortMenu sortBy={sortBy} onChange={setSortBy} />
          <button
            type="button"
            onClick={() => setShowSearch((v) => !v)}
            className={`rounded-lg p-2 transition hover:bg-[var(--color-tertiary)] ${
              showSearch || debouncedQuery ? 'bg-[var(--color-tertiary)] text-[var(--color-primary)]' : 'text-[var(--color-ink-muted)]'
            }`}
            aria-label="Search words"
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      {showSearch && (
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your library…"
          className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-tertiary)]"
        />
      )}

      {loading ? (
        <WordListSkeleton count={6} />
      ) : words.length === 0 ? (
        <p className="py-8 text-center text-sm text-[var(--color-ink-muted)]">
          No words match your search.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {words.map((w) => (
            <WordCard
              key={w._id}
              word={w}
              devMode={devMode}
              onSkip={handleSkipReview}
              onError={handleError}
            />
          ))}
          {words.length < PAGE_SIZE && <AddMoreCard />}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1 || loading}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] disabled:opacity-40"
          >
            Previous
          </button>
          <p className="text-xs text-[var(--color-ink-muted)]">
            Page {pagination.page} of {pagination.totalPages}
            <span className="hidden sm:inline"> · {pagination.total} words</span>
          </p>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasMore || loading}
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)] disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
