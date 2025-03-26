import express from "express";
import { getCategories, createCategory, getCategoryByName, updateCategory, deleteCategory } from "../controllers/";

const router = express.Router();

router.get("/", getCategories);
router.post("/", createCategory);
router.get("/:name", getCategoryByName);
router.put("/:name", updateCategory);
router.delete("/:name", deleteCategory);

export default router;
