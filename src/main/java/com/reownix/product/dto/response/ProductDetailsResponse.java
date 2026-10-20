package com.reownix.product.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ProductStatus;

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

    // Seller
    private OwnerDTO owner;

    // Images
    private List<String> images;

    // Listing Details
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Statistics
    private Long views;

    private Long wishlistCount;

    private Long offerCount;
    
    }