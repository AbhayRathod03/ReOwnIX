package com.reownix.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;
import com.reownix.product.enums.ProductStatus;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ProductRepository
        extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"owner", "category", "images"})
    List<Product> findByOwner(User owner);

    @EntityGraph(attributePaths = {"owner", "category", "images"})
    List<Product> findByStatus(ProductStatus status);

    @EntityGraph(attributePaths = {"owner", "category", "images"})
    Page<Product> findByStatus(
            ProductStatus status,
            Pageable pageable);

    @EntityGraph(attributePaths = {"owner", "category", "images"})
    List<Product> findByTitleContainingIgnoreCaseAndStatus(
            String keyword,
            ProductStatus status);

    @EntityGraph(attributePaths = {"owner", "category", "images"})
    Optional<Product> findByIdAndStatus(
            Long id,
            ProductStatus status);

    long countByStatus(ProductStatus status);

    @Modifying
    @Query(value = "DELETE FROM auction WHERE product_id = ?1", nativeQuery = true)
    void deleteAuctionsByProductId(Long productId);

    @Modifying
    @Query(value = "DELETE FROM offers WHERE product_id = ?1", nativeQuery = true)
    void deleteOffersByProductId(Long productId);

    @Modifying
    @Query(value = "DELETE FROM conversations WHERE product_id = ?1", nativeQuery = true)
    void deleteConversationsByProductId(Long productId);

    @Modifying
    @Query(value = "DELETE FROM reviews WHERE product_id = ?1", nativeQuery = true)
    void deleteReviewsByProductId(Long productId);

    @Modifying
    @Query(value = "DELETE FROM wishlist WHERE product_id = ?1", nativeQuery = true)
    void deleteWishlistsByProductId(Long productId);
    
    @Modifying
    @Query(value = """
    DELETE FROM auction_events
    WHERE auction_id IN (
        SELECT id
        FROM auction
        WHERE product_id = ?1
    )
    """, nativeQuery = true)
    void deleteAuctionEventsByProductId(Long productId);
}