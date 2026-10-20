package com.reownix.auction.request;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAuctionRequest {

    @Positive
    private BigDecimal minimumBidIncrement;

    @Future
    private LocalDateTime startTime;

    @Future
    private LocalDateTime endTime;
}
