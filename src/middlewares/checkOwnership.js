import { productRepository } from "../repositories/products.repository.js";

export const checkOwnership = async (req, res, next) => {

      const idProduct = req.params.idProduct;
      const { email, role } = req.user;
      
      const product = await productRepository.findById(idProduct);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
      }

      if (role === 'Premium' && email === product.ownerEmail) {
        return res.status(403).json({ error: 'No tienes permisos para esta acción.' });
      }
  
      next();

};
