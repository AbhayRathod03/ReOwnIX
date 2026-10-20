package com.reownix.auction.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.entity.Bid;
import com.reownix.auth.entity.User;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionOrderByAmountDesc(Auction auction);

    List<Bid> findByBidder(User bidder);

    Optional<Bid> findTopByAuctionOrderByAmountDesc(Auction auction);
    
    long countByAuctionId(Long auctionId);
    
    Optional<Bid> findTopByAuctionOrderByBidTimeDesc(Auction auction);
    
    Optional<Bid> findTopByAuctionOrderByAmountDescBidTimeAsc(Auction auction);
    
    

}