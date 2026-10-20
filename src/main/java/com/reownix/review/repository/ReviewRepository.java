package com.reownix.review.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;
import com.reownix.product.repository.ProductRepository;
import com.reownix.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review ,Long> {

	List<Review> findBySeller(User seller);
	
	List<Review> findByBuyer(User Buyer);
	
	Optional<Review> findByBuyerAndProduct(User buyer,Product product);
	
	boolean existsByBuyerAndProduct(User buyer, Product product);
	
	long countBySeller(User seller);
	
	@Query("""
		       SELECT AVG(r.rating)
		       FROM Review r
		       WHERE r.seller.id = :sellerId
		       """)
		Double getAverageRating(@Param("sellerId") Long sellerId);
}
