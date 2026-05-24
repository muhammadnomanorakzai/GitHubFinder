import { User } from "../models/User.js";
import { env } from "../config/env.js";
import { verifyAuthToken } from "../utils/jwt.js";
import { AppError } from "../utils/appError.js";

export async function requireAuth(req, _res, next) {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = req.cookies?.[env.cookieName] || bearerToken;

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.sub).lean();

    if (!user) {
      throw new AppError("Authenticated user no longer exists", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new AppError("Invalid or expired token", 401));
  }
}

