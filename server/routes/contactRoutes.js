import { Router } from "express";
import { submitContactMessage } from "../controllers/contactController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { validateContactPayload } from "../validations/contactValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post(
  "/",
  validateRequest(validateContactPayload),
  asyncHandler(submitContactMessage)
);

export default router;

