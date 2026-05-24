import { Review } from "../models/Review.js";

const reviewPopulation = {
  path: "user",
  select: "username avatar role",
};

export async function listReviews() {
  return Review.find().sort({ createdAt: -1 }).populate(reviewPopulation).lean();
}

export async function createReview(payload) {
  const review = await Review.create(payload);
  return Review.findById(review._id).populate(reviewPopulation).lean();
}

export async function updateReviewById(reviewId, update) {
  return Review.findByIdAndUpdate(reviewId, update, {
    new: true,
    runValidators: true,
  })
    .populate(reviewPopulation)
    .lean();
}

export async function deleteReviewById(reviewId) {
  return Review.findByIdAndDelete(reviewId).lean();
}

