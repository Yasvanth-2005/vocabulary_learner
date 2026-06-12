export function isDue(nextReviewAt) {
  return new Date(nextReviewAt) <= new Date();
}

export function formatNextReviewLabel(nextReviewAt, devMode) {
  const diffMs = new Date(nextReviewAt) - new Date();

  if (diffMs <= 0) {
    return { short: 'Review due today', long: 'Review due today', isDue: true };
  }

  if (devMode) {
    const mins = Math.ceil(diffMs / 60000);
    const label = mins === 1 ? '1m' : `${mins}m`;
    return {
      short: label,
      long: `Next Review: ${label} (Dev)`,
      isDue: false,
    };
  }

  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  const label = days === 1 ? '1d' : `${days}d`;
  return {
    short: label,
    long: `Next Review: ${label}`,
    isDue: false,
  };
}

export function formatPartOfSpeech(partOfSpeech) {
  if (!partOfSpeech) return '';
  return partOfSpeech.replace(/_/g, ' ').toUpperCase();
}

export function getIntervalLabels(devMode) {
  if (devMode) {
    return { needsWork: 'Repeat in 1 min', gotItRight: 'Review in 3 min' };
  }
  return { needsWork: 'Repeat in 1 day', gotItRight: 'Review in 3 days' };
}

