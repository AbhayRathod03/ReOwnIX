package com.reownix.product.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.reownix.product.entity.Product;
import com.reownix.product.enums.ProductCondition;
import com.reownix.product.enums.ListingType;
import com.reownix.product.enums.ProductStatus;

import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification {

    public static Specification<Product> filterProducts(
            Long categoryId,
            String brand,
            ProductCondition condition,
            ListingType listingType,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String keyword,
            String ownerEmail) {
        
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            // Only fetch active products by default
            predicates.add(criteriaBuilder.equal(root.get("status"), ProductStatus.AVAILABLE));

            if (ownerEmail != null && !ownerEmail.trim().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.join("owner").get("email"), ownerEmail));
            }

            if (categoryId != null) {
                predicates.add(criteriaBuilder.equal(root.join("category").get("id"), categoryId));
            }

            if (brand != null && !brand.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("brand")), "%" + brand.toLowerCase() + "%"));
            }

            if (condition != null) {
                predicates.add(criteriaBuilder.equal(root.get("condition"), condition));
            }

            if (listingType != null) {
                predicates.add(criteriaBuilder.equal(root.get("listingType"), listingType));
            }

            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            if (keyword != null && !keyword.trim().isEmpty()) {
                String likePattern = "%" + keyword.toLowerCase() + "%";
                Predicate titleMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), likePattern);
                Predicate descMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("description")), likePattern);
                predicates.add(criteriaBuilder.or(titleMatch, descMatch));
            }

            // We want to eagerly fetch owner, category, and images to match the @EntityGraph in the repository,
            // but fetching collections in a Page query can throw multiple bag fetch exceptions or lead to in-memory paging.
            // However, doing join fetch on owner and category is safe.
            if (Long.class != query.getResultType()) {
                root.fetch("owner", jakarta.persistence.criteria.JoinType.LEFT);
                root.fetch("category", jakarta.persistence.criteria.JoinType.LEFT);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
