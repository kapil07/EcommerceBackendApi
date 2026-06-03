import express from "express";
import { authorize, verifyUser } from "../../middlewares/auth.middleware.js";
import { createCategorySchema } from "./category.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createCategoryController } from "./category.controller.js";

const router = express.Router();

router
  .route("/")
  .post(
    verifyUser,
    authorize("ADMIN"),
    validate(createCategorySchema),
    createCategoryController,
  );

  export default router 