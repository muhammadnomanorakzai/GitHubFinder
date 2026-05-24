export function sanitizePlainText(value, maxLength = 1000) {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

