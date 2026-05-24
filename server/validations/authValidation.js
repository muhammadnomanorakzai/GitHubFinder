export function validateGitHubAuthPayload(req) {
  const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
  const errors = {};

  if (!code) {
    errors.code = "GitHub authorization code is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: { code },
  };
}

