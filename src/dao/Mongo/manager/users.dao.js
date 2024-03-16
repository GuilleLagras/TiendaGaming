import BasicManager from './basic.dao.js';
import { UserModel } from '../models/Users.model.js';

export default class UsersManager extends BasicManager {
    constructor() {
        super(UserModel, ''); 
    }
    
    //findById y createOne y updateOne heredados
    async findByEmail(email){
        try{
        const response = await  UserModel.findOne({email});
        return response;
    } catch (error) {
        logger.error(`Error en findByEmail: ${error.message}`);
            throw error;
        }
    }
    async findByEmailAndPopulateOrders(email){
        try{
        const response = await  UserModel.findOne({email}).populate('orders');
        return response;
    } catch (error) {
        logger.error(`Error en findByEmailAndPopulate: ${error.message}`);
            throw error;
        }
    }
    async findByResetToken(token) {
        try {
        const user = await UserModel.findOne({ 'resetToken.token': token });
        return user;
        } catch (error) {
          throw error;
        }
      }
      async findInactiveUsers(twoDaysAgo) {
        try {
            const response = await UserModel.find({ last_connection: { $lt: twoDaysAgo } });
            return response
        } catch (error) {
          console.error('Error al eliminar users:', error);
            throw error
        }
        
      }

      async deleteInactiveUsers(twoDaysAgo) {
        try {

          const response = await UserModel.deleteMany({
            last_connection: { $lt: twoDaysAgo },
            role: { $ne: 'Admin' }
          });
          return response;
        } catch (error) {
          throw error;
        }
      }
      
      async getDocuments(id){
        try {
          const response = await UserModel.findById(id);
          if (!response) {
              throw new Error("user not found");
          }
          return response.documents;
      } catch (error) {
          throw error;
      }
  }
  async UpdateOrAddDocument(documents, newDocument){
      const existingIndex = documents.findIndex(doc => doc.name === newDocument.name);

      if (existingIndex !== -1) {
          documents[existingIndex] = newDocument;
      } else {
          documents.push(newDocument);
      }
  }

}
