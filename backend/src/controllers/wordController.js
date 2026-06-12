const { WordService } = require('../services/wordService');
const SpacedRepetitionService = require('../services/spacedRepetitionService');

const wordService = new WordService();
const spacedRepetitionService = new SpacedRepetitionService();

function getDevMode(req) {
  return spacedRepetitionService.isDevMode(req);
}

async function addWord(req, res, next) {
  try {
    const { word } = req.body;
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ error: 'A word is required.' });
    }
    const created = await wordService.addWord(word, getDevMode(req));
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function listWords(req, res, next) {
  try {
    const { page, limit, search, sort } = req.query;
    const result = await wordService.listWords({ page, limit, search, sort });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getDueCount(req, res, next) {
  try {
    const count = await wordService.getDueCount(getDevMode(req));
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

async function getDueWords(req, res, next) {
  try {
    const words = await wordService.getDueWords(getDevMode(req));
    res.json(words);
  } catch (err) {
    next(err);
  }
}

async function submitReview(req, res, next) {
  try {
    const { outcome } = req.body;
    const updated = await wordService.submitReview(
      req.params.id,
      outcome,
      getDevMode(req)
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function advanceTime(req, res, next) {
  try {
    const days = Number(req.body.days) || 1;
    const result = await wordService.advanceTime(days, getDevMode(req));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function skipToReview(req, res, next) {
  try {
    const word = await wordService.skipToReview(req.params.id, getDevMode(req));
    res.json(word);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addWord,
  listWords,
  getDueCount,
  getDueWords,
  submitReview,
  advanceTime,
  skipToReview,
};
