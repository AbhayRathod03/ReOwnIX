package com.reownix.auction.websocket.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidBroadcastMessage {
    private Long auctionId;
    private Long bidderId;
    private String bidderName;
    private BigDecimal amount;
    private LocalDateTime bidTime;
}
