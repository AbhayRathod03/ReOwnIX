package com.reownix.admin.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.reownix.product.enums.ProductStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProductResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private String condition;
    private String brand;
    private String listingType;
    private ProductStatus status;
    private String ownerName;
    private Long ownerId;
    private Integer views;
    private LocalDateTime createdAt;
}
