package com.reownix.offer.repository;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.reownix.offer.entity.Offer;
import com.reownix.product.entity.Product;
import com.reownix.auth.entity.User;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {
    @EntityGraph(attributePaths = {"buyer", "product", "product.owner", "product.images"})
    List<Offer> findByProductOrderByCreatedAtDesc(Product product);

    @EntityGraph(attributePaths = {"buyer", "product", "product.owner", "product.images"})
    List<Offer> findByBuyerOrderByCreatedAtDesc(User buyer);
    boolean existsByProductAndBuyer(Product product, User buyer);

    long countByStatus(com.reownix.offer.enums.OfferStatus status);
}
