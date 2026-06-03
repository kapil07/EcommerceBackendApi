import { prisma } from "../../lib/prisma.js";
import { IProductRespository } from "./product.interface.js";

export class ProductRespository implements IProductRespository {
  async createProduct(data: {
    userId: string;
    categoryId: string;
    productName: string;
    productDesc: string;
    productImageUrls: string[];
    price: any;
    stock: number;
  }) {
    const newProduct = await prisma.product.create({
      data,
    });

    return newProduct
  }
}
