import { Router } from "express";
import __dirname from '../config/utils.js';
import { logger } from "../config/logger.js";
//auth
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { jwtValidator } from "../middlewares/jwt.middleware.js";

import { cartsService } from "../services/cart.service.js";
import { messageRepository } from "../repositories/message.repository.js";
import { cartsRepository } from "../repositories/cart.repository.js";
import { productRepository } from "../repositories/products.repository.js";
import { transport } from "../config/nodemailer.js";
import { generateProduct} from "../faker.js";
import { usersRepository } from "../repositories/users.repository.js";

import { usersService } from "../services/users.service.js";
import  { DocumentInfo ,UserInfoDTO} from "../DTOs/userInfo.dto.js";
import EmailProductDTO from "../DTOs/emailPurchase.dto.js";
import UserMinimalDTO from "../DTOs/usersMinimal.dto.js";
import UserInfoForAdminDTO from "../DTOs/usersForAdmin.dto.js";

const adminMiddleware=['Admin']
const adminPremiumMiddleware=['Admin', 'Premium']
const userAuthMiddleware = ['Admin', 'User','Premium']

const viewsRouter = Router();


viewsRouter.get('/', async (req, res) => {
  try {
    const limit = 12;

    const { result } = await productRepository.findAllCustom({
      limit: limit,
    });

    const productObject = result.map(doc => doc.toObject());
    
    res.render('home', {
      productList: productObject,
      user: req.user, 
    });

  } catch (error) {
    logger.error(`Error: ${error}`)
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});

viewsRouter.get('/realtimeproducts', jwtValidator, authMiddleware(adminPremiumMiddleware), async (req, res) => {
  try {
    const limit = 100;
    const userRole = req.user.role;
    const user = req.user;
    const { result } = await productRepository.findAllCustom({
      limit: limit,
    });

    const productObject = result.map(doc => {
      const productData = doc.toObject();

      if (userRole === 'Admin' || userRole === 'Premium') {
        productData.owner = userRole;
      } else {
        productData.owner = 'Admin';
      }

      productData.ownerEmail = user.email;
      return productData;
    });

    res.render('realTimeProducts', {
      productList: productObject,
      userEmail: user.email,
      userRole: userRole,
      user: req.user, 
     });
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }
});


viewsRouter.get('/api/users/premium/:uid', jwtValidator, authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const userId = req.params.uid;
    const user = await usersRepository.findById(userId);
    const currentRole = user ? user.role : null;

    res.render('roleChange', { userId, currentRole ,user: req.user, });
  } catch (error) {
    console.error(error);

    const message = { error: 'Error interno del servidor' };
    res.status(500).json(message);
  }
});

//documents
viewsRouter.get('/usersInfo/:uid', jwtValidator, authMiddleware(userAuthMiddleware), async (req, res) => {
  const uid = req.params.uid;
  const user = await usersRepository.findById(uid);

  const dniDocument = user.documents.find(doc => doc.name === 'dni');
  const addressDocument = user.documents.find(doc => doc.name === 'address');
  const bankDocument = user.documents.find(doc => doc.name === 'bank');

  const dni = dniDocument ? new DocumentInfo('dni', dniDocument.reference, dniDocument._id) : null;
  const address = addressDocument ? new DocumentInfo('address', addressDocument.reference, addressDocument._id) : null;
  const bank = bankDocument ? new DocumentInfo('bank', bankDocument.reference, bankDocument._id) : null;

 const userInfoDTO = new UserInfoDTO(dni, address, bank);

  const isUrl = user.avatar.startsWith("http");

  res.render('documents', { user, isUrl, userInfoDTO ,user: req.user,  });
});

viewsRouter.get('/chat',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const {email:userEmail}= req.user
    const messages = await messageRepository.getAllMessages();
    res.render('chat', { messages , userEmail ,user: req.user, });
  } catch (error) {
    console,log(error)
    res.redirect('/login')}
});

viewsRouter.get('/api/products',jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
    const { info, result } = await productRepository.findAllCustom(req.query);

  const productObject = result.map(doc => doc.toObject());
  const { cartId } = req.user;
  const { cartLenght } = await cartsRepository.findCartById(cartId);
  if (req.session.errorMessage) {
    return res.redirect('/error');
}
 res.render('products', {
      productList: productObject,
      user: req.user,
      cartLenght,
      pagination: {
        prevLink: info.prevLink,
        nextLink: info.nextLink,
    },
    });
  } catch (error) {
    res.redirect('/login')
  }
});


viewsRouter.get('/api/product/:pid', jwtValidator,authMiddleware(userAuthMiddleware), async (req, res) => {
  try {
      const pid = req.params.pid;
      const { cartId } = req.user;

      const product = await productRepository.findById(pid);

      if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      res.render('productView', { product, cartId,user: req.user });
  } catch (error) {
    res.redirect('/login')
      }
});





viewsRouter.get('/signup', async (req, res) => {
if (req.authenticated) {
      return res.redirect('/api/products');
  }
  res.render('signup', { user: req.user });
});

viewsRouter.get('/login', async (req, res) => {
  if (req.authenticated) {
      return res.redirect('/api/products');
  }

 res.render('login', { user: req.user });
});

//purchase
viewsRouter.get("/:idCart/purchase", jwtValidator, async (req, res) => {
  try {
    const { idCart } = req.params;
    const { email: userEmail } = req.user;

    const response = await cartsService.purchase(idCart, userEmail, req.user);

    if (response.success) {
      const emailProducts = EmailProductDTO.formatForEmail(response.availableProducts);

      res.render('purchased', {
        message: response.message,
        availableProducts: response.availableProducts,
        total: response.total,
        unavailableProducts: response.unavailableProducts,
      });

      logger.info('purchased', response);

      const emailBody = `
        Gracias por tu compra. Has adquirido los siguientes productos:

        Productos comprados:
        ${emailProducts.map(producto => `${producto.title} - Cantidad: ${producto.quantity} - Precio: ${producto.price}`).join('\n')}

        Total:$ ${response.total}

        Productos sin stock: ${response.unavailableProducts.length > 0 ? response.unavailableProducts.join(', ') : 'Ninguno'}
      `;

      const mailOptions = {
        from: 'E-commerce',
        to: userEmail,
        subject: 'Compra en Ecommerce - CoderBackend',
        text: emailBody,
      };

      await transport.sendMail(mailOptions);
      logger.info('Correo electrónico enviado');

    } else {
      res.render('purchaseFailed', {
        message: response.message,
        unavailableProducts: response.unavailableProducts,
        user: req.user, 
      });
    }

  } catch (error) {
    logger.error(`Error: ${error}`);
    res.redirect('/login');
  }
});

viewsRouter.get('/api/cart/:cid', async (req, res) => {
  try {
    const idCart = req.params.cid;
    const {cart , total} = await cartsRepository.findCartById(idCart); 
    res.render('cart', { cart ,total ,idCart});
   } catch (error) {

    res.status(500).send('Error al renderizar la página de carrito');
  }
});

//restaurar

viewsRouter.get('/restore', async (req, res) => {
  res.render('restore');
});



viewsRouter.get('/restorePassword/:token', async (req, res) => {
  const { token } = req.params;
  try {
const user = await usersService.findByResetToken(token.toString());
    if (!user || !user.resetToken || user.resetToken.expiration < new Date()) {
      res.redirect('/restore');
    } else {
      res.render('restorePassword', { token });
    }
  } catch (error) {
    logger.error('Error  al restaurar password', error);
    res.redirect('/restore');
  }
});





viewsRouter.get('/error', async (req, res) => {
  const errorMessage = req.session.errorMessage;
  req.session.errorMessage = null;

  res.render('error', { errorMessage });
});



 // Renderizado  de productos mocking:
 viewsRouter.get('/mockingproducts', async (req, res) => {
  const products = [];
  for (let i = 0; i < 100; i++) {
    products.push(generateProduct());
  }
  res.render('home', {
    productList: products,
    
  });}) 

viewsRouter.get('/adminPanel', jwtValidator, authMiddleware(adminMiddleware), async (req,res)=>{
  try {
    const usersFound = await usersService.getUsers();

    const users = usersFound.map(user => new UserInfoForAdminDTO(user));

    res.render('adminPanel', { users ,user: req.user,  });
  
  } catch (error) {
    logger.error(`Error: ${error}`)
    res.status(500).json({ error: 'Error al cargar la vista.' });
  }

})
export default viewsRouter;
