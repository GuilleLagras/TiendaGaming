import { productRepository } from "../repositories/products.repository.js";
import { errorMessage ,errorName } from "../errors/errors.enum.js";
import customError from '../errors/errors.generator.js'
class ProductService {
  async getAllProducts(query) {
    try {
      return await productRepository.findAllCustom(query);
    } catch (error) {
      throw customError.generateError(errorMessage.PRODUCTS_NOT_FOUND, error.code, errorName.PRODUCTS_NOT_FOUND);
    }
  }

  async getProductById(id) {
    try {
      return await productRepository.findById(id);
    } catch (error) {
      throw customError.generateError(errorMessage.PRODUCT_NOT_FOUND, error.code, errorName.PRODUCT_NOT_FOUND);
    }
  }

  async createProduct(data) {
    try {
     
      return await productRepository.createOne(data);
      
    } catch (error) {
      throw customError.generateError(errorMessage.PRODUCT_NOT_FOUND, error.code, errorName.PRODUCT_NOT_FOUND);
    }
  }

  async updateProductById(id, data) {
    try {
      return await productRepository.updatedOne(id, data);

    } catch (error) {
      throw customError.generateError(errorMessage.UPDATED_PRODUCTS, 400, errorName.UPDATED_PRODUCTS);
    }
  }

  async deleteProductById(id) {
    try {
      await productRepository.deleteOne(id);
      return true; 
    } catch (error) {
      throw customError.generateError(errorMessage.PRODUCT_NOT_FOUND, error.code, errorName.PRODUCT_NOT_FOUND);
    }
  }
  
}

export const productService = new ProductService();