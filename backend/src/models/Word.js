const mongoose = require('mongoose');
const { USER_ID } = require('../config/constants');

const wordSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: USER_ID,
      index: true,
    },
    word: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    definition: {
      type: String,
      required: true,
    },
    example: {
      type: String,
      default: '',
    },
    phonetic: {
      type: String,
      default: '',
    },
    partOfSpeech: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
    masteryProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    nextReviewAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastReviewedAt: {
      type: Date,
      default: null,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

wordSchema.index({ userId: 1, word: 1 }, { unique: true });

module.exports = mongoose.model('Word', wordSchema);
