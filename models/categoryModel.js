import mongoose, { Schema, model } from "mongoose";
const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, lowercase: true }
}, { versionKey: false, timestamps: true })

const categoryModel = model('category', categorySchema)
export default categoryModel
