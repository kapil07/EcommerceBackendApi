import { prisma } from "../../lib/prisma.js";
import { ICaetgoryRepository } from "./category.interface.js";
import { createCategoryDTO } from "./category.schema.js";

export class CategoryRepository implements ICaetgoryRepository {
  async createCategory(data: { categoryName: string; categoryDesc: string }) {
    const category = await prisma.category.create({
      data,
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
}
