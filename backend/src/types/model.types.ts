import { Document, Types } from "mongoose";

export interface IProduct extends Document {
    name: string;
    brand: string[];
    categories: string[];
    type: "hardware" | "software" | "refurbished";
    price: number;
    stock: number;
    discount: number;
    description: string;
    featuredImage: string;
    infoImages: string[];
    reviews: string[];
    specifications: {
        specificationName: string;
        specificationDescription: string;
    }[];
}


export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    otp?: number;
    isVerified: boolean;
    phone: string;
    address?: string;
    orders: string[]; // Array of order IDs
    reviews: string[]; // Array of review IDs
    cart: {
        productId: string;
        quantity: number;
        variant?: string; // Optional variant (e.g., size, color)
    }[];
}



export interface IOrder extends Document {
    userId: Types.ObjectId;
    products: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
        variant?: string; // Optional (e.g., size, color)
    }[];
    totalAmount: number; // Total price before discount
    discount: number; // Discount in percentage
    finalAmount: number; // Price after discount
    paymentMethod: "COD" | "Credit Card" | "Debit Card" | "UPI" | "Net Banking";
    paymentStatus: "pending" | "paid";
    transactionId?: string; // Optional, for online payments
    status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded" | "refund_initiated";
    shippingMethod: "standard" | "express";
    estimatedDelivery?: Date;
    shippingAddress: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    deliveredAt?: Date;
    cancelledAt?: Date;
}


export interface IReview extends Document {
    userId: Types.ObjectId; // User who wrote the review
    productId: Types.ObjectId; // Product being reviewed
    rating: number; // 1 to 5 stars
    comment?: string; // Optional review text
    images?: string[]; // List of image URLs
    likes: number; // Number of likes
    dislikes: number; // Number of dislikes
    createdAt: Date;
    updatedAt: Date;
}


export interface ICategory extends Document {
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface IBrand extends Document {
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}