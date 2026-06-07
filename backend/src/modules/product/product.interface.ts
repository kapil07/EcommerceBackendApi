import { Prisma, Product } from "@prisma/client";
import { updateProductDTO } from "./product.schema.js";

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
    getAllProducts():Promise<Product[]>
    getProductsByCategoryId(categoryId: string):Promise<Product[]> 
    getProductByIdAndSellerId(productId: string, sellerId: string):Promise<Product | null>
    updateProduct(data: Prisma.ProductUpdateInput, productId: string,sellerId: string): Promise<Product> 
    getProductById(productId: string):Promise<Product | null>
    toogleProductStatus(productId: string, sellerId: string, status: boolean):Promise<Product>
    deleteProduct(productId: string, sellerId: string):Promise<void>
}