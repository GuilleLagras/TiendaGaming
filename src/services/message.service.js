import {messageRepository} from "../repositories/message.repository.js";
import { errorMessage , errorName } from "../errors/errors.enum.js";
import customError from '../errors/errors.generator.js'
class MessageService {
  async getAllMessages() {
    try {
      return await messageRepository.getAllMessages();
    } catch (error) {
      throw customError.generateError(errorMessage.MESSAGE_NOT_FOUND, 404, errorName.MESSAGE_NOT_FOUND);
    }
  }

  async getMessageById(id) {
    try {
      return await messageRepository.getMessageById(id);
    } catch (error) {
      throw customError.generateError(errorMessage.MESSAGE_NOT_FOUND, error.code, errorName.MESSAGE_NOT_FOUND);
    }
  }

  async createMessage(email, message) {
    try {
      return await messageRepository.createMessage(email, message);
    } catch (error) {
      throw customError.generateError(errorMessage.MESSAGE_NOT_FOUND, error.code, errorName.MESSAGE_NOT_FOUND);
    }
  }

  async deleteMessageById(id) {
    try {
      const result = await messageRepository.deleteMessageById(id);
      if (result) {
        return true;
      } else {
        throw customError.generateError(errorMessage.MESSAGE_REMOVE, null, errorName.MESSAGE_REMOVE);
      }
    } catch (error) {
      throw customError.generateError(errorMessage.MESSAGE_REMOVE, error.code, errorName.MESSAGE_REMOVE);
    }
  }
}

export const messageService = new MessageService();