import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.helper.js";
import { IJwtPayload } from "../types/index.js";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new AppError("Unauthroized req", 401);
    }

    const decoded = verifyAccessToken(token) as IJwtPayload;

    const user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      createdAt: decoded.createdAt,
      updatedAt: decoded.updatedAt,
    };

    req.user = user;

    next()
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You are not authorized", 403)
      );
    }

    next();
  };
};
