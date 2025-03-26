import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "../types";

export interface IUserModel extends IUser, Document { }

const UserSchema = new Schema<IUserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        otp: { type: Number, required: true },
        isVerified: { type: Boolean, default: false },
        address: { type: String },
        orders: [{ type: Schema.Types.ObjectId, ref: "Order", default: [] }],
        reviews: [{ type: Schema.Types.ObjectId, ref: "Review", default: [] }],
        cart: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, default: 1 },
                variant: { type: String },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.model<IUserModel>("User", UserSchema);
export default User;
