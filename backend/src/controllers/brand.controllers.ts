import { Request, Response } from "express";
import Brand from "../models/Brands";

/**
 * Get all brands
 */
export const getAllBrands = async (req: Request, res: Response): Promise<void> => {
    try {
        const brands = await Brand.find();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brands", error });
    }
};

/**
 * Create a new brand
 */
export const createBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        if (!name) {
            res.status(400).json({ message: "Brand name is required" });
            return;
        }

        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            res.status(400).json({ message: "Brand already exists" });
            return;
        }

        const newBrand = new Brand({ name, description });
        await newBrand.save();

        res.status(201).json({ message: "Brand created successfully", brand: newBrand });
    } catch (error) {
        res.status(500).json({ message: "Failed to create brand", error });
    }
};

/**
 * Get a brand by name
 */
export const getBrandByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const brand = await Brand.findOne({ name });

        if (!brand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }

        res.status(200).json(brand);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch brand", error });
    }
};

/**
 * Update a brand by name
 */
export const updateBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const updatedBrand = await Brand.findOneAndUpdate({ name }, req.body, { new: true });

        if (!updatedBrand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }

        res.status(200).json({ message: "Brand updated successfully", brand: updatedBrand });
    } catch (error) {
        res.status(500).json({ message: "Failed to update brand", error });
    }
};

/**
 * Delete a brand by name
 */
export const deleteBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const deletedBrand = await Brand.findOneAndDelete({ name });

        if (!deletedBrand) {
            res.status(404).json({ message: "Brand not found" });
            return;
        }

        res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete brand", error });
    }
};


