import { Schema, model } from "mongoose";
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    role: { type: String, default: 'user ' }
  },
  { versionKey: false, timestamps: true }
);

export const userModel = model("user", userSchema);
