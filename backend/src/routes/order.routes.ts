import express from "express";
import {
    createOrder,
    verifyPayment,
    razorpayWebhook,
    updateOrderStatus,
    getUserOrders,
    getOrderById,
    getAllOrders
} from "../controllers";

const orderRouter = express.Router();

// 📌 Create a new order
orderRouter.post("/create", createOrder as any);

// 📌 Verify payment
orderRouter.post("/verify-payment", verifyPayment as any);

// 📌 Razorpay webhook
orderRouter.post("/razorpay-webhook", razorpayWebhook as any);

// 📌 Update order status
orderRouter.patch("/:orderId/status", updateOrderStatus as any);

// 📌 Get all orders (sorted from newest to oldest)
orderRouter.get("/", getAllOrders);

// 📌 Get user-specific orders
orderRouter.get("/user/:userId", getUserOrders as any);

// 📌 Get order by ID
orderRouter.get("/:orderId", getOrderById as any);

export default orderRouter;
