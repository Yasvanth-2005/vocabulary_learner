const { DictionaryError } = require('../services/dictionaryService');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode =
    err.statusCode ||
    (err.name === 'DictionaryError' ? err.statusCode : undefined) ||
    (err.name === 'ValidationError' ? 400 : undefined) ||
    (err.code === 11000 ? 409 : undefined) ||
    500;

  const message =
    err.code === 11000
      ? 'This word is already in your vocabulary.'
      : err.message || 'Internal server error';

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
