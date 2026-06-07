import express from "express";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import {
  createAddressController,
  deleteAddressController,
  getAddressByUserIdController,
  updateAddressController,
} from "./address.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createAddressSchema, updateAddressSchema } from "./address.schema.js";

const router = express.Router();

router
  .route("/")
  .post(verifyUser, validate(createAddressSchema), createAddressController);
router.route("/").get(verifyUser, getAddressByUserIdController);
router
  .route("/:addressId")
  .patch(verifyUser, validate(updateAddressSchema), updateAddressController);
router.route("/:addressId").delete(verifyUser,deleteAddressController)

export default router;
