import { Category } from "@prisma/client";

export interface ICaetgoryRepository {
  createCategory(data: {
    categoryName: string;
    categoryDesc: string;
  }): Promise<Category>;
  findCategoryByName(categoryName: string): Promise<Category | null>
}
