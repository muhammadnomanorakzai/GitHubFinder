import { Router } from "express";
import {
  getAuthenticatedUser,
  loginWithGitHub,
  logout,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateGitHubAuthPayload } from "../validations/authValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/github",
  validateRequest(validateGitHubAuthPayload),
  asyncHandler(loginWithGitHub)
);
router.get("/me", requireAuth, asyncHandler(getAuthenticatedUser));
router.post("/logout", asyncHandler(logout));

export default router;

