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

  parseEntry(entry, normalizedWord) {
    const meaning = entry.meanings?.[0];
    const definition = meaning?.definitions?.[0]?.definition;

    if (!definition) {
      throw new DictionaryError(`No definition found for "${normalizedWord}".`, 404);
    }

    const example =
      meaning.definitions.find((d) => d.example)?.example ||
      meaning.definitions[0]?.example ||
      '';

    const phonetic =
      entry.phonetic ||
      entry.phonetics?.find((p) => p.text)?.text ||
      '';

    const partOfSpeech = meaning?.partOfSpeech || '';

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
