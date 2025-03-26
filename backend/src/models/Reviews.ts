import mongoose, { Schema } from "mongoose";
import { IReview } from "../types";

const ReviewSchema = new Schema<IReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true },
        images: { type: [String], default: [] }
    },
    { timestamps: true }
);

const Review = mongoose.model<IReview>("Review", ReviewSchema);
export default Review;
