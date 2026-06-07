import { Product } from "@prisma/client";

export const toProductResponse = (product:Product) => {
    return {
        id: product.id,
        productName: product.productName,
        productDesc: product.productDesc,
        productOImageUrls: product.productImageUrls,
        isActive: product.isActive,
        price: product.price,
        stock: product.stock,
        createAt: product.createdAt,
        updatedAt: product.updatedAt
    }
}

export const toProductListResponse = (products: Product[]) => {
    return products.map(toProductResponse)
}