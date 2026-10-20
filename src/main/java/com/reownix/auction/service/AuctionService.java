package com.reownix.auction.service;


import java.util.List;

import com.reownix.auction.request.CreateAuctionRequest;
import com.reownix.auction.request.UpdateAuctionRequest;
import com.reownix.auction.response.AuctionDetailsResponse;
import com.reownix.auction.response.AuctionResponse;



public interface AuctionService {

    AuctionResponse createAuction(
            String email,
            CreateAuctionRequest request);

    AuctionResponse updateAuction(
            Long auctionId,
            String email,
            UpdateAuctionRequest request);

    void cancelAuction(
            Long auctionId,
            String email);

    List<AuctionResponse> getAllActiveAuctions();

    AuctionDetailsResponse getAuctionById(
            Long auctionId);
    
    
    List<AuctionResponse> getLiveAuctions();

    List<AuctionResponse> getUpcomingAuctions();

    List<AuctionResponse> getEndedAuctions();
    
    AuctionResponse getAuctionByProductId(Long productId);

}