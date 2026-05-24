import { ContactMessage } from "../models/ContactMessage.js";

export async function createContactMessage(payload) {
  const createdMessage = await ContactMessage.create(payload);

  return {
    id: createdMessage._id,
    name: createdMessage.name,
    email: createdMessage.email,
    subject: createdMessage.subject,
    createdAt: createdMessage.createdAt,
  };
}

