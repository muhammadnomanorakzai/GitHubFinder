import { sanitizePlainText } from "../utils/sanitize.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactPayload(req) {
  const name = sanitizePlainText(req.body?.name, 120);
  const email = sanitizePlainText(req.body?.email, 180).toLowerCase();
  const subject = sanitizePlainText(req.body?.subject, 160);
  const message = sanitizePlainText(req.body?.message, 2000);
  const errors = {};

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!emailRegex.test(email)) {
    errors.email = "A valid email address is required";
  }

  if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      name,
      email,
      subject,
      message,
    },
  };
}

