package com.reownix.chat.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import com.reownix.chat.request.SendMessageRequest;
import com.reownix.chat.request.StartConversationRequest;
import com.reownix.chat.response.ConversationResponse;
import com.reownix.chat.response.MessageResponse;
import com.reownix.chat.service.ChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/start")
    public ConversationResponse startConversation(
            Authentication authentication,
            @Valid @RequestBody StartConversationRequest request) {

        return chatService.startConversation(
                authentication.getName(),
                request);
    }

    @PostMapping("/{conversationId}/messages")
    public MessageResponse sendMessage(
            @PathVariable Long conversationId,
            Authentication authentication,
            @Valid @RequestBody SendMessageRequest request) {

        return chatService.sendMessage(
                conversationId,
                authentication.getName(),
                request);
    }

    @GetMapping
    public List<ConversationResponse> getMyConversations(
            Authentication authentication) {

        return chatService.getMyConversations(
                authentication.getName());
    }

    @GetMapping("/{conversationId}/messages")
    public List<MessageResponse> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication) {

        return chatService.getMessages(
                conversationId,
                authentication.getName());
    }

    @PutMapping("/{conversationId}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markAsRead(
            @PathVariable Long conversationId,
            Authentication authentication) {

        chatService.markAsRead(
                conversationId,
                authentication.getName());
    }
}