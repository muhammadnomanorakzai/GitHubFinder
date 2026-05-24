import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 180,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ email: 1, createdAt: -1 });

export const ContactMessage = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

