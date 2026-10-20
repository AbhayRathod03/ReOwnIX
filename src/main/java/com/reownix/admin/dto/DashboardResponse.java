package com.reownix.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private Long totalUsers;
    private Long activeUsers;
    private Long totalProducts;
    private Long availableProducts;
    private Long soldProducts;
    private Long totalAuctions;
    private Long activeAuctions;
    private Long completedAuctions;
    private Long pendingOffers;
    private Long acceptedOffers;
    private Long wishlistItems;
    private Long reviews;
    private Long messages;
}
