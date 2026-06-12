const express = require('express');
const {
  addWord,
  listWords,
  getDueCount,
  getDueWords,
  submitReview,
  advanceTime,
  skipToReview,
} = require('../controllers/wordController');

const router = express.Router();

router.get('/', listWords);
router.post('/', addWord);
router.get('/due/count', getDueCount);
router.get('/due', getDueWords);
router.post('/dev/advance-time', advanceTime);
router.post('/:id/review', submitReview);
router.post('/:id/skip-review', skipToReview);

module.exports = router;
