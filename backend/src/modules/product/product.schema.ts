import { z } from "zod"

export const createProductSchema = z.object({
    categoryId: z.string(),
    productName: z.string().min(2, "Product name must be at least 2 characters long"),
    productDesc: z.string().min(2, "Product description must be at least 2 characters long"),
    price: z.coerce.number().positive(),
    stock: z.coerce.number().int().min(0)
}).strict()

export const updateProductSchema = z.object({
    productName: z.string().min(2, "Product name must be at least 2 characters long").optional(),
    productDesc: z.string().min(2, "Product description must be at least 2 characters long").optional(),
    price: z.coerce.number().positive().optional(),
    stock: z.coerce.number().int().min(0).optional()
}).strict()

export type createProductDTO = z.infer<typeof createProductSchema>
export type updateProductDTO = z.infer<typeof updateProductSchema>