package com.reownix.product.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.product.entity.Product;
import com.reownix.product.entity.ProductImage;

public interface ProductImageRepository
        extends JpaRepository<ProductImage, Long> {

	 List<ProductImage> findByProduct(Product product);
}
