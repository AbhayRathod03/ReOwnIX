package com.reownix.wishlist.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;
import com.reownix.wishlist.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> { 
    
    List<Wishlist> findByBuyer(User buyer);
	
    // FIX: The duplicate, broken method declaration has been removed
	
    boolean existsByBuyerAndProduct(User buyer, Product product);
	
    Optional<Wishlist> findByBuyerAndProduct(User buyer, Product product);
}
