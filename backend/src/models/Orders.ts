import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types";

const OrderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true },
                variant: { type: String },
            },
        ],
        totalAmount: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"], required: true },
        paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
        transactionId: { type: String },
        status: { type: String, enum: ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded", "refund_initiated"], default: "pending" },
        estimatedDelivery: { type: Date },
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
    },
    { timestamps: true }
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);
export default Order;
