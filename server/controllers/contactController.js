import { createContactMessage } from "../services/contactService.js";

export async function submitContactMessage(req, res) {
  const savedMessage = await createContactMessage(req.validatedBody);

  res.status(201).json({
    success: true,
    message: "Message submitted successfully",
    data: {
      contactMessage: savedMessage,
    },
  });
}

