import { Category } from "@prisma/client";
import { CategoryResponseDTO } from "./category.response.js";

export const toCategoryResponse = (category: Category): CategoryResponseDTO => {
  return {
    id: category.id,
    categoryName: category.categoryName,
    categoryDesc: category.categoryDesc,
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
  };
};
