package com.reownix.auction.request;


import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceBidRequest {

    @NotNull
    @Positive
    private BigDecimal amount;
}
