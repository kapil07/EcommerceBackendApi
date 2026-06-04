import { Category } from "@prisma/client";
import { updateCategoryDTO } from "./category.schema.js";

export interface ICaetgoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDesc: string;
  }): Promise<Category>;
  findCategoryById(categoryId: string):Promise<Category | null>
  findCategoryByName(categoryName: string): Promise<Category | null>
  getAllCategories(): Promise<Category[] | null>
  updateCategory(data:updateCategoryDTO, categoryId: string):Promise<Category>
  deleteCategoryById(categoryId: string):Promise<void>
}
