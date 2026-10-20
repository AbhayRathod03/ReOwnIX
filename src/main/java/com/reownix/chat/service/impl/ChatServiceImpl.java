package com.reownix.chat.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.chat.request.SendMessageRequest;
import com.reownix.chat.request.StartConversationRequest;
import com.reownix.chat.response.ConversationResponse;
import com.reownix.chat.response.MessageResponse;
import com.reownix.chat.entity.Conversation;
import com.reownix.chat.entity.Message;
import com.reownix.chat.repository.ConversationRepository;
import com.reownix.chat.repository.MessageRepository;
import com.reownix.chat.service.ChatService;
import com.reownix.chat.service.ChatWebSocketService;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;

    private final MessageRepository messageRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;
    
    private final ChatWebSocketService chatWebSocketService;

    //helper method
    private User getCurrentUser(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }
    
    //helper method
    private Product getProduct(Long productId) {

        return productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));
    }
    
    //helper method
    private Conversation getConversation(
            Long conversationId,
            User user) {

        return conversationRepository
                .findByIdAndUser(conversationId, user)
                .orElseThrow(() ->
                        new RuntimeException("Conversation not found"));
    }
    
    @Override
    public ConversationResponse startConversation(
            String email,
            StartConversationRequest request) {

        User buyer = getCurrentUser(email);

        Product product = getProduct(request.getProductId());

        User seller = product.getOwner();

        if (buyer.getId().equals(seller.getId())) {
            throw new IllegalArgumentException(
                    "You cannot start a conversation with yourself.");
        }

        Conversation conversation =
                conversationRepository
                        .findByBuyerAndSellerAndProduct(
                                buyer,
                                seller,
                                product)
                        .orElseGet(() -> {

                            Conversation newConversation =
                                    Conversation.builder()
                                            .buyer(buyer)
                                            .seller(seller)
                                            .product(product)
                                            .build();

                            return conversationRepository.save(
                                    newConversation);
                        });

        return mapToConversationResponse(
                conversation,
                buyer);
    }
    
    @Override
    public MessageResponse sendMessage(
            Long conversationId,
            String email,
            SendMessageRequest request) {

        User sender = getCurrentUser(email);

        Conversation conversation =
                getConversation(conversationId, sender);

        Message message = Message.builder()
                .conversation(conversation)
                .sender(sender)
                .message(request.getMessage())
                .build();

        Message savedMessage = messageRepository.save(message);

        // Update conversation timestamp
        conversation.setUpdatedAt(savedMessage.getCreatedAt());
        conversationRepository.save(conversation);
        
        chatWebSocketService.broadcastMessage(savedMessage);

        return mapToMessageResponse(savedMessage);
    }
    @Override
    @Transactional(readOnly = true)
    public List<ConversationResponse> getMyConversations(String email) {

        User currentUser = getCurrentUser(email);

        List<Conversation> conversations =
                conversationRepository.findAllByUser(currentUser);

        return conversations.stream()
                .map(conversation ->
                        mapToConversationResponse(
                                conversation,
                                currentUser))
                .toList();
    }
    
    private ConversationResponse mapToConversationResponse(
            Conversation conversation,
            User currentUser) {

        User otherUser;

        if (conversation.getBuyer().getId().equals(currentUser.getId())) {
            otherUser = conversation.getSeller();
        } else {
            otherUser = conversation.getBuyer();
        }

        Message lastMessage =
                messageRepository
                        .findTopByConversationOrderByCreatedAtDesc(
                                conversation);

        int unreadCount =
                (int) messageRepository
                        .countByConversationAndIsReadFalseAndSenderNot(
                                conversation,
                                currentUser);

        return ConversationResponse.builder()
                .conversationId(conversation.getId())
                .productId(conversation.getProduct().getId())
                .productTitle(conversation.getProduct().getTitle())
                .otherUserId(otherUser.getId())
                .otherUserName(
                        otherUser.getFirstName() + " " + otherUser.getLastName())
                .lastMessage(
                        lastMessage != null ? lastMessage.getMessage() : null)
                .unreadCount(unreadCount)
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> getMessages(
            Long conversationId,
            String email) {

        User currentUser = getCurrentUser(email);

        Conversation conversation =
                getConversation(conversationId, currentUser);

        List<Message> messages =
                messageRepository.findByConversationOrderByCreatedAtAsc(
                        conversation);

        return messages.stream()
                .map(this::mapToMessageResponse)
                .toList();
    }
    //helper method
    private MessageResponse mapToMessageResponse(Message message) {

        return MessageResponse.builder()
                .messageId(message.getId())
                .senderId(message.getSender().getId())
                .senderName(
                        message.getSender().getFirstName()
                        + " "
                        + message.getSender().getLastName())
                .message(message.getMessage())
                .isRead(message.getIsRead())
                .createdAt(message.getCreatedAt())
                .build();
    }
    
    @Override
    public void markAsRead(
            Long conversationId,
            String email) {

        User currentUser = getCurrentUser(email);

        Conversation conversation =
                getConversation(conversationId, currentUser);

        List<Message> unreadMessages =
                messageRepository
                        .findByConversationAndIsReadFalseAndSenderNot(
                                conversation,
                                currentUser);

        unreadMessages.forEach(message ->
                message.setIsRead(true));

        messageRepository.saveAll(unreadMessages);
    }

}