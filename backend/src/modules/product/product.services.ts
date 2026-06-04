import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IProductRespository } from "./product.interface.js";
import { createProductDTO } from "./product.schema.js";
import { toProductListResponse, toProductResponse } from "./product.mapper.js";

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

    return toProductResponse(newproduct);
  }

  async getProductsByCategoryId(categoryId: string) {
    const products = await this.productRepo.getProductsByCategoryId(categoryId);

    return toProductListResponse(products);
  }
}
