import { env } from "../config/env.js";
import { signAuthToken } from "../utils/jwt.js";
import { findOrCreateGitHubUser } from "../services/authService.js";
import { fetchGitHubProfileFromCode } from "../services/githubAuthService.js";

function buildSafeUser(user) {
  return {
    id: user._id,
    githubId: user.githubId,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function setAuthCookie(res, token) {
  res.cookie(env.cookieName, token, {
    httpOnly: true,
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    secure: env.nodeEnv === "production",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function loginWithGitHub(req, res) {
  const profile = await fetchGitHubProfileFromCode(req.validatedBody.code);
  const user = await findOrCreateGitHubUser(profile);
  const token = signAuthToken({ sub: user._id.toString(), role: user.role });

  setAuthCookie(res, token);

  res.status(200).json({
    success: true,
    message: "Authenticated successfully",
    data: {
      user: buildSafeUser(user),
    },
  });
}

export async function getAuthenticatedUser(req, res) {
  res.status(200).json({
    success: true,
    data: {
      user: buildSafeUser(req.user),
    },
  });
}

export async function logout(req, res) {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    secure: env.nodeEnv === "production",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
}

