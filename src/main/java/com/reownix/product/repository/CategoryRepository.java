package com.reownix.product.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.product.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

	Optional<Category> findByName(String name);
	
	boolean existsByName(String name);
}
