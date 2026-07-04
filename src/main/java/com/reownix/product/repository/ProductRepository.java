package com.reownix.product.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.auth.entity.User;
import com.reownix.product.entity.Product;
import com.reownix.product.enums.ProductStatus;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    List<Product> findByOwner(User owner);

    List<Product> findByStatus(ProductStatus status);

    Page<Product> findByStatus(
            ProductStatus status,
            Pageable pageable);

    List<Product> findByTitleContainingIgnoreCaseAndStatus(
            String keyword,
            ProductStatus status);

    Optional<Product> findByIdAndStatus(
            Long id,
            ProductStatus status);

}