import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { auth } from "../middlewares/auth.middleware";
import {
  loadUser,
  requirePermission,
} from "../middlewares/permission.middleware";

const router = express.Router();

// Public routes
router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

// Protected routes
router.post(
  "/",
  auth,
  loadUser,
  requirePermission("products.create"),
  createProduct
);
router.put(
  "/:id",
  auth,
  loadUser,
  requirePermission("products.edit"),
  updateProduct
);
router.delete(
  "/:id",
  auth,
  loadUser,
  requirePermission("products.delete"),
  deleteProduct
);

export default router;
