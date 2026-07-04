package com.reownix.product.service;

import java.util.List;

import com.reownix.product.dto.request.CreateCategoryRequest;
import com.reownix.product.dto.request.UpdateCategoryRequest;
import com.reownix.product.dto.response.CategoryResponse;

public interface CategoryService {

	CategoryResponse createCategory(CreateCategoryRequest request);

	CategoryResponse updateCategory(Long id,
	        UpdateCategoryRequest request);

	void deleteCategory(Long id);

	List<CategoryResponse> getAllCategories();

	CategoryResponse getCategoryById(Long id);
}
