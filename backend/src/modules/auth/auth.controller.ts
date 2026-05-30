import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { setCookies } from "../../utils/auth.helper.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUserService(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully",
      data: result,
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.loginUserService(req.body);

    setCookies(res, result.accessToken, result.refreshToken);

    sendResponse(res, 200, {
      success: true,
      message: "User logged In successfully",
      data: result,
    });
  },
);
