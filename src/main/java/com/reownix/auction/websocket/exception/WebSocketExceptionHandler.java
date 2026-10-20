package com.reownix.auction.websocket.exception;


import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import com.reownix.auction.exception.AuctionNotFoundException;
import com.reownix.auction.websocket.dto.WebSocketErrorMessage;
import com.reownix.auth.exception.UserNotFoundException;


@Controller
public class WebSocketExceptionHandler {

    @MessageExceptionHandler({
            AuctionNotFoundException.class,
            AuctionEndedException.class,
            MinimumBidIncrementException.class,
            SelfBiddingNotAllowedException.class,
            UserNotFoundException.class
    })
    @SendToUser("/queue/errors")
    public WebSocketErrorMessage handleKnownExceptions(Exception ex) {

        return WebSocketErrorMessage.builder()
                .success(false)
                .message(ex.getMessage())
                .build();
    }

    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public WebSocketErrorMessage handleUnknownException(Exception ex) {

        ex.printStackTrace();

        return WebSocketErrorMessage.builder()
                .success(false)
                .message("Internal Server Error")
                .build();
    }
}