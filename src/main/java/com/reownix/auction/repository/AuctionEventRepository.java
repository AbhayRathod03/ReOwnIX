package com.reownix.auction.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.reownix.auction.entity.AuctionEvent;

@Repository
public interface AuctionEventRepository extends JpaRepository<AuctionEvent, Long> {
}
