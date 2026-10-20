package com.reownix.auction.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import com.reownix.auction.entity.Auction;
import com.reownix.auction.enums.AuctionStatus;
import com.reownix.product.entity.Product;

import jakarta.persistence.LockModeType;

public interface AuctionRepository extends JpaRepository<Auction, Long> {

    @EntityGraph(attributePaths = {"product", "product.owner", "winner"})
    List<Auction> findByStatus(AuctionStatus status);

    @EntityGraph(attributePaths = {"product", "product.owner", "winner"})
    List<Auction> findByStatusIn(List<AuctionStatus> statuses);

    @EntityGraph(attributePaths = {"product", "product.owner", "winner"})
    List<Auction> findAuctionsWithDetailsByStatus(AuctionStatus status);
    
    

    List<Auction> findByProductOwnerId(Long ownerId);

    boolean existsByProduct(Product product);

    Optional<Auction> findByProduct(Product product);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Auction> findWithLockById(Long id);

    long countByStatus(AuctionStatus status);
    
    Optional<Auction> findByProductId(Long productId);
    
    
}