package com.reownix.auction.websocket.service;


import com.reownix.auction.websocket.dto.BidMessage;

public interface AuctionWebSocketService {

    void placeBid(
            String email,
            BidMessage message);

}
