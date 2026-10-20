package com.reownix.review.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerRatingResponse {

    private Double averageRating;

    private Long totalReviews;
}
