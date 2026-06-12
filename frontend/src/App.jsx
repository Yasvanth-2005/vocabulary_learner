import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DevModeProvider, useDevMode } from './context/DevModeContext';
import Header from './components/Header';
import WordInput from './components/WordInput';
import WordList from './components/WordList';
import ReviewMode from './components/ReviewMode';
import Toast from './components/Toast';
import { addWord, bumpLibraryReload } from './store/slices/librarySlice';
import { fetchDueQueue, submitReview } from './store/slices/reviewSlice';
import { dismissToast, setTab, showToast } from './store/slices/uiSlice';

function AppContent() {
  const dispatch = useDispatch();
  const { devMode } = useDevMode();
  const tab = useSelector((state) => state.ui.tab);
  const toast = useSelector((state) => state.ui.toast);
  const { dueWords, dueCount, loadingDue, dueError, submitting } = useSelector(
    (state) => state.review
  );
  const { reloadKey, adding } = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(fetchDueQueue(devMode));
  }, [dispatch, devMode]);

  useEffect(() => {
    if (!toast.message) return;
    const timer = setTimeout(() => dispatch(dismissToast()), 4000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.message]);

  async function handleAddWord(word) {
    const result = await dispatch(addWord({ word, devMode }));
    if (addWord.fulfilled.match(result)) {
      dispatch(showToast({ message: `"${word}" added to your library.` }));
      await dispatch(fetchDueQueue(devMode));
      return true;
    }
    dispatch(showToast({ message: result.payload, type: 'error' }));
    return false;
  }

  async function handleReview(id, outcome) {
    const result = await dispatch(submitReview({ id, outcome, devMode }));
    if (submitReview.fulfilled.match(result)) {
      dispatch(bumpLibraryReload());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
      await dispatch(fetchDueQueue(devMode));
    }
  }

  function handleTimeAdvanced(errorMessage) {
    if (errorMessage) {
      dispatch(showToast({ message: errorMessage, type: 'error' }));
    } else {
      dispatch(showToast({ message: 'Time advanced — check your review queue.', type: 'info' }));
      dispatch(fetchDueQueue(devMode));
    }
  }

  const handleRefreshDue = useCallback(() => {
    dispatch(fetchDueQueue(devMode));
  }, [dispatch, devMode]);

  return (
    <div className="min-h-screen bg-[var(--color-neutral)]">
      <Header onTimeAdvanced={handleTimeAdvanced} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6 flex justify-center">
          <nav className="inline-flex rounded-full bg-[var(--color-tertiary)] p-1.5">
            <button
              type="button"
              onClick={() => dispatch(setTab('library'))}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition sm:text-base ${
                tab === 'library'
                  ? 'bg-[var(--color-card)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-muted)]'
              }`}
            >
              Library
            </button>
            <button
              type="button"
              onClick={() => dispatch(setTab('review'))}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition sm:text-base ${
                tab === 'review'
                  ? 'bg-[var(--color-card)] text-[var(--color-ink)] shadow-sm'
                  : 'text-[var(--color-ink-muted)]'
              }`}
            >
              Review
              {!loadingDue && dueCount > 0 && (
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold leading-none ${
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
          <section className="space-y-8">
            <div id="add-word">
              <WordInput onAdd={handleAddWord} loading={adding} />
            </div>
            <WordList reloadKey={reloadKey} onSkipReview={handleRefreshDue} />
          </section>
        )}

        {tab === 'review' && (
          <div className="mx-auto max-w-2xl">
            <ReviewMode
              dueWords={dueWords}
              dueCount={dueCount}
              loading={loadingDue}
              error={dueError}
              submitting={submitting}
              onReview={handleReview}
              onRefresh={handleRefreshDue}
            />
          </div>
        )}
      </main>

      <Toast
        message={toast.message}
        type={toast.type}
        onDismiss={() => dispatch(dismissToast())}
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
