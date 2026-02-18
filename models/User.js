import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, minlength: 2, maxlength: 120 },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      match: [/.+@.+\..+/, "Please fill a valid email address"], // regex validator
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "ADMIN" },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
