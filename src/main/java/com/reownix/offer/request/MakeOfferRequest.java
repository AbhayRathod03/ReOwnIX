package com.reownix.offer.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class MakeOfferRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Offer amount is required")
    @DecimalMin(value = "0.01", message = "Offer amount must be greater than zero")
    private BigDecimal amount;
}
