import { Router } from 'express';
import passport from 'passport'
import { usersController } from '../controllers/users.controller.js';
import { jwtValidator } from '../middlewares/jwt.middleware.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const sessionRouter = Router();
const userAuthMiddleware = ['Admin', 'User', 'Premium']
//Local
sessionRouter.post('/signup', (req, res, next) => usersController.signup(req, res, next));
sessionRouter.post('/login', (req, res, next) => usersController.login(req, res, next));

//restore
sessionRouter.post('/restore', async (req, res) => usersController.restore(req, res));
sessionRouter.post('/restorePassword/:token', async (req, res) => usersController.restorePassword(req, res));


// GitHub 
sessionRouter.get('/auth/github', (req, res) => usersController.githubAuth(req, res));
sessionRouter.get('/callback', passport.authenticate('github', { session: false }), (req, res) => usersController.githubCallback(req, res));

// Current 
sessionRouter.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => usersController.getCurrentUser(req, res));
//Signout
sessionRouter.get('/signout', passport.authenticate('jwt', { session: false }), (req, res) => usersController.signout(req, res));

export default sessionRouter;
