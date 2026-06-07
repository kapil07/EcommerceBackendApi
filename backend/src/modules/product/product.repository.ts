import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IProductRespository } from "./product.interface.js";
import { updateProductDTO } from "./product.schema.js";

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

    return newProduct;
  }

  async getAllProducts() {
    const products = await prisma.product.findMany();

    return products;
  }

  async getProductsByCategoryId(categoryId: string) {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
    });

    return products;
  }

  async updateProduct(
    data: Prisma.ProductUpdateInput,
    productId: string,
    sellerId: string,
  ) {
    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        userId: sellerId,
      },
      data,
    });

    return updatedProduct;
  }

  async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    return product;
  }

  async getProductByIdAndSellerId(productId: string, sellerId: string) {
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: sellerId,
      },
    });

    return product;
  }

  async toogleProductStatus(
    productId: string,
    sellerId: string,
    status: boolean,
  ) {
   const product =  await prisma.product.update({
      where: {
        id: productId,
        userId: sellerId,
      },
      data: { isActive: status },
    });

    return product
  }

  async deleteProduct(productId: string, sellerId: string) {
    await prisma.product.delete({
      where: {
        id: productId,
        userId: sellerId,
      },
    });
  }
}
