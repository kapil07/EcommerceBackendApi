import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.registerUserService(req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully",
      data: result,
    });
  },
);
