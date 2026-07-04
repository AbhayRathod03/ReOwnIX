package com.reownix.product.dto.request;

import java.math.BigDecimal;

import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProductRequest {
	
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal price;

    @NotNull
    private Integer quantity;

    private String brand;

    @NotNull
    private ProductCondition condition;

    @NotNull
    private ListingType listingType;

    @NotNull
    private Long categoryId;
  
}
