package com.reownix.auction.request;


import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAuctionRequest {

    @NotNull
    private Long productId;

    @NotNull
    @Positive
    private BigDecimal startingPrice;

    @NotNull
    @Positive
    private BigDecimal minimumBidIncrement;

    @NotNull
    @Future
    private LocalDateTime startTime;

    @NotNull
    @Future
    private LocalDateTime endTime;
}