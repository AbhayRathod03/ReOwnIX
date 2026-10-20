package com.reownix.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.auction.enums.AuctionStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAuctionResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String sellerName;
    private Long sellerId;
    private BigDecimal startingPrice;
    private BigDecimal currentPrice;
    private AuctionStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String winnerName;
    private Long winnerId;
}
