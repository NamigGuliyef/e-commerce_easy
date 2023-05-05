import mongoose, { Schema, model } from "mongoose";
const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
    quantity: { type: Number, required: true },
    photo: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);
const productModel = model("product", productSchema);
export default productModel;
