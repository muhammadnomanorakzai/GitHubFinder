import { env } from "../config/env.js";

function isAllowedVercelPreviewOrigin(origin) {
  return (
    env.allowVercelPreviewOrigins &&
    /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)
  );
}

export function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (env.clientUrls.includes(origin)) {
    return true;
  }

  return isAllowedVercelPreviewOrigin(origin);
}

