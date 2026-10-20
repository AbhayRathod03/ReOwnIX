package com.reownix.auction.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.enums.AuctionStatus;
import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auction.request.CreateAuctionRequest;
import com.reownix.auction.request.UpdateAuctionRequest;
import com.reownix.auction.response.AuctionDetailsResponse;
import com.reownix.auction.response.AuctionResponse;
import com.reownix.auction.service.AuctionService;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuctionServiceImpl implements AuctionService {

    private final AuctionRepository auctionRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    
    
    private AuctionResponse mapToAuctionResponse(Auction auction) {

        return AuctionResponse.builder()
                .id(auction.getId())
                .productId(auction.getProduct().getId())
                .productTitle(auction.getProduct().getTitle())
                .currentPrice(auction.getCurrentPrice())
                .minimumBidIncrement(auction.getMinimumBidIncrement())
                .status(auction.getStatus())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .build();
    }
    
    
    private AuctionDetailsResponse mapToAuctionDetailsResponse(Auction auction) {

        User seller = auction.getProduct().getOwner();
        User winner = auction.getWinner();
        int bidCount = auction.getBids() != null ? auction.getBids().size() : 0;

        return AuctionDetailsResponse.builder()
                .id(auction.getId())
                .productId(auction.getProduct().getId())
                .productTitle(auction.getProduct().getTitle())
                .productThumbnail(
                        auction.getProduct().getImages() != null &&
                        !auction.getProduct().getImages().isEmpty()
                                ? auction.getProduct().getImages().get(0).getImageUrl()
                                : null
                )
                .sellerName(seller.getFirstName() + " " + seller.getLastName())
                .sellerId(seller.getId())
                .startingPrice(auction.getStartingPrice())
                .currentPrice(auction.getCurrentPrice())
                .minimumBidIncrement(auction.getMinimumBidIncrement())
                .status(auction.getStatus())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .winnerName(winner != null ? winner.getFirstName() + " " + winner.getLastName() : null)
                .winnerId(winner != null ? winner.getId() : null)
                .bidCount(bidCount)
                .build();
    }
    
    
    @Override
    public AuctionResponse createAuction(
            String email,
            CreateAuctionRequest request) {

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        if (!product.getOwner().getId().equals(seller.getId())) {
            throw new UnauthorizedException(
                    "You can auction only your own product");
        }

        if (auctionRepository.existsByProduct(product)) {
            throw new RuntimeException(
                    "Auction already exists for this product");
        }

        Auction auction = Auction.builder()
                .product(product)
                .startingPrice(request.getStartingPrice())
                .currentPrice(request.getStartingPrice())
                .minimumBidIncrement(request.getMinimumBidIncrement())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxEndTime(request.getEndTime().plusMinutes(30))  // Anti-sniping can extend up to 30 min max
                .status(AuctionStatus.UPCOMING)
                .build();

        auctionRepository.save(auction);

        return AuctionResponse.builder()
                .id(auction.getId())
                .productId(product.getId())
                .productTitle(product.getTitle())
                .currentPrice(auction.getCurrentPrice())
                .minimumBidIncrement(
                        auction.getMinimumBidIncrement())
                .status(auction.getStatus())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .build();
    }
    @Override
    public AuctionResponse updateAuction(
            Long auctionId,
            String email,
            UpdateAuctionRequest request) {

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        if (!auction.getProduct()
                .getOwner()
                .getId()
                .equals(seller.getId())) {

            throw new UnauthorizedException(
                    "Not authorized");
        }

        if (auction.getStatus() != AuctionStatus.UPCOMING) {
            throw new IllegalStateException("Only UPCOMING auctions can be updated.");
        }

        auction.setMinimumBidIncrement(
                request.getMinimumBidIncrement());

        auction.setStartTime(
                request.getStartTime());

        auction.setEndTime(
                request.getEndTime());

        auctionRepository.save(auction);

        return AuctionResponse.builder()
                .id(auction.getId())
                .productId(
                        auction.getProduct().getId())
                .productTitle(
                        auction.getProduct().getTitle())
                .currentPrice(
                        auction.getCurrentPrice())
                .minimumBidIncrement(
                        auction.getMinimumBidIncrement())
                .status(auction.getStatus())
                .startTime(
                        auction.getStartTime())
                .endTime(
                        auction.getEndTime())
                .build();
    }
    @Override
    public void cancelAuction(
            Long auctionId,
            String email) {

        User seller = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() ->
                        new RuntimeException("Auction not found"));

        if (!auction.getProduct()
                .getOwner()
                .getId()
                .equals(seller.getId())) {

            throw new UnauthorizedException(
                    "Not authorized");
        }

        if (auction.getStatus() == AuctionStatus.ENDED) {
            throw new IllegalStateException("Cannot cancel an auction that has already ended.");
        }
        
        if (auction.getStatus() == AuctionStatus.ACTIVE && auction.getBids() != null && !auction.getBids().isEmpty()) {
            throw new IllegalStateException("Cannot cancel an active auction that already has bids.");
        }

        auction.setStatus(AuctionStatus.CANCELLED);

        auctionRepository.save(auction);
    }
	@Override
	public List<AuctionResponse> getAllActiveAuctions() {

	    return auctionRepository
	            .findByStatus(AuctionStatus.ACTIVE)
	            .stream()
	            .map(auction ->
	                    AuctionResponse.builder()
	                            .id(auction.getId())
	                            .productId(
	                                    auction.getProduct().getId())
	                            .productTitle(
	                                    auction.getProduct().getTitle())
	                            .currentPrice(
	                                    auction.getCurrentPrice())
	                            .minimumBidIncrement(
	                                    auction.getMinimumBidIncrement())
	                            .status(
	                                    auction.getStatus())
	                            .startTime(
	                                    auction.getStartTime())
	                            .endTime(
	                                    auction.getEndTime())
	                            .build())
	            .toList();
	}
	@Override
	public AuctionDetailsResponse getAuctionById(
	        Long auctionId) {

	    Auction auction = auctionRepository.findById(auctionId)
	            .orElseThrow(() ->
	                    new RuntimeException("Auction not found"));

	    return mapToAuctionDetailsResponse(auction);
	}
	
	@Override
	public List<AuctionResponse> getLiveAuctions() {
	    return auctionRepository.findByStatus(AuctionStatus.ACTIVE)
	            .stream()
	            .map(this::mapToAuctionResponse)
	            .toList();
	}

	@Override
	public List<AuctionResponse> getUpcomingAuctions() {
	    return auctionRepository.findByStatus(AuctionStatus.UPCOMING)
	            .stream()
	            .map(this::mapToAuctionResponse)
	            .toList();
	}

	@Override
	public List<AuctionResponse> getEndedAuctions() {
	    return auctionRepository.findByStatus(AuctionStatus.ENDED)
	            .stream()
	            .map(this::mapToAuctionResponse)
	            .toList();
	}
	
	@Override
	public AuctionResponse getAuctionByProductId(Long productId) {

	    Product product = productRepository.findById(productId)
	            .orElseThrow(() ->
	                    new ProductNotFoundException("Product not found"));

	    Auction auction = auctionRepository.findByProduct(product)
	            .orElseThrow(() ->
	                    new RuntimeException("Auction not found"));

	    return AuctionResponse.builder()
	            .id(auction.getId())
	            .productId(product.getId())
	            .productTitle(product.getTitle())
	            .currentPrice(auction.getCurrentPrice())
	            .minimumBidIncrement(auction.getMinimumBidIncrement())
	            .status(auction.getStatus())
	            .startTime(auction.getStartTime())
	            .endTime(auction.getEndTime())
	            .build();
	}
}
