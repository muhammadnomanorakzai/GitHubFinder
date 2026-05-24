import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    githubId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      default: null,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export const User = mongoose.model("User", userSchema);

