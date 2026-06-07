import express from "express";
import { authorize, verifyUser } from "../../middlewares/auth.middleware.js";
import {
  cancelOrderController,
  createOrderController,
  getMyOrderscontroller,
  updateOrderStatuscontroller,
} from "./order.controller.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, validate(createOrderSchema), createOrderController);
router.route("/").get(verifyUser, getMyOrderscontroller);
router
  .route("/:ordId")
  .post(
    verifyUser,
    authorize("ADMIN"),
    validate(updateOrderStatusSchema),
    updateOrderStatuscontroller,
  );
router.route("/cancel-order/:ordId").post(verifyUser, cancelOrderController);

export default router;
