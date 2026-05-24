import mongoose from "mongoose";
import { Review } from "../models/Review.js";
import { AppError } from "../utils/appError.js";

export async function loadReview(req, _res, next) {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new AppError("Invalid review identifier", 400));
  }

  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  req.review = review;
  next();
}

export function requireReviewOwner(req, _res, next) {
  if (req.review.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only modify your own review", 403));
  }

  next();
}

export function requireReviewOwnerOrAdmin(req, _res, next) {
  const isOwner = req.review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return next(new AppError("You are not allowed to delete this review", 403));
  }

  next();
}

