import express from "express";
import { authorize, verifyUser } from "../../middlewares/auth.middleware.js";
import { createProductController } from "./product.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createProductSchema } from "./product.schema.js";
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

export default router;
