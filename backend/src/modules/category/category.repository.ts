import { prisma } from "../../lib/prisma.js";
import { ICaetgoryRepository } from "./category.interface.js";
import { createCategoryDTO, updateCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICaetgoryRepository {
  async createCategory(data: { categoryName: string; categoryDesc: string }) {
    const category = await prisma.category.create({
      data,
    });

    return category;
  }

  async findCategoryById(categoryId: string) {
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    return category;
  }

  async findCategoryByName(categoryName: string) {
    const category = await prisma.category.findUnique({
      where: {
        categoryName,
      },
    });

    return category;
  }

  async getAllCategories() {
    const categories = await prisma.category.findMany();

    return categories;
  }

  async updateCategory(data: updateCategoryDTO, categoryId: string) {
    const category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data,
    });
    return category;
  }

  async deleteCategoryById(categoryId: string) {
    await prisma.category.delete({
      where: {
        id: categoryId,
      },
    });
  }
}
