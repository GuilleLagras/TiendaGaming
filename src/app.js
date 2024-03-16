import express from "express";
import cors from 'cors'
import __dirname from './config/utils.js';
import exphbs from 'express-handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import Handlebars from 'handlebars';
import flash from "express-flash";
import { Server } from "socket.io";
import productsRouter from "./Routes/products.routes.js";
import cartsRouter from "./Routes/cart.routes.js";
import viewsRouter from "./Routes/views.routes.js";
import messageRouter from "./Routes/message.routes.js";
import sessionRouter from "./Routes/session.routes.js";
import cookieParser from "cookie-parser";
import session from 'express-session';
import MongoStore from "connect-mongo";
import './passport.js';
import passport from "passport";
import "./dao/Mongo/configDB.js"
import { socketManager } from "./dao/socket.manager.js";
import config from './config/config.js'
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { logger } from "./config/logger.js";
import loggerRouter from "./Routes/logger.routes.js";
import { swaggerSetup } from "./config/swagger.js";
import swaggerUi from "swagger-ui-express";
import usersRouter from "./Routes/users.routes.js";
import { usersService } from "./services/users.service.js";

const app = express();
const PORT = config.port

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('SecretCookie'));
app.use(flash());

const URI = config.mongo_uri
app.use(
  session({
    store: new MongoStore({
      mongoUrl: URI,
    }),
    secret: config.secret_session,
    cookie: { maxAge: 120000 },
  })
);

app.use(passport.initialize());

const hbs = exphbs.create({
  extname: 'handlebars',
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: {
    ifEqual: function (arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    renderImage: function (thumbnails, customClass) {
      let html = '';
      if (Array.isArray(thumbnails)) {
        thumbnails.forEach((thumbnail) => {
          if (typeof thumbnail === 'object' && thumbnail.filename) {
            // si archivo 
            const localImageUrl = `/docs/products/${thumbnail.filename}`;
            html += `<img src="${localImageUrl}" alt="Imagen del producto" class="${customClass}">`;
          } else if (typeof thumbnail === 'string') {
            html += `<img src="${thumbnail}" alt="Imagen del producto" class="${customClass}">`;
          }
        });
      }
      return new Handlebars.SafeString(html);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);
app.use('/api/sessions', sessionRouter)
app.use('/api/users', usersRouter)
app.use('/chat', messageRouter);
app.use('/products', productsRouter);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSetup))
app.use('/loggerTest', loggerRouter)

usersService.deleteInactiveUsers();

app.use(errorMiddleware)
const httpServer = app.listen(PORT, () => {
  logger.info(`Escuchando en el puerto ${PORT}`);
});

app.on('error', (error) => {
  logger.error(`Error: ${error}`);
});

const socketServer = new Server(httpServer);
socketServer.on('connection', (socket) => {
  const manager = socketManager(socketServer);
  manager.handleConnection(socket);
});