package com.reownix.review.service;

import java.util.List;

import com.reownix.review.request.CreateReviewRequest;
import com.reownix.review.request.UpdateReviewRequest;
import com.reownix.review.response.ReviewResponse;
import com.reownix.review.response.SellerRatingResponse;

public interface ReviewService {

	ReviewResponse createReview(String email, CreateReviewRequest request);

	ReviewResponse updateReview(Long reviewId, String email, UpdateReviewRequest request);

	void deleteReview(Long reviewId, String email);

	List<ReviewResponse> getSellerReviews(Long sellerId);

	SellerRatingResponse getSellerRating(Long sellerId);
	
	
	
}
