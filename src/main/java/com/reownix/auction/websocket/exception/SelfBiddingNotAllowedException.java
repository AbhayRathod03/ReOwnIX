package com.reownix.auction.websocket.exception;

public class SelfBiddingNotAllowedException extends RuntimeException {
	public SelfBiddingNotAllowedException(String message) {
        super(message);
    }
}
