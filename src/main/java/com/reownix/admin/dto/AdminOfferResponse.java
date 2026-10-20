package com.reownix.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.offer.enums.OfferStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminOfferResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private Long buyerId;
    private String buyerName;
    private BigDecimal amount;
    private OfferStatus status;
    private LocalDateTime createdAt;
}
