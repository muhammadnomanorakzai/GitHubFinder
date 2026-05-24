import { sanitizePlainText } from "../utils/sanitize.js";

function normalizeRating(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : NaN;
}

export function validateCreateReviewPayload(req) {
  const reviewText = sanitizePlainText(req.body?.reviewText, 500);
  const rating = normalizeRating(req.body?.rating);
  const errors = {};

  if (reviewText.length < 10) {
    errors.reviewText = "Review text must be at least 10 characters";
  }

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    errors.rating = "Rating must be an integer between 1 and 5";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: { reviewText, rating },
  };
}

export function validateUpdateReviewPayload(req) {
  return validateCreateReviewPayload(req);
}

