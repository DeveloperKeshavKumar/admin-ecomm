import mongoose, { Schema, Document } from "mongoose";
import { IBrand } from "../types";

const BrandSchema = new Schema<IBrand>(
    {
        name: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true },
    },
    { timestamps: true }
);

const Brand = mongoose.model<IBrand>("Brand", BrandSchema);
export default Brand;
