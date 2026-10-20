package com.reownix.product.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OwnerDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private String address;

    private String profileImage;

    // Seller statistics
    private Double rating;

    private Long reviewsCount;

    private Long listingCount;

    private LocalDateTime memberSince;

    private Boolean verified;

}