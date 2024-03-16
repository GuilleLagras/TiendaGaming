import { ticketDao } from "../dao/Mongo/manager/Tickets.dao.js";
import { logger } from "../config/logger.js";
import { v4 as uuidv4 } from 'uuid';

import { cartsRepository } from "../repositories/cart.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import customError from '../errors/errors.generator.js'
import {errorMessage , errorName} from '../errors/errors.enum.js'
class CartsService {
  async getAllCarts() {
    try {
      const carts = await cartsRepository.findAll();
      return { message: "Carritos :", carts };
    } catch (error) {
    throw customError.generateError(errorMessage.CARTS_NOT_FOUND, error.code, errorName.CARTS_NOT_FOUND);
    }
  }


  async getCartById(idCart) {
    try {
      const cart = await cartsRepository.findCartById(idCart);
      if (!cart) {
        return { message: errorMessage.CART_NOT_FOUND };
      }
      return { cart };
    } catch (error) {
      throw customError.generateError(errorMessage.CART_NOT_FOUND, error.code, errorName.CART_NOT_FOUND);
      ;
    }
  }


  async createCart() {
    try {
      const createdCart = await cartsRepository.createCart();
      return { message: "Carrito creado correctamente", Cart: createdCart };
    } catch (error) {
      throw customError.generateError(errorMessage.CART_NOT_CREATED, error.code, errorName.CART_NOT_CREATED);
    }
  }


  async addProductToCart(idCart, idProduct, quantity) {
    try {
      const cart = await cartsRepository.addProductToCart(idCart, idProduct, quantity);
      return { cart };
    } catch (error) {
      logger.error(`Error al agregar producto al carrito: ${error}`);
      throw customError.generateError(errorMessage.ADD_TO_CART, error.code, errorName.ADD_TO_CART);
    }
  }

  async removeAllProducts(idCart) {
    try {
      const updatedCart = await cartsRepository.deleteAllProducts(idCart);
      return { message: "Se ha vaciado el carrito", updatedCart };
    } catch (error) {
      throw customError.generateError(errorMessage.REMOVE_ALL_FROM_CART, 500, errorName.REMOVE_ALL_FROM_CART);
    }
  }

async removeProductFromCart(idCart, idProduct) {
  try {
      
      const updatedCart = await cartsRepository.removeProductFromCart(idCart, idProduct);
      
      if (!updatedCart) {
        return { message: errorMessage.MESSAGE_REMOVE };

      }
      return  { message: "Se ha eliminado el producto del carrito", updatedCart };
  } catch (error) {
      throw customError.generateError(errorMessage.REMOVE_FROM_CART, 500, errorName.REMOVE_FROM_CART);
  }
}


  async updateCart(idCart, updatedProducts) {
    try {
      const updatedCart = await cartsRepository.updateCart(idCart, updatedProducts);
      if (!updatedCart) {
        return { message: errorMessage.UPDATED_CART };
      }
      return updatedCart;
    } catch (error) {
      throw customError.generateError(errorMessage.UPDATED_CART, error.code, errorName.UPDATED_CART);
    }
  }

  async updateProductQuantity(idCart, idProduct, quantity) {
    try {
      const updatedCart = await cartsRepository.updateProductQuantity(idCart, idProduct, quantity);
      if (!updatedCart) {
        return { message: errorMessage.INVALID_QUANTITY };
      }
      return updatedCart;
    } catch (error) {
      throw customError.generateError(errorMessage.UPDATED_PRODUCTS, 400, errorName.UPDATED_PRODUCTS);
    }
  }

  async purchase(idCart, userEmail, userToken) {
    try {
      const { email, cartId } = userToken;

      if (cartId !== idCart) {
        throw customError.generateError(errorMessage.INVALID_CART_CREDENTIALS, null, errorName.INVALID_CART_CREDENTIALS);
      }

      const user = await usersRepository.findByEmailAndPopulateOrders(userEmail);
      const { cart, total, cartLength } = await cartsRepository.findCartById(idCart);

      if (cart === null) {
        logger.warning("Error al recuperar carrito ");
        throw customError.generateError(errorMessage.CART_NOT_FOUND, null, errorName.CART_NOT_FOUND);
      }

      const products = cart.products;
      logger.info(`Products: ${products}`);
      let availableProducts = [];
      let unavailableProducts = [];

      for (let item of products) {
        if (item.product.stock >= item.quantity) {
          availableProducts.push(item);
          item.product.stock -= item.quantity;
          await item.product.save();
        } else {
          unavailableProducts.push(item);
        }
      }

      cart.products = unavailableProducts;
      await cart.save();

      if (availableProducts.length) {
        const ticket = {
          code: uuidv4(),
          amount: total,
          purchase_datetime: new Date(),
          purchaser: email,
        };

        const createdTicket = await ticketDao.createOne(ticket);

        if (createdTicket && createdTicket._id) {
          user.orders.push(createdTicket._id.toString());
          await user.save();
        } else {
          logger.error("El _id de la orden es undefined");
          throw customError.generateError(errorMessage.MESSAGE_NOT_FOUND, null, errorName.MESSAGE_NOT_FOUND);
        }

        return {
          success: true,
          availableProducts,
          total,
          message: 'Compra exitosa',
          unavailableProducts,
        };
      } else {
        return {
          success: false,
          message: 'No se pudieron comprar los productos seleccionados',
          unavailableProducts,
        };
      }
    } catch (error) {
      throw customError.generateError(errorMessage.INVALID_CREDENTIALS, error.code, errorName.INVALID_CREDENTIALS);
    }
  }

}

export const cartsService = new CartsService();
