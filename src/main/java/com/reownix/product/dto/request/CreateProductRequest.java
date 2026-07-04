package com.reownix.product.dto.request;

import java.math.BigDecimal;

import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
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
public class CreateProductRequest {
	
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull
    @Min(1)
    private Integer quantity;

    private String brand;

    @NotNull
    private ProductCondition condition;

    @NotNull
    private ListingType listingType;

    @NotNull
    private Long categoryId;

	
	
}
