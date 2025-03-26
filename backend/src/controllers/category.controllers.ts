import { Request, Response } from "express";
import Category from "../models/Categories";

/**
 * Get all categories
 */
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch categories", error });
    }
};

/**
 * Get category by name
 */
export const getCategoryByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const category = await Category.findOne({ name });

        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch category", error });
    }
};

/**
 * Create a new category
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;

        // Check if category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            res.status(400).json({ message: "Category already exists" });
            return;
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Failed to create category", error });
    }
};

/**
 * Update a category by name
 */
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;
        const { description } = req.body;

        const updatedCategory = await Category.findOneAndUpdate(
            { name },
            { description },
            { new: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Failed to update category", error });
    }
};

/**
 * Delete a category by name
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.params;

        const deletedCategory = await Category.findOneAndDelete({ name });

        if (!deletedCategory) {
            res.status(404).json({ message: "Category not found" });
            return;
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete category", error });
    }
};
