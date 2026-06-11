import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createProductController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;

    const result = await productService.createProduct(
      req.body,
      userId,
      req.files as Express.Multer.File[],
    );

    sendResponse(res, 201, {
      success: true,
      message: "Product created successfully",
      data: result,
    });
  },
);

export const getAllProductsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllProducts();

    sendResponse(res, 200, {
      success: true,
      message: "Products fecthed successfully",
      data: result,
    });
  },
);

export const getAllActiveProductsController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await productService.getAllActiveProducts(req.query);

    sendResponse(res, 200, {
      success: true,
      message: "All Active Products fecthed successfully",
      data: result,
    });
  },
);


export const getProductByCategoryIdController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.catId as string;

    const result = await productService.getProductsByCategoryId(categoryId);

    sendResponse(res, 200, {
      success: true,
      message: "Products fetched successfully",
      data: result,
    });
  },
);

export const updateProductController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.prodId as string;
    const sellerId = req.user.id as string
    const result = await productService.updateProduct(req.body, productId, sellerId);

    sendResponse(res, 200, {
      success: true,
      message: "Product upated successfully",
      data: result,
    });
  },
);

export const toggleProductStatusController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sellerId = req.user.id as string;
    const productId =  req.params.prodId as string

    const result = await productService.toggleProductStatus(productId, sellerId)

    sendResponse(res, 200, {
      success: true,
      message:"Product status toggled successfully",
      data: result
    })
  })

export const deleteProductController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const sellerId = req.user.id as string;
    const productId =  req.params.prodId as string

    await productService.deleteProduct(productId, sellerId)

    sendResponse(res, 200,{
      success: true,
      message: "Product deleted successfully"
    })
})
