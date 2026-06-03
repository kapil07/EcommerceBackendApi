import { z } from "zod"

export const createProductSchema = z.object({
    categoryId: z.string(),
    productName: z.string().min(2, "Product name must be at least 2 characters long"),
    productDesc: z.string().min(2, "Product description must be at least 2 characters long"),
    price: z.string(),
    stock: z.string()
}).strict()

export type createProductDTO = z.infer<typeof createProductSchema>