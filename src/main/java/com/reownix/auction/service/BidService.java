package com.reownix.auction.service;


import java.util.List;

import com.reownix.auction.request.PlaceBidRequest;
import com.reownix.auction.response.BidResponse;


public interface BidService {

    BidResponse placeBid(
            Long auctionId,
            String email,
            PlaceBidRequest request);

    List<BidResponse> getAuctionBids(
            Long auctionId);

    List<BidResponse> getMyBids(
            String email);

}
