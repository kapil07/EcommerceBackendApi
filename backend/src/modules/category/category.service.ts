import redis from "../../lib/redis.js";
import { AppError } from "../../utils/AppError.js";
import { invalidateCategoryCache } from "../../utils/cache.helper.js";
import { IProductRespository } from "../product/product.interface.js";
import { ICaetgoryRepository } from "./category.interface.js";
import { toCategoryResponse } from "./category.mapper.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.schema.js";

export class CategoryService {
  constructor(private categoryRepo: ICaetgoryRepository, private productRepo : IProductRespository) {}

  async createCategory(data: createCategoryDTO) {
    const { categoryName } = data;

    const existingCategory =
      await this.categoryRepo.findCategoryByName(categoryName);

    if (existingCategory) {
      throw new AppError("Category already exists with this name", 400);
    }

    const newCategory = await this.categoryRepo.createCategory(data);

    await invalidateCategoryCache()

    return toCategoryResponse(newCategory);
  }

  async getAllCategories() {
    const cacheKey = `categories:all`

    const cachedCategories = await redis.get(cacheKey)

    if(cachedCategories){
      console.log("CACHE HIT")
      return JSON.parse(cachedCategories)
    }

    console.log("CACHE MISS")

    const categories = await this.categoryRepo.getAllCategories()

    const formattedResult = categories

    await redis.set(cacheKey, JSON.stringify(formattedResult), "EX", 300)

    return categories
  }

  async updateCategory(data: updateCategoryDTO, categoryId: string) {

    const existingCaetgory = await this.categoryRepo.findCategoryById(categoryId)

    if(!existingCaetgory){
      throw new AppError("Category not Found", 404)
    }

    const updatedCategory = await this.categoryRepo.updateCategory(data,categoryId)

    await invalidateCategoryCache()
    
    return toCategoryResponse(updatedCategory)
  }

  async deleteCategory(categoryId: string) {
    const existingCategory =
      await this.categoryRepo.findCategoryById(categoryId);

    const products = await this.productRepo.getProductsByCategoryId(categoryId)

    if(products && products.length > 0) {
      throw new AppError("Category cannot be deleted", 400)
    }

    if (!existingCategory) {
      throw new AppError("Catgeory Not found", 404);
    }

    await this.categoryRepo.deleteCategoryById(categoryId);

    await invalidateCategoryCache()

    return true;
  }


}
