package com.reownix.chat.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.reownix.chat.request.ChatMessageDTO;
import com.reownix.chat.service.ChatWebSocketService;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final ChatWebSocketService chatWebSocketService;
    private final SimpMessageSendingOperations messagingTemplate;

    @MessageExceptionHandler
    public void handleException(Exception exception, Principal principal) {
        if (principal != null) {
            messagingTemplate.convertAndSendToUser(
                    principal.getName(),
                    "/queue/errors",
                    exception.getMessage() != null ? exception.getMessage() : "Unknown error occurred"
            );
        }
        log.error("WebSocket Chat Error: ", exception);
    }

    @MessageMapping("/chat.send")
    public void sendMessage(Principal principal, ChatMessageDTO chatMessageDTO) {
        if (principal == null || principal.getName() == null) {
            log.error("Unauthenticated user attempted to send a chat message");
            return; // Or handle authentication exception
        }

        chatWebSocketService.processAndSendMessage(principal.getName(), chatMessageDTO);
    }
}
