package com.reownix.product.service.impl;


import java.util.List;

import org.springframework.stereotype.Service;

import com.reownix.product.dto.request.CreateCategoryRequest;
import com.reownix.product.dto.request.UpdateCategoryRequest;
import com.reownix.product.dto.response.CategoryResponse;
import com.reownix.product.entity.Category;
import com.reownix.product.exception.CategoryNotFoundException;
import com.reownix.product.repository.CategoryRepository;
import com.reownix.product.service.CategoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory(CreateCategoryRequest request) {

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        categoryRepository.save(category);

        return mapToResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id,
                                           UpdateCategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found"));

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        categoryRepository.save(category);

        return mapToResponse(category);
    }

    @Override
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found"));

        categoryRepository.delete(category);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {

        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() ->
                        new CategoryNotFoundException("Category not found"));

        return mapToResponse(category);
    }

    // -----------------------
    // Helper Method
    // -----------------------

    private CategoryResponse mapToResponse(Category category) {

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();
    }
}
