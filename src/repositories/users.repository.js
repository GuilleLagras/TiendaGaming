import { UsersManager } from "../dao/factory.js";
import { logger } from "../config/logger.js";
class UsersRepository {
  constructor() {
    this.dao = new UsersManager();
  }
  async getUsers(){
    try {
      return await this.dao.findAll();
    } catch (error) {
      throw error;
    }
  }
  async createOne(user){
    try {
      return await this.dao.createOne(user)
    } catch (error) {
      logger.error(`Error al crear user: ${error}`);
      
    }
  }
  async findByEmail(email) {
    try {
      return await this.dao.findByEmail(email);
    } catch (error) {
      logger.error(`Error al encontrar email ${error}`);
    }
  }
  async findByEmailAndPopulateOrders(email) {
    try {
      return await this.dao.findByEmailAndPopulateOrders(email);
    } catch (error) {
      logger.error(`Error al encontrar email ${error}`);
      
    }
  }
  async findById(id){
    try {
      return await this.dao.findById(id)
    } catch (error) {
      logger.error(`Error encontrar id ${error}`);
      
    }
  }
  async findByResetToken(token) {
    try {
  return await this.dao.findByResetToken(token);
    } catch (error) {
logger.error(`Error encontrar al token ${error}`);
    }
  }
  
  async updateOne(id, obj) {
    try {
      return await this.dao.updateOne(id, obj);
    } catch (error) {
      
      logger.error(`Error al actualizar usuario ${error}`);
    }
  }

  async findInactiveUsers(twoDaysAgo){
    try {
      return await this.dao.findInactiveUsers(twoDaysAgo);
    } catch (error) {
      
      logger.error(`Error al encontrar users inactivos  ${error}`);
    }
  }
  async deleteInactiveUsers(twoDaysAgo){
    try {
      return await this.dao.deleteInactiveUsers(twoDaysAgo);
    } catch (error) {
      logger.error(`Error al eliminar users  ${error}`);
    }
  }
  async getDocuments(id){
    try {
      return await this.dao.getDocuments(id);
    } catch (error) {
      logger.error(`Error al get documents  ${error}`);
    }
  }
  async UpdateOrAddDocument(documents, newDocument){
    try {
      return await this.dao.UpdateOrAddDocument(documents, newDocument);
    } catch (error) {
      logger.error(`Error al actualizar o agregar docs${error}`);
    }
  }
  async deleteOne(id) {
    try {
      await this.dao.deleteOne(id);
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const usersRepository = new UsersRepository();
