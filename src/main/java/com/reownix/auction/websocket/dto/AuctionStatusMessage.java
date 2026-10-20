package com.reownix.auction.websocket.dto;

import java.math.BigDecimal;

import com.reownix.auction.enums.AuctionStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuctionStatusMessage {

    private Long auctionId;

    private AuctionStatus status;

    private BigDecimal currentPrice;

    private String winnerName;

    private boolean ended;

}