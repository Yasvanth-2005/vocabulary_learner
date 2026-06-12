const { REVIEW_INTERVALS } = require('../config/constants');

class SpacedRepetitionService {
  isDevMode(req) {
    return req.get('X-Dev-Mode') === 'true';
  }

  getIntervals(devMode) {
    return devMode ? REVIEW_INTERVALS.dev : REVIEW_INTERVALS.production;
  }

  computeNextReviewAt(outcome, devMode, fromDate = new Date()) {
    const intervals = this.getIntervals(devMode);
    const amount =
      outcome === 'got_it_right' ? intervals.gotItRight : intervals.needsWork;

    const next = new Date(fromDate);
    if (intervals.unit === 'minutes') {
      next.setMinutes(next.getMinutes() + amount);
    } else {
      next.setDate(next.getDate() + amount);
    }
    return next;
  }

  getDueFilter(userId, now = new Date()) {
    return {
      userId,
      nextReviewAt: { $lte: now },
    };
  }
}

module.exports = SpacedRepetitionService;
