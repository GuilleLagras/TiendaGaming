import { productService } from "../services/products.service.js";
import customError from "../errors/errors.generator.js";
import { errorMessage, errorName } from "../errors/errors.enum.js";
import { handleErrors } from "../errors/handle.Errors.js";
import upload from "../middlewares/multer.middleware.js";

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await productService.getAllProducts(req.query);
      res.status(200).json({
        status: 'success',
        payload: products.result,
        totalPages: products.info.totalPages,
        prevPage: products.info.prev,
        nextPage: products.info.next,
        page: products.info.page,
        hasPrevPage: products.info.hasPrevPage,
        hasNextPage: products.info.hasNextPage,
        prevLink: products.info.prevLink,
        nextLink: products.info.nextLink,
      });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.PRODUCTS_NOT_FOUND, 500, errorName.PRODUCTS_NOT_FOUND));
    }
  }

  async getProductById(req, res) {
    const productId = req.params.pid;
    try {
      const product = await productService.getProductById(productId);
      if (product) {
        res.status(200).json({ message: 'Producto encontrado', product });
      } else {
        handleErrors(res, customError.generateError(errorMessage.PRODUCT_NOT_FOUND, 404, errorName.PRODUCT_NOT_FOUND));
      }
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GET_PRODUCT_ERROR, 500, errorName.GET_PRODUCT_ERROR));
    }
  }

  async createProduct(req, res) {
    try {
      const createdProduct = await productService.createProduct(req.body);
      res.status(200).json({ message: 'Producto agregado correctamente', product: createdProduct });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.CREATE_PRODUCT_ERROR, 400, errorName.CREATE_PRODUCT_ERROR));
    }
  }
 

async createProductMulter(req, res)  {
    try {
      const thumbnails = req.file;
  
      const productData = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        code: req.body.code,
        stock: req.body.stock,
        status: true,
        thumbnails: thumbnails,
        owner: req.body.userRole || 'Premium',
        ownerEmail: req.body.userEmail || null,
      };
  
      try {
        const createdProduct = await productService.createProduct(productData);
        res.status(200).json({ message: 'Producto agregado correctamente', product: createdProduct });
      } catch (error) {
        console.error('Error in createProduct controller:', error);
        handleErrors(res, customError.generateError(errorMessage.CREATE_PRODUCT_ERROR, 400, errorName.CREATE_PRODUCT_ERROR));
      }
    } catch (error) {
      console.error('Error in createProduct controller:', error);
      handleErrors(res, customError.generateError(errorMessage.CREATE_PRODUCT_ERROR, 400, errorName.CREATE_PRODUCT_ERROR));
    }
  };
  

  async updateProductById(req, res) {
    const productId = req.params.pid;

    try {
      const updatedData = req.body;
      const isUpdated = await productService.updateProductById(productId, updatedData);

      if (isUpdated) {
        res.status(200).json({ message: 'Producto actualizado correctamente' });
      } else {
        handleErrors(res, customError.generateError(errorMessage.UPDATED_PRODUCTS, 400, errorName.UPDATED_PRODUCTS));
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      handleErrors(res, customError.generateError(errorMessage.UPDATE_PRODUCT_ERROR,500, errorName.UPDATE_PRODUCT_ERROR));
   }
   
  }

  async deleteProductById(req, res) {
    const productId = req.params.pid;

    try {
      const isDeleted = await productService.deleteProductById(productId);

      if (isDeleted) {
        res.json({ message: 'Producto eliminado correctamente' });
      } else {
        handleErrors(res, customError.generateError(errorMessage.PRODUCT_NOT_FOUND, 404, errorName.PRODUCT_NOT_FOUND));
      }
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.DELETE_PRODUCT_ERROR, 500, errorName.DELETE_PRODUCT_ERROR));
    }
  }
}

export const productController = new ProductController();
