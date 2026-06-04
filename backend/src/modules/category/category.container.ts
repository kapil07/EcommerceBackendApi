import { ProductRespository } from "../product/product.repository.js";
import { CategoryRepository } from "./category.repository.js";
import { CategoryService } from "./category.service.js";

const categoryRepository = new CategoryRepository();
const productService = new ProductRespository();
const categoryService = new CategoryService(categoryRepository, productService);

export { categoryService };
