package com.reownix.product.dto.response;

import java.math.BigDecimal;

import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;

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
public class ProductResponse {

    private Long id;

    private String title;

    private BigDecimal price;

    private String brand;

    private ProductCondition condition;

    private ListingType listingType;

    private String category;

    private OwnerDTO owner;

    private String thumbnail;

}