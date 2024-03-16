 
import { usersRepository } from "../repositories/users.repository.js";
import customError from '../errors/errors.generator.js'
import { errorMessage, errorName } from "../errors/errors.enum.js";
import config from "../config/config.js";
import { transport } from "../config/nodemailer.js";
class UsersService {
  async getUsers(){
    try {
      return await usersRepository.getUsers();
    } catch (error) {
      throw customError.generateError(errorMessage.USERS_NOT_FOUND, 404, errorName.USERS_NOT_FOUND);
    }
  }
  async findByEmail(email) {
    try {
      return await usersRepository.findByEmail(email);
    } catch (error) {
      throw customError.generateError(errorMessage.EMAIL_NOT_FOUND, error.code, errorName.EMAIL_NOT_FOUND);
    }
  }
  async findById(id){
    try {
      return await usersRepository.findById(id);
    } catch (error) {
      throw customError.generateError(errorMessage.USER_NOT_FOUND, error.code, errorName.USER_NOT_FOUND);
    }
  }
  async findByResetToken(token) {
    try {
return await usersRepository.findByResetToken(token);
    } catch (error) {
throw customError.generateError(errorMessage.RESET_TOKEN_NOT_FOUND, error.code, errorName.RESET_TOKEN_NOT_FOUND);
    }
  }
  
  async updateUserAvatar(id, updatedUserData) {
    try {
      const updatedUser = await usersRepository.updateOne(id, updatedUserData);
      if (!updatedUser) {
        throw customError.generateError(errorMessage.USER_NOT_FOUND, 404, errorName.USER_NOT_FOUND);
      }
      return updatedUser;
    } catch (error) {
      throw customError.generateError(errorMessage.UPDATE_USER_ERROR, error.code, errorName.UPDATE_USER_ERROR);
    }
  }
 
  async saveUserDocs(id, { dni, address, bank }) {
    try {
      const existingDocuments = await usersRepository.getDocuments(id);

      const documents = existingDocuments || [];

        
        if (dni && dni.length > 0) {
          const newDniDocument = { name: "dni", reference: dni[0].filename };
          usersRepository.UpdateOrAddDocument(documents, newDniDocument);
      }

      if (address && address.length > 0) {
          const newAddressDocument = { name: "address", reference: address[0].filename };
          usersRepository.UpdateOrAddDocument(documents, newAddressDocument);
      }

      if (bank && bank.length > 0) {
          const newBankDocument = { name: "bank", reference: bank[0].filename };
          usersRepository.UpdateOrAddDocument(documents, newBankDocument);
      }

        const savedDocuments = await usersRepository.updateOne(id, { documents });

        return savedDocuments;
    } catch (error) {
        throw customError.generateError(errorMessage.DOCUMENTS_NOT_UPDATED, error.code, errorName.UPDATE_USER_ERROR);
    }
}
async sendNotificationEmail(email, message) {
  

  const mailOptions = {
    from: 'E-commerce',
    to: email,
    subject: 'Notificación de Eliminación de Cuenta Por Inactividad',
    text: message,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log('Correo de notificación enviado:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo de notificación:', error);
  }

}



// Eliminar usuarios activos
async deleteInactiveUsers() {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const inactiveUsers = await usersRepository.findInactiveUsers(twoDaysAgo);

    await usersRepository.deleteInactiveUsers(twoDaysAgo);

    inactiveUsers.forEach(user => {
      if (user.role !== 'Admin') {
        this.sendNotificationEmail(user.email, 'Tu cuenta ha sido eliminada por inactividad.');
      }
    });
  } catch (error) {
    throw customError.generateError(errorMessage.DELETE_INACTIVE_USERS_ERROR, error.code, errorName.DELETE_INACTIVE_USERS_ERROR);
  }
}
async deleteUserById(id) {
  try {
    await usersRepository.deleteOne(id);
    return true; 
  } catch (error) {
    throw customError.generateError(errorMessage.USERS_NOT_FOUND, error.code, errorName.USERS_NOT_FOUND);
  }
}
}


export const usersService = new UsersService();
