package com.reownix.wishlist.response;

import java.math.BigDecimal;

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
public class WishlistResponse {

    private Long wishlistId;

    private Long productId;

    private String title;

    private BigDecimal price;

    private String brand;

    private String thumbnail;

    private String sellerName;
}