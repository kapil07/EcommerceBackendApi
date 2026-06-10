import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { cartService } from "./cart.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const addToCartController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const result = await cartService.addToCart(userId, req.body);

    sendResponse(res, 201, {
      success: true,
      message: "Item added to your cart",
      data: result,
    });
  },
);

export const getCartController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const result = await cartService.getCart(userId)

    sendResponse(res,200,{
        success: true,
        message: "Cart fetched successfully",
        data: result
    })
  },
);

export const updateCartItemController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.itemId as string

    const result = await cartService.updateCartItem(itemId, req.body)

    sendResponse(res, 200, {
        success: true,
        message: "Items updated successfully",
        data: result
    })
})

export const removeCartItemController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const itemId = req.params.itemId as string

    await cartService.removeCartItem(itemId)

    sendResponse(res, 200, {
        success: true,
        message: "Items removed successfully"
    })
})

export const clearCartController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    await cartService.clearCart(userId)

    sendResponse(res, 200,{
        success: true,
        message: "Cart clear successfully"
    })

})

