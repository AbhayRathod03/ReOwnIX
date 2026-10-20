package com.reownix.auction.websocket.controller;



import java.security.Principal;

import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import com.reownix.auction.websocket.dto.BidMessage;
import com.reownix.auction.websocket.service.AuctionWebSocketService;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import lombok.extern.slf4j.Slf4j;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@Slf4j
public class AuctionWebSocketController {

    private final AuctionWebSocketService websocketService;
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
        log.error("WebSocket Auction Error: ", exception);
    }
    
    @MessageMapping("/auction.bid")
    public void placeBid(
            Principal principal,
            @Payload BidMessage bidMessage) {

        System.out.println("========== BID RECEIVED ==========");
        System.out.println("User: " + principal.getName());
        System.out.println("Auction: " + bidMessage.getAuctionId());
        System.out.println("Amount: " + bidMessage.getBidAmount());

        websocketService.placeBid(
                principal.getName(),
                bidMessage);
    }
}