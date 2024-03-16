import { Router } from "express";
import { cartsController } from "../controllers/cart.controller.js";
import { checkOwnership } from "../middlewares/checkOwnership.js";
import { jwtValidator } from "../middlewares/jwt.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const cartsRouter = Router();
const userAuthMiddleware = ['Admin', 'User','Premium']

cartsRouter.get("/", cartsController.getAllCarts);
cartsRouter.get("/:idCart", cartsController.getCartById);
cartsRouter.post("/", cartsController.createCart);
cartsRouter.post("/:idCart/products/:idProduct",jwtValidator,authMiddleware(userAuthMiddleware),checkOwnership, cartsController.addProductToCart);
cartsRouter.delete("/:idCart", cartsController.removeAllProducts);
cartsRouter.delete("/:idCart/products/:idProduct", cartsController.removeProductFromCart);
cartsRouter.put("/:idCart", cartsController.updateCart);
cartsRouter.put("/:idCart/products/:idProduct", cartsController.updateProductQuantity);


export default cartsRouter;
