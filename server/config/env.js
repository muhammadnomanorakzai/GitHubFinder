import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "MONGODB_URI",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
];

const fallbackClientUrl = process.env.CLIENT_URL || "http://localhost:3000";
const configuredClientUrls = (
  process.env.CLIENT_URLS || fallbackClientUrl
)
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);

requiredVariables.forEach((variableName) => {
  if (!process.env[variableName]) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }
});

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  clientUrl: fallbackClientUrl,
  clientUrls: configuredClientUrls,
  cookieName: process.env.AUTH_COOKIE_NAME || "ghf_auth",
  allowVercelPreviewOrigins:
    process.env.ALLOW_VERCEL_PREVIEW_ORIGINS === "true",
};
