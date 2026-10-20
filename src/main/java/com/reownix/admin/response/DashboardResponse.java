package com.reownix.admin.response;

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
public class DashboardResponse {

    private Long totalUsers;

    private Long totalProducts;

    private Long totalCategories;

    private Long totalAuctions;

    private Long activeAuctions;

    private Long totalWishlistItems;

    private Long activeUsers;
    private Long availableProducts;
    private Long soldProducts;
    private Long completedAuctions;
    private Long pendingOffers;
    private Long acceptedOffers;
    private Long reviews;
    private Long messages;
}
