const DICTIONARY_API_BASE = 'https://api.dictionaryapi.dev/api/v2/entries/en';

class DictionaryService {
  async lookup(word) {
    const normalized = word.trim().toLowerCase();
    if (!normalized) {
      throw new DictionaryError('Word cannot be empty', 400);
    }

    let response;
    try {
      response = await fetch(`${DICTIONARY_API_BASE}/${encodeURIComponent(normalized)}`);
    } catch {
      throw new DictionaryError('Dictionary service is unavailable. Please try again.', 503);
    }

    if (response.status === 404) {
      throw new DictionaryError(`"${word}" was not found in the dictionary.`, 404);
    }

    if (!response.ok) {
      throw new DictionaryError('Failed to fetch definition from dictionary API.', 502);
    }

    const data = await response.json();
    return this.parseEntry(data[0], normalized);
  }

  findExample(entry) {
    for (const meaning of entry.meanings || []) {
      for (const def of meaning.definitions || []) {
        if (def.example?.trim()) {
          return def.example.trim();
        }
      }
    }
    return '';
  }

  buildFallbackExample(word, definition, partOfSpeech) {
    const clean = definition.replace(/\.$/, '').toLowerCase();
    if (partOfSpeech === 'adjective') {
      return `The situation was ${word} — ${clean}.`;
    }
    if (partOfSpeech === 'verb') {
      return `She learned how to ${word} in practice.`;
    }
    if (partOfSpeech === 'noun') {
      return `The ${word} was discussed in today's lesson.`;
    }
    return `The word "${word}" means ${clean}.`;
  }

  parseEntry(entry, normalizedWord) {
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0]?.definition;

    if (!definition) {
      throw new DictionaryError(`No definition found for "${normalizedWord}".`, 404);
    }

    const partOfSpeech = meaning?.partOfSpeech || '';
    const example =
      this.findExample(entry) ||
      this.buildFallbackExample(normalizedWord, definition, partOfSpeech);

    const phonetic =
      entry.phonetic ||
      entry.phonetics?.find((p) => p.text)?.text ||
      '';

    return {
      word: normalizedWord,
      definition,
      example,
      phonetic,
      partOfSpeech,
    };
  }
}

class DictionaryError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'DictionaryError';
    this.statusCode = statusCode;
  }
}

module.exports = { DictionaryService, DictionaryError };
