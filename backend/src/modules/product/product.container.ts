import { ProductRespository } from "./product.repository.js";
import { ProductService } from "./product.services.js";

const productRepository = new ProductRespository()
const productService = new ProductService(productRepository)

export {productService}