package com.reownix.auction.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.reownix.auction.enums.AuctionStatus;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AuctionDetailsResponse {

    private Long id;

    private String productTitle;

    private String sellerName;

    private Long sellerId;

    private BigDecimal startingPrice;

    private BigDecimal currentPrice;

    private BigDecimal minimumBidIncrement;

    private AuctionStatus status;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String winnerName;

    private Long winnerId;

    private int bidCount;

    private List<BidResponse> bids;

    private Long productId;

    private String productThumbnail;
}
