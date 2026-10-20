package com.reownix.review.response;


import java.time.LocalDateTime;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long reviewId;

    private String buyerName;

    private String sellerName;

    private String productTitle;

    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;
}