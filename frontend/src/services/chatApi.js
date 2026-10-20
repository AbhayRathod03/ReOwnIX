// src/services/chatApi.js
import authApi from './authApi';

// All functions return the nested data field: response.data.data
// Adjust endpoint paths to match your backend implementation.
const chatApi = {
  // GET /api/chat – list all conversations
  list: () => authApi.get('/chat').then(res => res.data),

  // GET /api/chat/{conversationId}/messages – fetch messages for a conversation
  getMessages: (conversationId) =>
    authApi.get(`/chat/${conversationId}/messages`).then(res => res.data),

  // POST /api/chat/start – start a new chat for a product
  start: (payload) => authApi.post('/chat/start', payload).then(res => res.data),

  // POST /api/chat/{conversationId}/messages – send a new message (payload: { message })
  sendMessage: (conversationId, payload) =>
    authApi.post(`/chat/${conversationId}/messages`, payload).then(res => res.data),

  // PUT /api/chat/{conversationId}/read – mark as read
  markRead: (conversationId) => authApi.put(`/chat/${conversationId}/read`).then(res => res.data),

  // DELETE /api/chat/{conversationId} – delete a chat
  remove: (conversationId) => authApi.delete(`/chat/${conversationId}`).then(res => res.data),
};

export default chatApi;
