import { AppError } from "../../utils/AppError.js";
import { ICaetgoryRepository } from "./category.interface.js";
import { toCategoryResponse } from "./category.mapper.js";
import { createCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(private categoryRepo: ICaetgoryRepository) {}

  async createCategory(data: createCategoryDTO) {
    const {categoryName}  = data
    const existingCategory = await this.categoryRepo.findCategoryByName(categoryName)
    if(existingCategory){
        throw new AppError("Category already exists with this name", 400)
    }
    const newCategory = await this.categoryRepo.createCategory(data);

    return toCategoryResponse(newCategory);
  }
}
