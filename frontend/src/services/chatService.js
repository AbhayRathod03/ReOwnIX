// src/services/chatService.js
import chatApi from './chatApi';

const chatService = {
  listConversations: () => chatApi.list(),
  getMessages: (conversationId) => chatApi.getMessages(conversationId),
  startConversation: (productId) => chatApi.start({ productId }),
  sendMessage: (conversationId, message) => chatApi.sendMessage(conversationId, { message }),
  markRead: (conversationId) => chatApi.markRead(conversationId),
  deleteConversation: (conversationId) => chatApi.remove(conversationId),
};

export default chatService;
