const USER_ID = process.env.USER_ID || 'test-user';

const REVIEW_INTERVALS = {
  production: {
    needsWork: 1,
    gotItRight: 3,
    unit: 'days',
  },
  dev: {
    needsWork: 1,
    gotItRight: 3,
    unit: 'minutes',
  },
};

module.exports = { USER_ID, REVIEW_INTERVALS };
