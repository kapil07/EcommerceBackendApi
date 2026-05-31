import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { authService } from "./auth.container.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { destroyCookies, setCookies } from "../../utils/auth.helper.js";

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

export const getLoggedInUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const result = await authService.getCurrentUser(user.id);

    sendResponse(res, 200, {
      success: true,
      message: "User details fetched successfully",
      data: result,
    });
  },
);

export const logOutController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isLoggedOut = await authService.logout(req.body);

    if (isLoggedOut) {
      destroyCookies(res);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User Logout successfully",
      data: isLoggedOut,
    });
  },
);

export const logOutAllController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const isLoggedOutOfAllDevices = await authService.logOutAllDevices(userId);

    if (isLoggedOutOfAllDevices) {
      destroyCookies(res);
    }

    sendResponse(res, 200, {
      success: true,
      message: "User Logout successfully from all devices",
    });
  },
);

export const refreshTokenController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = await authService.refreshToken(req.body);

    setCookies(res, result.accessToken,result.refreshToken)

    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed",
      data: result
    });
  },
);
