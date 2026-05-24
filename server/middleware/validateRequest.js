import { AppError } from "../utils/appError.js";

export function validateRequest(validator) {
  return (req, _res, next) => {
    const validation = validator(req);

    if (!validation.isValid) {
      return next(new AppError("Validation failed", 400, validation.errors));
    }

    req.validatedBody = validation.value;
    next();
  };
}

