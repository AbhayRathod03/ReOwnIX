package com.reownix.review.request;


import jakarta.validation.constraints.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReviewRequest {

    @NotNull
    private Long sellerId;

    @NotNull
    private Long productId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    @Size(max = 1000)
    private String comment;
}
