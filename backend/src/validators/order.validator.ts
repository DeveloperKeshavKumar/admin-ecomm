import { z } from "zod";

export const orderValidator = z.object({
    userId: z.string().min(1, "User ID is required"),

    products: z.array(
        z.object({
            productId: z.string().min(1, "Product ID is required"),
            name: z.string().min(1, "Product name is required"),
            price: z.number().min(0, "Price must be a positive number"),
            quantity: z.number().min(1, "Quantity must be at least 1"),
            variant: z.string().optional(),
        })
    ).nonempty("Products cannot be empty"),

    totalAmount: z.number().min(0, "Total amount must be a positive number"),
    discount: z.number().min(0, "Discount cannot be negative").default(0),
    finalAmount: z.number().min(0, "Final amount must be a positive number"),

    paymentMethod: z.enum(["COD", "Credit Card", "Debit Card", "UPI", "Net Banking"]),
    paymentStatus: z.enum(["pending", "paid"]).default("pending"),
    transactionId: z.string().optional(),

    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded", "refund_initiated"]).default("pending"),

    estimatedDelivery: z.coerce.date().optional(),
    deliveredAt: z.coerce.date().optional(),
    cancelledAt: z.coerce.date().optional(),

    shippingAddress: z.object({
        name: z.string().min(1, "Name is required"),
        phone: z.string().min(10, "Phone number is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        zip: z.string().min(1, "ZIP code is required"),
        country: z.string().min(1, "Country is required"),
    }),
});

