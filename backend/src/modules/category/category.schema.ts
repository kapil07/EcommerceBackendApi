import { z } from "zod";

export const createCategorySchema = z.object({
    categoryName: z.string().min(2, "Category name must be at leat 2 characters long"),
    categoryDesc: z.string().min(2, "Category must be at least 2 characters long")
})

export type createCategoryDTO = z.infer<typeof createCategorySchema>
