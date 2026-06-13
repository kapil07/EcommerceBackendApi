import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { IProductRespository } from "./product.interface.js";
import { updateProductDTO } from "./product.schema.js";
import { ProductQueryOptions } from "../../types/index.js";

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

  async getAllActiveProducts(filters: ProductQueryOptions) {
    const {
      categoryId,
      minPrice,
      maxPrice,
      sortBy,
      limit = 10,
      cursor,
    } = filters;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
    };

    // filter by categoryId
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // filter by price
    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) {
        where.price.gte = new Prisma.Decimal(minPrice);
      }

      if (maxPrice) {
        where.price.lte = new Prisma.Decimal(maxPrice);
      }
    }

    // cursor
    if (cursor) {
      where.createdAt = {
        lt: new Date(cursor),
      };
    }

    // sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = {
      createdAt: "desc",
    };

    if (sortBy === "latest") {
      orderBy = { createdAt: "desc" };
    }
    if (sortBy === "oldest") {
      orderBy = { createdAt: "asc" };
    }
    if (sortBy === "priceAsc") {
      orderBy = { price: "asc" };
    }
    if (sortBy === "priceDesc") {
      orderBy = { price: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit + 1,
    });
    let nextCursor: string | null = null;
    if (products.length > limit) {
      const nextItem = products.pop();

      nextCursor = nextItem?.createdAt.toISOString() || null;
    }
    return {
      products,
      nextCursor,
      hasMore: !!nextCursor,
    };
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
    const product = await prisma.product.update({
      where: {
        id: productId,
        userId: sellerId,
      },
      data: { isActive: status },
    });

    return product;
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
