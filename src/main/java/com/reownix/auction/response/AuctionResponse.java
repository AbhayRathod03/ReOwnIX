package com.reownix.auction.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.auction.enums.AuctionStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuctionResponse {

    private Long id;

    private Long productId;

    private String productTitle;

    private BigDecimal currentPrice;

    private BigDecimal minimumBidIncrement;

    private AuctionStatus status;

    private LocalDateTime startTime;

    private LocalDateTime endTime;
}
