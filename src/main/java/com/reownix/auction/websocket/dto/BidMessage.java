package com.reownix.auction.websocket.dto;


import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BidMessage {

    private Long auctionId;

    private BigDecimal bidAmount;
}