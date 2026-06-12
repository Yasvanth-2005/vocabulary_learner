const API_BASE = '/api';

function getHeaders(devMode) {
  const headers = { 'Content-Type': 'application/json' };
  if (devMode) {
    headers['X-Dev-Mode'] = 'true';
  }
  return headers;
}

async function request(path, options = {}, devMode = false) {
  const response = await fetch(`${}${path}`, {
    ...options,
    headers: {
      ...getHeaders(devMode),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong.');
  }

  return data;
}

export const api = {
  listWords: ({ page = 1, limit = 10, search = '', sort = 'newest' } = {}, devMode = false) => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));
    if (search.trim()) params.set('search', search.trim());
    if (sort) params.set('sort', sort);
    return request(`/words?${params.toString()}`, {}, devMode);
  },
  addWord: (word, devMode) =>
    request('/words', { method: 'POST', body: JSON.stringify({ word }) }, devMode),
  getDueCount: (devMode) => request('/words/due/count', {}, devMode),
  getDueWords: (devMode) => request('/words/due', {}, devMode),
  submitReview: (id, outcome, devMode) =>
    request(
      `/words/${id}/review`,
      { method: 'POST', body: JSON.stringify({ outcome }) },
      devMode
    ),
  advanceTime: (days, devMode) =>
    request(
      '/words/dev/advance-time',
      { method: 'POST', body: JSON.stringify({ days }) },
      devMode
    ),
  skipToReview: (id, devMode) =>
    request(`/words/${id}/skip-review`, { method: 'POST' }, devMode),
};
