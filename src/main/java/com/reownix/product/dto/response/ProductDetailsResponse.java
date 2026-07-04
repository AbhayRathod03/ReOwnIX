package com.reownix.product.dto.response;


import java.math.BigDecimal;
import java.util.List;

import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailsResponse {

    private Long id;

    private String title;

    private String description;

    private BigDecimal price;

    private Integer quantity;

    private String brand;

    private ProductCondition condition;

    private ProductStatus status;

    private ListingType listingType;

    private String category;

    private String ownerName;

    private List<String> images;

}
