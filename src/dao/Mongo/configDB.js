import mongoose from "mongoose";
import config from '../../config/config.js'
import { logger } from "../../config/logger.js";
const URI = config.mongo_uri
mongoose
.connect(URI)
.then(()=>logger.info("Conectado a base de datos"))
.catch((error)=> logger.error(`Error: ${error}`))