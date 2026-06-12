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
  let short;
  if (days === 1) short = 'In 1 day';
  else if (days < 7) short = `In ${days} days`;
  else if (days < 14) short = 'In 1 week';
  else if (days < 30) short = `In ${Math.round(days / 7)} weeks`;
  else short = `In ${Math.round(days / 30)} months`;

  return {
    short,
    long: short,
    isDue: false,
  };
}

export function getDisplayExample(word, definition, example) {
  if (example?.trim()) {
    return example.trim();
  }
  if (!definition) {
    return `Try using "${word}" in a sentence.`;
  }
  const clean = definition.replace(/\.$/, '').toLowerCase();
  return `The word "${word}" means ${clean}.`;
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

