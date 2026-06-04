import express from "express";
import { authorize, verifyUser } from "../../middlewares/auth.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  allCategoryController,
  createCategoryController,
  deleteCategoryController,
  updateCategoryController,
} from "./category.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyUser,
    authorize("ADMIN"),
    validate(createCategorySchema),
    createCategoryController,
  );
router
  .route("/:catId")
  .delete(verifyUser, authorize("ADMIN"), deleteCategoryController);
router
  .route("/:catId")
  .patch(
    verifyUser,
    authorize("ADMIN"),
    validate(updateCategorySchema),
    updateCategoryController,
  );
router.route("/").get(allCategoryController);

export default router;
