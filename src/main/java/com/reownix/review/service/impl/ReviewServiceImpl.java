package com.reownix.review.service.impl;


import java.util.List;

import org.springframework.stereotype.Service;

import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.repository.ProductRepository;
import com.reownix.review.entity.Review;
import com.reownix.review.exception.ReviewNotFoundException;
import com.reownix.review.repository.ReviewRepository;
import com.reownix.review.request.CreateReviewRequest;
import com.reownix.review.request.UpdateReviewRequest;
import com.reownix.review.response.ReviewResponse;
import com.reownix.review.response.SellerRatingResponse;
import com.reownix.review.service.ReviewService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public ReviewResponse createReview(
            String email,
            CreateReviewRequest request) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Buyer not found"));

        User seller = userRepository.findById(request.getSellerId())
                .orElseThrow(() ->
                        new UserNotFoundException("Seller not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        if (reviewRepository.existsByBuyerAndProduct(buyer, product)) {
            throw new IllegalArgumentException(
                    "You have already reviewed this product.");
        }

        Review review = Review.builder()
                .buyer(buyer)
                .seller(seller)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        reviewRepository.save(review);

        return mapToResponse(review);
    }

    @Override
    public ReviewResponse updateReview(
            Long reviewId,
            String email,
            UpdateReviewRequest request) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Buyer not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ReviewNotFoundException("Review not found"));

        if (!review.getBuyer().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException(
                    "You can update only your own review.");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);

        return mapToResponse(review);
    }

    @Override
    public void deleteReview(
            Long reviewId,
            String email) {

        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("Buyer not found"));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new ReviewNotFoundException("Review not found"));

        if (!review.getBuyer().getId().equals(buyer.getId())) {
            throw new IllegalArgumentException(
                    "You can delete only your own review.");
        }

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getSellerReviews(
            Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new UserNotFoundException("Seller not found"));

        return reviewRepository.findBySeller(seller)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public SellerRatingResponse getSellerRating(
            Long sellerId) {

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new UserNotFoundException("Seller not found"));

        Double average = reviewRepository.getAverageRating(sellerId);

        return SellerRatingResponse.builder()
                .averageRating(average == null ? 0.0 : average)
                .totalReviews(reviewRepository.countBySeller(seller))
                .build();
    }

    private ReviewResponse mapToResponse(Review review) {

        return ReviewResponse.builder()
                .reviewId(review.getId())
                .buyerName(
                        review.getBuyer().getFirstName()
                                + " "
                                + review.getBuyer().getLastName())
                .sellerName(
                        review.getSeller().getFirstName()
                                + " "
                                + review.getSeller().getLastName())
                .productTitle(review.getProduct().getTitle())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}