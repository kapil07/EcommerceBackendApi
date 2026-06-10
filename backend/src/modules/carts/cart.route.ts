import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { addToCartSchema, updateCartItemSchema } from "./cart.schema.js";
import {
  addToCartController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, validate(addToCartSchema), addToCartController);
router.route("/").get(verifyUser, getCartController);
router
  .route("/:itemId")
  .patch(verifyUser, validate(updateCartItemSchema), updateCartItemController);
router.route("/:itemId").delete(verifyUser, removeCartItemController);
router.route("/").delete(verifyUser, clearCartController);

export default router;
