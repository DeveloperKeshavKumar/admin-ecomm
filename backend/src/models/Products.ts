import mongoose, { Schema } from "mongoose";
import { IProduct } from "../types";


const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    brand: { type: [String], required: true },
    categories: { type: [String], required: true },
    type: { type: String, enum: [
        "hardware", "software", "refurbished"], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    description: { type: String, required: true },
    featuredImage: { type: String, required: true },
    infoImages: { type: [String], default: [] },
    reviews: { type: [String], default: [] },
    specifications: {
        type: [
            {
                specificationName: { type: String, required: true },
                specificationDescription: { type: String, required: true },
            },
        ],
        default: [],
    },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
