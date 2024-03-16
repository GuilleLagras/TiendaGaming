import passport from 'passport';
import { usersService } from '../services/users.service.js';
import { compareData, generateResetToken, generateToken, hashData } from '../config/utils.js';
import UserResDTO from '../DTOs/userResponse.dto.js';
import customError from '../errors/errors.generator.js';
import { errorMessage, errorName } from '../errors/errors.enum.js';
import { handleErrors } from '../errors/handle.Errors.js';
import { sendPasswordResetEmail } from '../config/restorePass.js';
import upload from '../middlewares/multer.middleware.js';
import UserMinimalDTO from '../DTOs/usersMinimal.dto.js';

class UsersController {
  async getUsers(req, res) {
    try {
      const usersFound = await usersService.getUsers();
      const users = usersFound.map(user => new UserMinimalDTO(user));
      res.status(200).json({ users });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.USERS_NOT_FOUND, 500, errorName.USERS_NOT_FOUND));
    }
  }

  async signup(req, res, next) {
    passport.authenticate('signup', (err, user, info) => {
      if (err) {
        return handleErrors(res, customError.generateError(errorMessage.SIGNUP_ERROR, 500, errorName.SIGNUP_ERROR));
      }
      if (!user) {
        return handleErrors(res, customError.generateError(errorMessage.SIGNUP_ERROR, 500, errorName.SIGNUP_ERROR));
      }
      res.redirect('/login');
    })(req, res, next);
  }



async login(req, res, next) {
  passport.authenticate('login', async (err, user, info) => {
      try {
          if (err || !user) {
              throw new Error("Error de autenticación");
          }

          req.login(user, { session: false }, async (error) => {
            if (error) {
                throw new Error("Error de inicio de sesión");
            }
        
            const { Usuario, email, role, cartId, _id , last_connection, avatar} = user;
            
            user.last_connection = new Date();
            await user.save();
        
            const userResDTO = new UserResDTO(user);
        
            const token = generateToken({ Usuario, email, role, cartId, _id, last_connection,avatar});
        
            res.cookie('token', token, { maxAge: 120000, httpOnly: true });
            res.redirect('/api/products');
        });
      } catch (error) {
          handleErrors(res, customError.generateError(errorMessage.LOGIN_ERROR, 500, errorName.LOGIN_ERROR));
      }
  })(req, res, next);
}
//signout 


async signout(req, res) {
  try {
    res.clearCookie('token');

    const userId = req.user._id;

    if (userId) {
      const user = await usersService.findById(userId)
      if (user) {
        user.last_connection = new Date();
        await user.save();
      }
    }

    res.redirect('/login');
  } catch (error) {
    console.error('error: ' + error);
     res.status(500).send('Error al cerrar sesión');
  }
}


  async restore(req, res) {
    const { email } = req.body;
    try {
      const user = await usersService.findByEmail(email);

      if (!user) {
        return res.status(404).json({ message: 'Correo electrónico no encontrado en la base de datos' });
    }

      const resetToken = generateResetToken(email);
      user.resetToken = {
        token: resetToken,
        expiration: new Date(Date.now() + 60 * 60 * 1000),
      };

      await user.save();
      sendPasswordResetEmail(email, resetToken);

      res.status(200).json({ message: 'Correo electrónico enviado para restablecer la contraseña' });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.RESTORE_ERROR, 500, errorName.RESTORE_ERROR));
    }
  }
  async restorePassword(req, res) {
    const { newPassword } = req.body;
    const token = req.params.token;

    try {
        const user = await usersService.findByResetToken(token.toString());

        if (!user || !user.resetToken || user.resetToken.expiration < new Date()) {
            return res.redirect('/restore');
        }

        const isSamePassword = await compareData(newPassword, user.password);

        if (isSamePassword) {
            return res.status(400).json({ message: 'No puedes restablecer la nueva contraseña con tu contraseña actual.' });
        }

        const hashedPassword = await hashData(newPassword);
        user.password = hashedPassword;
        user.resetToken = null;
        await user.save();

        return res.status(200).json({ success: 'Contraseña restablecida con éxito.' });
    } catch (error) {
        return res.status(500).json({ error: 'Error durante el restablecimiento de la contraseña.' });
    }
}


  async githubCallback(req, res) {
    try {
      const { Usuario, email, role, cartId , _id, last_connection, avatar } = req.user;
      const token = generateToken({ Usuario, email, role, cartId , _id, last_connection, avatar });
      
      req.user.last_connection = new Date();
      await req.user.save();
  
      res.cookie('token', token, { maxAge: 120000, httpOnly: true });
      res.redirect('/api/products');
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GITHUB_CALLBACK_ERROR, 500, errorName.GITHUB_CALLBACK_ERROR));
    }
  }

  async githubAuth(req, res) {
    passport.authenticate('github', {
      scope: ['user:email', 'read:user'],
      session: false,
    })(req, res);
  }
  
  async getCurrentUser(req, res) {
    try {
      const userResponseDTO = new UserResDTO(req.user);
      const userEmail = req.user.email;
      res.json({ user: userResponseDTO, email: userEmail });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GET_CURRENT_USER_ERROR, 500, errorName.GET_CURRENT_USER_ERROR));
    }
  }
  
  async updatePremiumUser(req, res) {
  try {
      const { uid } = req.params;
      const { newRole } = req.body;

      const reqUserRole = req.user;
      const user = await usersService.findById(uid);

      if (!user) {
          return handleErrors(res, customError.generateError(errorMessage.USER_NOT_FOUND, 404, errorName.USER_NOT_FOUND));
      }

      if (reqUserRole.role === 'Admin') {
        user.role = newRole;
        await user.save();
        //return res.json({ userId: uid, currentRole: user.role });
        return res.redirect('/adminPanel')
      }
  
      const docs = user.documents;
      const dni = docs.find((d) => d.name === "dni");
      const bank = docs.find((d) => d.name === "bank");
      const address = docs.find((d) => d.name === "address");

      if (!dni) {
          return res.status(400).json({ error: 'Falta el documento "dni".' });
      }

      if (!bank) {
          return res.status(400).json({ error: 'Falta el documento "bank".' });
      }

      if (!address) {
          return res.status(400).json({ error: 'Falta el documento "address".' });
      }

      
      user.role = newRole;
      await user.save();
      return res.json({ userId: uid, currentRole: user.role });

  } catch (error) {
      return handleErrors(res, customError.generateError(errorMessage.UPDATE_PREMIUM_USER_ERROR, 500, errorName.UPDATE_PREMIUM_USER_ERROR));
  }
}

async uploadDocuments(req, res) {
  const id = req.params.id;
  upload.fields([
      { name: 'dni', maxCount: 1 },
      { name: 'address', maxCount: 1 },
      { name: 'bank', maxCount: 1 }
  ])(req, res, async (err) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }

      try {
          const { dni, address, bank } = req.files;

          const response = await usersService.saveUserDocs(id, { dni, address, bank });

          res.status(200).json({ success: true, message: 'Documentos actualizados con éxito', response });
      } catch (error) {
        if (!(error.code === 400 && error.message.includes('Missing documents'))) {
          res.status(error.code || 500).json({ success: false, error: error.message });
      } else {
          res.status(400).json({ success: false, error: error.message });
      }
  }
  });
}

async updateAvatar(req, res) { 
  const uid = req.params.uid;
console.log('id:'+ uid)
  upload.single('profile')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const updatedUserData = {
        avatar: req.file.filename,
      };
      const updatedUser = await usersService.updateUserAvatar(uid, updatedUserData);
      console.log(updatedUser);

res.status(200).json({ success: true, message: 'Avatar actualizado con éxito', updatedUser });

    } catch (error) {
      console.error('error' + error);
      res.status(error.code || 500).json({ error: error.message });
    }
  })}; 

  async deleteUserById(req, res) {
    try {
      const id = req.params.id
      await usersService.deleteUserById(id);
      res.redirect('/adminPanel'); 
    } catch (error) {
      res.status(error.code || 500).json({ error: error.message });
    }
  }
}

export const usersController = new UsersController();
