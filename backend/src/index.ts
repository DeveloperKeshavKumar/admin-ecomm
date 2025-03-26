import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/hpyecom";

app.use(express.json());
app.use(cors());

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/categories", categoryRoutes);
app.use("/brands", brandRoutes);
app.use("/orders", orderRoutes); // Mount routes

app.get("/", (req, res) => {
    res.send("Hello, TypeScript with Node.js!");
});

// Connect to MongoDB and start the server
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    });
