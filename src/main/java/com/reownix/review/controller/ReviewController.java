package com.reownix.review.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.reownix.product.dto.response.ApiResponse;
import com.reownix.review.request.CreateReviewRequest;
import com.reownix.review.request.UpdateReviewRequest;
import com.reownix.review.response.ReviewResponse;
import com.reownix.review.response.SellerRatingResponse;
import com.reownix.review.service.ReviewService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            Authentication authentication,
            @Valid @RequestBody CreateReviewRequest request) {

        ReviewResponse response =
                reviewService.createReview(
                        authentication.getName(),
                        request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<ReviewResponse>builder()
                                .success(true)
                                .message("Review Created Successfully")
                                .data(response)
                                .build());
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(
            @PathVariable Long reviewId,
            Authentication authentication,
            @Valid @RequestBody UpdateReviewRequest request) {

        ReviewResponse response =
                reviewService.updateReview(
                        reviewId,
                        authentication.getName(),
                        request);

        return ResponseEntity.ok(
                ApiResponse.<ReviewResponse>builder()
                        .success(true)
                        .message("Review Updated Successfully")
                        .data(response)
                        .build());
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse<Object>> deleteReview(
            @PathVariable Long reviewId,
            Authentication authentication) {

        reviewService.deleteReview(
                reviewId,
                authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Review Deleted Successfully")
                        .data(null)
                        .build());
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getSellerReviews(
            @PathVariable Long sellerId) {

        List<ReviewResponse> response =
                reviewService.getSellerReviews(sellerId);

        return ResponseEntity.ok(
                ApiResponse.<List<ReviewResponse>>builder()
                        .success(true)
                        .message("Seller Reviews Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/seller/{sellerId}/rating")
    public ResponseEntity<ApiResponse<SellerRatingResponse>> getSellerRating(
            @PathVariable Long sellerId) {

        SellerRatingResponse response =
                reviewService.getSellerRating(sellerId);

        return ResponseEntity.ok(
                ApiResponse.<SellerRatingResponse>builder()
                        .success(true)
                        .message("Seller Rating Retrieved Successfully")
                        .data(response)
                        .build());
    }
}
