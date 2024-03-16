import { jwtValidator } from '../middlewares/jwt.middleware.js';
import { usersController } from '../controllers/users.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { Router } from 'express';

const usersRouter = Router()
;
const userAuthMiddleware = ['Admin', 'User','Premium']

usersRouter.get('/', usersController.getUsers);

usersRouter.post('/premium/:uid/update', jwtValidator, authMiddleware(userAuthMiddleware), async (req, res) => {
    usersController.updatePremiumUser(req, res);
  })

usersRouter.post('/:id/documents', 
  jwtValidator, 
  authMiddleware(userAuthMiddleware), 
  async (req, res) => {
    usersController.uploadDocuments(req, res);
  }
);

usersRouter.post('/:uid/updateAvatar',
 jwtValidator,
  authMiddleware(userAuthMiddleware),
   async (req, res) => {
  usersController.updateAvatar(req, res);
});

usersRouter.post('/:id/delete',usersController.deleteUserById)
// delete users por inactividad llamado en app.js

  export default usersRouter;
