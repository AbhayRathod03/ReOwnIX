package com.reownix.auction.websocket.exception;

public class AuctionNotActiveException extends RuntimeException {
	public AuctionNotActiveException(String message) {
        super(message);
    }
}
