import { Router } from 'express';
import { productController } from '../controllers/products.controller.js';
import upload from '../middlewares/multer.middleware.js';

const productsRouter = Router();

productsRouter.get('/', productController.getAllProducts);
productsRouter.get('/:pid', productController.getProductById);
productsRouter.post('/', productController.createProduct); 

productsRouter.post('/multer', upload.single('thumbnails'), async (req, res) => { productController.createProductMulter(req,res) })

productsRouter.put('/:pid', productController.updateProductById);
productsRouter.delete('/:pid', productController.deleteProductById);

export default productsRouter;
