import { useCallback, useEffect, useState } from 'react';
import { api } from './api/client';
import { DevModeProvider, useDevMode } from './context/DevModeContext';
import Header from './components/Header';
import WordInput from './components/WordInput';
import WordList from './components/WordList';
import ReviewMode from './components/ReviewMode';
import Toast from './components/Toast';

function AppContent() {
  const { devMode } = useDevMode();
  const [tab, setTab] = useState('library');
  const [dueWords, setDueWords] = useState([]);
  const [dueCount, setDueCount] = useState(0);
  const [libraryReload, setLibraryReload] = useState(0);
  const [loadingDue, setLoadingDue] = useState(true);
  const [adding, setAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  }, []);

  const refreshLibrary = useCallback(() => {
    setLibraryReload((n) => n + 1);
  }, []);

  const refreshDue = useCallback(async () => {
    setLoadingDue(true);
    try {
      const [countData, dueData] = await Promise.all([
        api.getDueCount(devMode),
        api.getDueWords(devMode),
      ]);
      setDueCount(countData.count);
      setDueWords(dueData);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingDue(false);
    }
  }, [devMode, showToast]);

  useEffect(() => {
    refreshDue();
  }, [refreshDue]);

  async function handleAddWord(word) {
    setAdding(true);
    try {
      await api.addWord(word, devMode);
      showToast(`"${word}" added to your library.`);
      refreshLibrary();
      await refreshDue();
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    } finally {
      setAdding(false);
    }
  }

  async function handleReview(id, outcome) {
    setSubmitting(true);
    try {
      await api.submitReview(id, outcome, devMode);
      setDueWords((prev) => prev.filter((w) => w._id !== id));
      setDueCount((prev) => Math.max(0, prev - 1));
      refreshLibrary();
    } catch (err) {
      showToast(err.message, 'error');
      await refreshDue();
    } finally {
      setSubmitting(false);
    }
  }

  function handleTimeAdvanced(errorMessage) {
    if (errorMessage) {
      showToast(errorMessage, 'error');
    } else {
      showToast('Time advanced — check your review queue.', 'info');
      refreshDue();
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]">
      <Header onTimeAdvanced={handleTimeAdvanced} />

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex justify-center">
          <nav className="inline-flex rounded-full bg-[var(--color-tertiary)] p-1">
            <button
              type="button"
              onClick={() => setTab('library')}
              className={`rounded-full px-5 py-1.5 text-xs font-semibold transition ${
                tab === 'library'
                  ? 'bg-[var(--color-card)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-muted)]'
              }`}
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => setTab('review')}
              className={`flex items-center gap-1.5 rounded-full px-5 py-1.5 text-xs font-semibold transition ${
                tab === 'review'
                  ? 'bg-[var(--color-card)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-muted)]'
              }`}
            >
              Review
              {!loadingDue && dueCount > 0 && (
                <span
                  className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ${
                    tab === 'review'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-ink-muted)]/20 text-[var(--color-ink-muted)]'
                  }`}
                >
                  {dueCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {tab === 'library' && (
          <section className="space-y-6">
            <WordInput onAdd={handleAddWord} loading={adding} />
            <WordList
              reloadKey={libraryReload}
              onSkipReview={refreshDue}
              onRefresh={showToast}
            />
          </section>
        )}

        {tab === 'review' && (
          <ReviewMode
            dueWords={dueWords}
            dueCount={dueCount}
            loading={loadingDue}
            submitting={submitting}
            onReview={handleReview}
            onRefresh={refreshDue}
          />
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <DevModeProvider>
      <AppContent />
    </DevModeProvider>
  );
}
