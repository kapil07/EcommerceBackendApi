import express from "express";
import { authorize, verifyUser } from "../../middlewares/auth.middleware.js";
import {
  createProductController,
  deleteProductController,
  getAllActiveProductsController,
  getAllProductsController,
  getProductByCategoryIdController,
  toggleProductStatusController,
  updateProductController,
} from "./product.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema, updateProductSchema } from "./product.schema.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyUser,
    authorize("SELLER"),
    upload.array("images", 5),
    validate(createProductSchema),
    createProductController,
  );
router.route("/").get(verifyUser, authorize("ADMIN"), getAllProductsController);
router.route("/all-active-products").get(getAllActiveProductsController)
router.route("/:catId").get(getProductByCategoryIdController);
router
  .route("/:prodId")
  .patch(
    verifyUser,
    authorize("SELLER"),
    validate(updateProductSchema),
    updateProductController,
  );
router
  .route("/:prodId")
  .delete(verifyUser, authorize("SELLER"), deleteProductController);
router
  .route("/toggle/:prodId")
  .patch(verifyUser, authorize("SELLER"), toggleProductStatusController);

export default router;
