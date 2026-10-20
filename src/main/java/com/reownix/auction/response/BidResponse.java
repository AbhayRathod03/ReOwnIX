package com.reownix.auction.response;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class BidResponse {

    private Long id;

    private Long auctionId;

    private String bidderName;

    private BigDecimal amount;

    private LocalDateTime bidTime;
}
