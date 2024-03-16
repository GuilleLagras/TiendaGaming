import { cartsService } from "../services/cart.service.js";
import customError from "../errors/errors.generator.js";
import { errorMessage, errorName } from "../errors/errors.enum.js";
import { handleErrors } from "../errors/handle.Errors.js";

class CartsController {
  async getAllCarts(req, res) {
    try {
      const result = await cartsService.getAllCarts();
      res.status(200).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.CARTS_NOT_FOUND, 500, errorName.CARTS_NOT_FOUND));
    }
  }

  async getCartById(req, res) {
    try {
      const { idCart } = req.params;
      const result = await cartsService.getCartById(idCart);
      res.status(result.cart ? 200 : 404).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.CART_NOT_FOUND, 500, errorName.CART_NOT_FOUND));
    }
  }

  async createCart(req, res) {
    try {
      const result = await cartsService.createCart();
      res.status(200).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.CART_NOT_CREATED, 400, errorName.CART_NOT_CREATED));
    }
  }

  async addProductToCart(req, res) {
    try {
      const { idCart, idProduct } = req.params;
      const { quantity } = req.body;
      const result = await cartsService.addProductToCart(idCart, idProduct, quantity);
      res.status(200).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.ADD_TO_CART, 400, errorName.ADD_TO_CART));
    }
  }

  async removeAllProducts(req, res) {
    try {
      const { idCart } = req.params;
      const result = await cartsService.removeAllProducts(idCart);
      res.status(result.updatedCart ? 200 : 404).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.REMOVE_ALL_FROM_CART, 500, errorName.REMOVE_ALL_FROM_CART));
    }
  }

  async removeProductFromCart(req, res) {
    try {
      const { idCart, idProduct } = req.params;

      const result = await cartsService.removeProductFromCart(idCart, idProduct);

      res.status(200).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.REMOVE_FROM_CART, 500, errorName.REMOVE_FROM_CART));
    }
  }

  async updateCart(req, res) {
    try {
      const { idCart } = req.params;
      const updatedProducts = req.body;
      const result = await cartsService.updateCart(idCart, updatedProducts);
      res.status(result ? 200 : 404).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.UPDATED_CART, 400, errorName.UPDATED_CART));
    }
  }

  async updateProductQuantity(req, res) {
    try {
      const { idCart, idProduct } = req.params;
      const { quantity } = req.body;


      const result = await cartsService.updateProductQuantity(idCart, idProduct, quantity);
      res.status(result ? 200 : 404).json(result);
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.INVALID_QUANTITY, 400, errorName.INVALID_QUANTITY));
    }
  }

}

export const cartsController = new CartsController();