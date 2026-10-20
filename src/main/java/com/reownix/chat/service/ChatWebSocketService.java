package com.reownix.chat.service;

import com.reownix.chat.entity.Message;
import com.reownix.chat.request.ChatMessageDTO;

public interface ChatWebSocketService {
    void processAndSendMessage(String userEmail, ChatMessageDTO chatMessageDTO);
    void broadcastMessage(Message savedMessage);
}
