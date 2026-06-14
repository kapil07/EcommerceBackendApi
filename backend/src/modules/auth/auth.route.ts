import express from "express";
import {
  loginUserSchema,
  logoutUserSchema,
  refreshTokenSchema,
  registerUserSchema,
} from "./auth.schema.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getLoggedInUserController,
  loginUserController,
  logOutAllController,
  logOutController,
  refreshTokenController,
  registerUserController,
} from "./auth.controller.js";
import { verifyUser } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimit.middleware.js";

const router = express.Router();

router
  .route("/register")
  .post(authLimiter,validate(registerUserSchema), registerUserController);
router.route("/login").post(authLimiter,validate(loginUserSchema), loginUserController);
router.route("/me").get(verifyUser, getLoggedInUserController);
router
  .route("/logout")
  .post(verifyUser, validate(logoutUserSchema), logOutController);
router.route("/logout-all-devices").post(verifyUser, logOutAllController);
router
  .route("/refresh-token")
  .post(authLimiter,validate(refreshTokenSchema), refreshTokenController);

export default router;
