package com.reownix.auction.websocket.security;


import lombok.RequiredArgsConstructor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.reownix.auth.security.CustomUserDetails;
import com.reownix.auth.security.JwtService;
import com.reownix.auth.service.CustomUserDetailsService;

@Component
@RequiredArgsConstructor
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final com.reownix.chat.repository.ConversationRepository conversationRepository;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {

        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {

            String authHeader = accessor.getFirstNativeHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);

                if (jwtService.isTokenValid(token)) {
                    String email = jwtService.extractUsername(token);
                    CustomUserDetails userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(email);

                    Authentication authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

                    accessor.setUser(authentication);
                    if (accessor.getSessionAttributes() != null) {
                        accessor.getSessionAttributes().put("USER_PRINCIPAL", authentication);
                    }
                    // Return a new message with the modified headers so the downstream handlers see the User
                    return org.springframework.messaging.support.MessageBuilder.createMessage(message.getPayload(), accessor.getMessageHeaders());
                }
            }
        } else if (accessor != null) {
            // For ALL other frames (SUBSCRIBE, SEND, etc.), explicitly restore the user from session attributes
            if (accessor.getUser() == null && accessor.getSessionAttributes() != null) {
                Authentication auth = (Authentication) accessor.getSessionAttributes().get("USER_PRINCIPAL");
                if (auth != null) {
                    accessor.setUser(auth);
                    // MUST return a new message with the modified headers, otherwise @MessageMapping won't see it!
                    message = org.springframework.messaging.support.MessageBuilder.createMessage(message.getPayload(), accessor.getMessageHeaders());
                }
            }
        }

        // Now validate subscriptions safely
        if (accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            if (destination != null && destination.startsWith("/topic/chat/")) {
                try {
                    String[] parts = destination.split("/");
                    Long conversationId = Long.parseLong(parts[parts.length - 1]);
                    
                    if (accessor.getUser() == null || accessor.getUser().getName() == null) {
                        throw new IllegalArgumentException("Unauthorized: No principal found on WebSocket session");
                    }
                    
                    String email = accessor.getUser().getName();
                    
                    boolean isMember = conversationRepository.existsByIdAndParticipantEmail(conversationId, email);
                            
                    if (!isMember) {
                        throw new IllegalArgumentException("Unauthorized to subscribe to this conversation");
                    }
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid conversation ID");
                }
            }
        }

        return message;
    }
}