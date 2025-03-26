import { Request, Response } from "express";
import Razorpay from "razorpay";
import { Order, Product } from "../models";
import axios from "axios"; // For calling Razorpay API
import * as crypto from "crypto"; // ✅ Correct
import { orderValidator } from "../validators";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "key",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "secret",
});

export const createOrder = async (req: Request, res: Response) => {
    try {

        // ✅ Validate request body using Zod
        const validationResult = orderValidator.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Invalid order data", errors: validationResult.error.errors });
        }

        const { userId, products, paymentMethod, shippingAddress } = req.body;

        // 🔒 Step 1: Fetch product prices from the database (Prevent tampering)
        let totalAmount = 0;
        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).json({ message: "Invalid product" });
            totalAmount += product.price * item.quantity; // Always calculate on backend
        }

        // 🔒 Step 2: Generate Razorpay Order if payment is online
        let razorpayOrder = null;
        if (paymentMethod !== "COD") {
            razorpayOrder = await razorpay.orders.create({
                amount: totalAmount * 100, // Convert to paise
                currency: "INR",
                receipt: `order_${Date.now()}`,
            });
        }

        // 🔒 Step 3: Store order details securely
        const newOrder = new Order({
            userId,
            products,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "paid" : "pending",
            transactionId: razorpayOrder ? razorpayOrder.id : null,
            status: "pending",
            shippingAddress,
        });

        await newOrder.save();

        res.status(201).json({
            order: newOrder,
            razorpayOrder, // Send Razorpay details only if online payment
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create order", error });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const { orderId, paymentId, razorpayOrderId, signature } = req.body;

        // 🔒 Step 1: Validate Razorpay Signature (Prevents fraud)
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(`${razorpayOrderId}|${paymentId}`)
            .digest("hex");

        if (expectedSignature !== signature) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // 🔒 Step 2: Ensure order exists and is unpaid
        const order = await Order.findById(orderId).populate("products.product");
        if (!order || order.paymentStatus === "paid" || order.transactionId !== razorpayOrderId) {
            return res.status(400).json({ message: "Invalid or already paid order" });
        }

        // 🔒 Step 3: Recalculate the total price from products
        let actualTotal = 0;
        order.products.forEach(({ quantity, price }) => {
            actualTotal += price * quantity;
        });

        // 🔒 Step 4: Fetch payment details from Razorpay
        const razorpayResponse = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
            auth: {
                username: process.env.RAZORPAY_KEY_ID!,
                password: process.env.RAZORPAY_KEY_SECRET!
            }
        });

        const { amount, status } = razorpayResponse.data; // Amount is in paisa (1 INR = 100 paisa)

        // 🔒 Step 5: Compare actual price with paid amount
        if (amount / 100 !== actualTotal) {
            return res.status(400).json({ message: "Payment amount mismatch!" });
        }

        // 🔒 Step 6: Ensure payment is successful
        if (status !== "captured") {
            return res.status(400).json({ message: "Payment not captured yet!" });
        }

        // 🔒 Step 7: Mark order as paid
        await Order.findByIdAndUpdate(orderId, {
            paymentStatus: "paid",
            transactionId: paymentId
        });

        res.json({ message: "Payment verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Payment verification failed", error });
    }
};

//  to be used later on
export const razorpayWebhook = async (req: Request, res: Response) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
        const receivedSignature = req.headers["x-razorpay-signature"] as string;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (receivedSignature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid webhook signature" });
        }

        const event = req.body.event;
        const payment = req.body.payload.payment.entity;

        if (event === "payment.captured") {
            const order = await Order.findOne({ transactionId: payment.id });

            if (order && order.paymentStatus !== "paid") {
                await Order.findByIdAndUpdate(order._id, { paymentStatus: "paid" });
                console.log("✅ Order marked as paid via webhook:", order._id);
            }
        }

        res.json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(500).json({ message: "Webhook processing failed", error });
    }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body; // New status from frontend or webhook

        // Validate status
        const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded", "refund_initiated"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find and update order status
        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Payment status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Failed to update payment status", error });
    }
};


export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        // 🔍 Find orders where userId matches
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};

export const getOrderById = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;

        // 🔍 Find order by ID
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error });
    }
};


export const getAllOrders = async (req: Request, res: Response) => {
    try {
        // 🔍 Fetch all orders sorted from newest to oldest
        const orders = await Order.find().sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error });
    }
};
