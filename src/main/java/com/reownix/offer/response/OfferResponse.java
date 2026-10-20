package com.reownix.offer.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.offer.enums.OfferStatus;

@Data
@Builder
public class OfferResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String productThumbnail;
    private String buyerName;
    private BigDecimal amount;
    private OfferStatus status;
    private LocalDateTime createdAt;
}
