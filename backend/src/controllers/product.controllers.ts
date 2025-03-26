import { Request, Response } from "express";
import { Product } from "../models";
import { productValidator } from "../validators"

/**
 * Create a new product
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body using Zod
        const validationResult = productValidator.safeParse(req.body);

        if (!validationResult.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.format(),
            });
            return;
        }

        // Extract validated data
        const productData = validationResult.data;

        const newProduct = new Product(productData);
        await newProduct.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Failed to create product", error });
    }
};

/**
 * Fetch all products
 */
export const getProducts = async (req: Request, res: Response) => {
    try {
        const {
            category,
            brand,
            type,
            price_min,
            price_max,
            stock_min,
            stock_max,
            discount_min,
            discount_max,
            search,
            page = 1,
        } = req.query;

        const filters: any = {};

        // 🔍 Case-Insensitive Search (Name, Category, Brand)
        if (search) {
            const searchRegex = new RegExp(search as string, "i");
            filters.$or = [
                { name: searchRegex },
                { categories: searchRegex },
                { brand: searchRegex },
            ];
        }

        // 🏷 Filter by Category
        if (category) {
            filters.categories = { $in: (category as string).split(",") };
        }

        // 🏭 Filter by Brand
        if (brand) {
            filters.brand = { $in: (brand as string).split(",") };
        }

        // 💻 Filter by Product Type (hardware, software, refurbished)
        if (type) {
            filters.type = type;
        }

        // 💰 Price Range
        if (price_min || price_max) {
            filters.price = {};
            if (price_min) filters.price.$gte = Number(price_min);
            if (price_max) filters.price.$lte = Number(price_max);
        }

        // 📦 Stock Availability
        if (stock_min || stock_max) {
            filters.stock = {};
            if (stock_min) filters.stock.$gte = Number(stock_min);
            if (stock_max) filters.stock.$lte = Number(stock_max);
        }

        // 🎯 Discount Range
        if (discount_min || discount_max) {
            filters.discount = {};
            if (discount_min) filters.discount.$gte = Number(discount_min);
            if (discount_max) filters.discount.$lte = Number(discount_max);
        }

        // 📄 Pagination
        const pageSize = 20;
        const skip = (Number(page) - 1) * pageSize;

        // 📌 Fetch filtered products
        const products = await Product.find(filters)
            .select("name brand categories type price stock discount description featuredImage")
            .skip(skip)
            .limit(pageSize);

        // 🏷 Get total count for pagination
        const totalProducts = await Product.countDocuments(filters);

        res.json({
            total: totalProducts,
            page: Number(page),
            pageSize,
            products,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch products", error });
    }
};


/**
 * Fetch a single product by ID
 */
export const getProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 🔎 Find product by ID
        const product = await Product.findById(id);

        // 🛑 If product not found
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch product", error });
    }
};


/**
 * Update a product by ID
 */
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Validate request body using Zod
        const validationResult = productValidator.partial().safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.format(),
            });
        }

        // Extract validated data
        const updatedData = validationResult.data;

        // 🔎 Find product and update it
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
            new: true, // Return the updated document
            runValidators: true, // Apply schema validation
        });

        // 🛑 If product not found
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error });
    }
};

/**
 * Delete a product by ID
 */
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // 🔎 Find product and delete it
        const deletedProduct = await Product.findByIdAndDelete(id);

        // 🛑 If product not found
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({ message: "Product deleted successfully", deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product", error });
    }
};

