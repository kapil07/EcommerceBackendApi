import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/cloudinary.helper.js";
import { IProductRespository } from "./product.interface.js";
import { createProductDTO, updateProductDTO } from "./product.schema.js";
import { toProductListResponse, toProductResponse } from "./product.mapper.js";
import { updateCategoryDTO } from "../category/category.schema.js";
import { ProductQueryOptions } from "../../types/index.js";
import redis from "../../lib/redis.js";
import { invalidateProductCache } from "../../utils/cache.helper.js";

export class ProductService {
  constructor(private productRepo: IProductRespository) {}

  async createProduct(
    data: createProductDTO,
    userId: string,
    files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new AppError("At least one product image is required", 400);
    }

    const imageUrls = await Promise.all(
      files.map((file) => uploadToCloudinary(file.buffer)),
    );

    const newproduct = await this.productRepo.createProduct({
      userId: userId,
      categoryId: data.categoryId,
      productName: data.productName,
      productDesc: data.productDesc,
      productImageUrls: imageUrls,
      price: new Prisma.Decimal(data.price),
      stock: Number(data.stock),
    });

    await invalidateProductCache()

    return toProductResponse(newproduct);
  }

  async getAllProducts() {
    const products = await this.productRepo.getAllProducts();

    return toProductListResponse(products);
  }

  async getAllActiveProducts(filters: ProductQueryOptions) {
    const cacheKey = `products:${JSON.stringify(filters)}`;
    const cachedProducts = await redis.get(cacheKey)
    if(cachedProducts){
      console.log("CACHE HIT")
      return JSON.parse(cachedProducts)
    }
    console.log("CACHE MISS")

    const result = await this.productRepo.getAllActiveProducts(filters);

    const formattedResult = {
       ...result,
       products: toProductListResponse(result.products)
    }

    await redis.set(cacheKey, JSON.stringify(formattedResult),"EX", 300);

    return formattedResult
  }

  async getProductsByCategoryId(categoryId: string) {
    const products = await this.productRepo.getProductsByCategoryId(categoryId);

    return toProductListResponse(products);
  }

  async updateProduct(
    data: updateProductDTO,
    productId: string,
    sellerId: string,
  ) {
    const existingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!existingProduct) {
      throw new AppError("Product not found", 404);
    }

    const updateData: Prisma.ProductUpdateInput = {
      ...data,
      ...(data.price !== undefined && {
        price: new Prisma.Decimal(data.price),
      }),
    };

    const updatedProduct = await this.productRepo.updateProduct(
      updateData,
      productId,
      sellerId,
    );

    await invalidateProductCache()

    return toProductResponse(updatedProduct);
  }

  async toggleProductStatus(productId: string, sellerId: string) {
    const exisitingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!exisitingProduct) {
      throw new AppError(
        "Product not found or you are not authorized to perform the action",
        401,
      );
    }

    const updatedProduct = await this.productRepo.toogleProductStatus(
      productId,
      sellerId,
      !exisitingProduct.isActive,
    );

    await invalidateProductCache()

    return toProductResponse(updatedProduct);
  }

  async deleteProduct(productId: string, sellerId: string) {
    const exisitingProduct = await this.productRepo.getProductByIdAndSellerId(
      productId,
      sellerId,
    );

    if (!exisitingProduct) {
      throw new AppError(
        "Product not found or you are not authorized to perform the action",
        401,
      );
    }

    const productImageUrls = exisitingProduct.productImageUrls;

    productImageUrls?.forEach(async (url) => {
      await deleteFromCloudinary(url);
    });

    await this.productRepo.deleteProduct(productId, sellerId);

    await invalidateProductCache()
  }
}
