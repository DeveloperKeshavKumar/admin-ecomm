import { z } from "zod";

export const userSignupValidator = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email format"),
    phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
});