package com.reownix.auction.websocket.dto;

import java.time.LocalDateTime;

import com.reownix.auction.enums.AuctionEventType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionEventMessage {
    private AuctionEventType type;
    private Long auctionId;
    private LocalDateTime timestamp;
    private Object payload;
}
