const Word = require('../models/Word');
const { DictionaryService, DictionaryError } = require('./dictionaryService');
const SpacedRepetitionService = require('./spacedRepetitionService');
const { USER_ID } = require('../config/constants');

class WordService {
  constructor() {
    this.dictionaryService = new DictionaryService();
    this.spacedRepetitionService = new SpacedRepetitionService();
  }

  async addWord(rawWord, devMode = false) {
    const existing = await Word.findOne({
      userId: USER_ID,
      word: rawWord.trim().toLowerCase(),
    });

    if (existing) {
      const error = new Error(`"${rawWord}" is already in your vocabulary.`);
      error.statusCode = 409;
      throw error;
    }

    const enriched = await this.dictionaryService.lookup(rawWord);

    const word = await Word.create({
      ...enriched,
      userId: USER_ID,
      nextReviewAt: new Date(),
    });

    return word;
  }

  async listWords({ page = 1, limit = 10, search = '', sort = 'newest' } = {}) {
    const filter = { userId: USER_ID };

    if (search.trim()) {
      const pattern = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { word: { $regex: pattern, $options: 'i' } },
        { definition: { $regex: pattern, $options: 'i' } },
        { partOfSpeech: { $regex: pattern, $options: 'i' } },
      ];
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      az: { word: 1 },
      za: { word: -1 },
    };

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [words, total] = await Promise.all([
      Word.find(filter)
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(limitNum),
      Word.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limitNum));

    return {
      words,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    };
  }

  async getDueCount(devMode = false) {
    const now = new Date();
    return Word.countDocuments(
      this.spacedRepetitionService.getDueFilter(USER_ID, now)
    );
  }

  async getDueWords(devMode = false) {
    const now = new Date();
    return Word.find(this.spacedRepetitionService.getDueFilter(USER_ID, now)).sort({
      nextReviewAt: 1,
    });
  }

  async submitReview(wordId, outcome, devMode = false) {
    if (!['got_it_right', 'needs_work'].includes(outcome)) {
      const error = new Error('Outcome must be "got_it_right" or "needs_work".');
      error.statusCode = 400;
      throw error;
    }

    const word = await Word.findOne({ _id: wordId, userId: USER_ID });
    if (!word) {
      const error = new Error('Word not found.');
      error.statusCode = 404;
      throw error;
    }

    const now = new Date();
    word.lastReviewedAt = now;
    word.reviewCount += 1;
    word.nextReviewAt = this.spacedRepetitionService.computeNextReviewAt(
      outcome,
      devMode,
      now
    );
    await word.save();

    return word;
  }

  async advanceTime(days, devMode = false) {
    if (!devMode) {
      const error = new Error('Time simulation is only available in Dev Mode.');
      error.statusCode = 403;
      throw error;
    }

    const ms = days * 24 * 60 * 60 * 1000;
    const result = await Word.updateMany(
      { userId: USER_ID },
      [{ $set: { nextReviewAt: { $subtract: ['$nextReviewAt', ms] } } }]
    );

    return { modifiedCount: result.modifiedCount, daysAdvanced: days };
  }

  async skipToReview(wordId, devMode = false) {
    if (!devMode) {
      const error = new Error('Skip to review is only available in Dev Mode.');
      error.statusCode = 403;
      throw error;
    }

    const word = await Word.findOneAndUpdate(
      { _id: wordId, userId: USER_ID },
      { nextReviewAt: new Date() },
      { new: true }
    );

    if (!word) {
      const error = new Error('Word not found.');
      error.statusCode = 404;
      throw error;
    }

    return word;
  }
}

module.exports = { WordService, DictionaryError };
