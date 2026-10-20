package com.reownix.auction.websocket.exception;

public class MinimumBidIncrementException extends RuntimeException {
	public MinimumBidIncrementException(String message) {
        super(message);
    }
}
