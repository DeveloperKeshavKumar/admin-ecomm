import { z } from "zod";

export const productValidator = z.object({
    name: z.string().min(1, "Product name is required"),
    brand: z.array(z.string()).min(1, "At least one brand is required"),
    categories: z.array(z.string()).min(1, "At least one category is required"),
    type: z.enum(["hardware", "software", "refurbished"], {
        errorMap: () => ({ message: "Invalid product type" }),
    }),
    price: z.number().min(0, "Price must be a positive number"),
    stock: z.number().min(0, "Stock must be a positive number"),
    discount: z.number().min(0).max(100).optional(), // Discount between 0-100
    description: z.string().min(10, "Description must be at least 10 characters long"),
    featuredImage: z.string().url("Invalid featured image URL"),
    infoImages: z.array(z.string().url()).optional(),
    reviews: z.array(z.string()).optional(),
    specifications: z
        .array(
            z.object({
                specificationName: z.string().min(1, "Specification name is required"),
                specificationDescription: z.string().min(1, "Specification description is required"),
            })
        )
        .optional(),
});
