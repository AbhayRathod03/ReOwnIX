package com.reownix.chat.service.impl;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auth.entity.User;
import com.reownix.auth.repository.UserRepository;
import com.reownix.chat.entity.Conversation;
import com.reownix.chat.entity.Message;
import com.reownix.chat.repository.ConversationRepository;
import com.reownix.chat.repository.MessageRepository;
import com.reownix.chat.request.ChatMessageDTO;
import com.reownix.chat.response.ChatMessageResponse;
import com.reownix.chat.response.ChatNotificationDTO;
import com.reownix.chat.service.ChatWebSocketService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketServiceImpl implements ChatWebSocketService {

    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void processAndSendMessage(String userEmail, ChatMessageDTO chatMessageDTO) {
        User sender = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository
                .findByIdAndUser(chatMessageDTO.getConversationId(), sender)
                .orElseThrow(() -> new RuntimeException("Conversation not found or unauthorized"));

        // Save message
        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .message(chatMessageDTO.getMessage())
                .isRead(false)
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update conversation timestamp
        conversation.setUpdatedAt(savedMessage.getCreatedAt());
        conversationRepository.save(conversation);

        broadcastMessage(savedMessage);
    }
    
    @Override
    public void broadcastMessage(Message savedMessage) {
        Conversation conversation = savedMessage.getConversation();
        User sender = savedMessage.getSender();
        
        // Identify receiver
        User receiver = conversation.getBuyer().getId().equals(sender.getId()) 
                ? conversation.getSeller() 
                : conversation.getBuyer();

        // Broadcast to chat room
        ChatMessageResponse broadcastResponse = ChatMessageResponse.builder()
                .id(savedMessage.getId())
                .conversationId(conversation.getId())
                .senderId(sender.getId())
                .senderName(sender.getFirstName() + " " + sender.getLastName())
                .message(savedMessage.getMessage())
                .timestamp(savedMessage.getCreatedAt())
                .isMine(false) // Will be set explicitly by the client if needed, or default false
                .build();

        messagingTemplate.convertAndSend("/topic/chat/" + conversation.getId(), broadcastResponse);

        // Send Notification to receiver
        ChatNotificationDTO notification = ChatNotificationDTO.builder()
                .type("NEW_MESSAGE")
                .conversationId(conversation.getId())
                .senderName(sender.getFirstName())
                .messagePreview(savedMessage.getMessage().length() > 30 
                        ? savedMessage.getMessage().substring(0, 30) + "..." 
                        : savedMessage.getMessage())
                .build();

        messagingTemplate.convertAndSendToUser(
                receiver.getEmail(),
                "/queue/notifications",
                notification
        );
        
        log.info("Message processed and broadcasted for conversation {}", conversation.getId());
    }
}
