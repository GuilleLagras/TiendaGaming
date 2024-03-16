import { Router } from "express";
import { logger } from "../config/logger.js";

const loggerRouter = Router()
loggerRouter.get('/', (req, res) => {
    logger.debug('Este es un mensaje de nivel debug');
    logger.http('Este es un mensaje de nivel http');
    logger.info('Este es un mensaje de nivel info');
    logger.warning('Este es un mensaje de nivel warning');
    logger.error('Este es un mensaje de nivel error');
    logger.fatal('Este es un mensaje de nivel fatal');

    res.send('Probando logger , loggerTest realizado');
});

export default loggerRouter