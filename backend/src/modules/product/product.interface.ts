import { Product } from "@prisma/client";

export interface IProductRespository {
    createProduct(data: {
        userId: string,
        categoryId: string,
        productName: string,
        productDesc: string,
        productImageUrls: string[],
        price: any,
        stock: number
    }): Promise<Product>
}