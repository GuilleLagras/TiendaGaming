import config from "../config/config.js";
import { logger } from "../config/logger.js";
const persistence = config.persistence;

let UsersManager;
let CartsManager;
let ProductsManager;
let MessagesManager;

switch (persistence) {
    case 'Mongo':
        logger.info('Trabajando con MongoDB');
        const mongoose = await import('mongoose');
        await mongoose.connect(config.mongo_uri);

        UsersManager = (await import('./Mongo/manager/users.dao.js')).default;
        CartsManager = (await import('./Mongo/manager/carts.dao.js')).default;
        ProductsManager = (await import('./Mongo/manager/products.dao.js')).default;
        MessagesManager = (await import('./Mongo/manager/message.dao.js')).default;
        break;
    case 'Memory':
        // logger.info('Trabajando con Memoria');
        // //agregar persistencias memory
        // ProductsManager = require('./Mongo/manager/products.dao.js').default;
        break;
    default:
        logger.error('Persistencia no válida en la configuración.');
        break;
}

export {
    UsersManager,
    CartsManager,
    ProductsManager,
    MessagesManager
};
