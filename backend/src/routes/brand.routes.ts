import express from "express";
import { getAllBrands, createBrand, getBrandByName, updateBrand, deleteBrand } from "../controllers";

const router = express.Router();

router.get("/", getAllBrands);
router.post("/", createBrand);
router.get("/:name", getBrandByName);
router.put("/:name", updateBrand);
router.delete("/:name", deleteBrand);

export default router;
