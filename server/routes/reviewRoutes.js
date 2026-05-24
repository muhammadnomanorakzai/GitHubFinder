import { Router } from "express";
import {
  getReviews,
  patchReview,
  postReview,
  removeReview,
} from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  loadReview,
  requireReviewOwner,
  requireReviewOwnerOrAdmin,
} from "../middleware/reviewAuthorizationMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  validateCreateReviewPayload,
  validateUpdateReviewPayload,
} from "../validations/reviewValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getReviews));
router.post(
  "/",
  requireAuth,
  validateRequest(validateCreateReviewPayload),
  asyncHandler(postReview)
);
router.patch(
  "/:id",
  requireAuth,
  asyncHandler(loadReview),
  requireReviewOwner,
  validateRequest(validateUpdateReviewPayload),
  asyncHandler(patchReview)
);
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(loadReview),
  requireReviewOwnerOrAdmin,
  asyncHandler(removeReview)
);

export default router;

