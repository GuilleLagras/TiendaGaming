import { messageService } from "../services/message.service.js";
import customError from "../errors/errors.generator.js";
import { errorMessage, errorName } from "../errors/errors.enum.js";
import { handleErrors } from "../errors/handle.Errors.js";

class MessageController {
  async getAllMessages(req, res) {
    try {
      const messages = await messageService.getAllMessages();
      res.status(200).json({ messages });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.MESSAGES_NOT_FOUND, 500, errorName.MESSAGES_NOT_FOUND));
    }
  }

  async getMessageById(req, res) {
    const messageId = req.params.id;
    try {
      const message = await messageService.getMessageById(messageId);
      if (message) {
        res.status(200).json({ message });
      } else {
        handleErrors(res, customError.generateError(errorMessage.MESSAGE_NOT_FOUND, 404, errorName.MESSAGE_NOT_FOUND));
      }
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.GET_MESSAGE_ERROR, 500, errorName.GET_MESSAGE_ERROR));
    }
  }

  async createMessage(req, res) {
    const { email, message } = req.body;
    try {
      const newMessage = await messageService.createMessage(email, message);
      res.status(200).json({ message: 'Nuevo Mensaje', createdMessage: newMessage });
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.CREATE_MESSAGE_ERROR, 400, errorName.CREATE_MESSAGE_ERROR));
    }
  }

  async deleteMessageById(req, res) {
    const messageId = req.params.id;
    try {
      const isDeleted = await messageService.deleteMessageById(messageId);
      if (isDeleted) {
        res.status(200).json({ message: 'Mensaje eliminado correctamente' });
      } else {
        handleErrors(res, customError.generateError(errorMessage.MESSAGE_NOT_FOUND, 404, errorName.MESSAGE_NOT_FOUND));
      }
    } catch (error) {
      handleErrors(res, customError.generateError(errorMessage.DELETE_MESSAGE_ERROR, 400, errorName.DELETE_MESSAGE_ERROR));
    }
  }
}

export const messageController = new MessageController();
