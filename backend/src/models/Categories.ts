import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../types";

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

const Category = mongoose.model<ICategory>("Category", CategorySchema);
export default Category;
