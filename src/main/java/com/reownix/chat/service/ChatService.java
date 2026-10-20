package com.reownix.chat.service;

import java.util.List;

import com.reownix.chat.request.SendMessageRequest;
import com.reownix.chat.request.StartConversationRequest;
import com.reownix.chat.response.ConversationResponse;
import com.reownix.chat.response.MessageResponse;

public interface ChatService {

    ConversationResponse startConversation(
            String email,
            StartConversationRequest request);

    MessageResponse sendMessage(
            Long conversationId,
            String email,
            SendMessageRequest request);

    List<ConversationResponse> getMyConversations(
            String email);

    List<MessageResponse> getMessages(
            Long conversationId,
            String email);

    void markAsRead(
            Long conversationId,
            String email);
}
