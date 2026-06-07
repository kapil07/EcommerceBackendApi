import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { orderService } from "./order.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createOrderController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const result = await orderService.createOrder(userId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Order created Successfully",
      data: result,
    });
  },
);

export const getMyOrderscontroller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const result = await orderService.getMyOrders(userId);

    sendResponse(res, 200, {
      success: true,
      message: "Orders fetched successfully",
      data: result,
    });
  },
);

export const updateOrderStatuscontroller = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.ordId as string;

    const result = await orderService.updateOrderStatus(orderId, req.body);

    sendResponse(res, 200, {
      success: true,
      message: "Order Status Updated Successfully",
      data: result,
    });
  },
);

export const cancelOrderController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.ordId as string;
    const userId = req.user.id

    const result = await orderService.cancelOrder(orderId, userId);

    sendResponse(res, 200,{
        success: true,
        message:"Order cancelled sucessfully",
        data: result
    })
  },
);
