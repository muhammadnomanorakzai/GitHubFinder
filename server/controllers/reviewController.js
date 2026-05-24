import {
  createReview,
  deleteReviewById,
  listReviews,
  updateReviewById,
} from "../services/reviewService.js";

export async function getReviews(_req, res) {
  const reviews = await listReviews();

  res.status(200).json({
    success: true,
    data: {
      reviews,
    },
  });
}

export async function postReview(req, res) {
  const review = await createReview({
    user: req.user._id,
    reviewText: req.validatedBody.reviewText,
    rating: req.validatedBody.rating,
  });

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    data: {
      review,
    },
  });
}

export async function patchReview(req, res) {
  const review = await updateReviewById(req.review._id, {
    reviewText: req.validatedBody.reviewText,
    rating: req.validatedBody.rating,
  });

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    data: {
      review,
    },
  });
}

export async function removeReview(req, res) {
  await deleteReviewById(req.review._id);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
}

