package com.reownix.auction.websocket.dto;



import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.auction.enums.AuctionStatus;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionUpdateMessage {

    private Long auctionId;

    private BigDecimal currentPrice;

    private BigDecimal minimumBidIncrement;

    private String highestBidder;

    private Integer totalBids;

    private AuctionStatus status;

    private LocalDateTime bidTime;

    private LocalDateTime endTime;

    private Long winnerId;

    private String winnerName;

    private boolean ended;

}