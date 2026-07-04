package com.reownix.product.service;

import java.util.List;

import org.springframework.data.domain.Page;


import com.reownix.product.dto.request.CreateProductRequest;
import com.reownix.product.dto.request.UpdateProductRequest;
import com.reownix.product.dto.response.ProductDetailsResponse;
import com.reownix.product.dto.response.ProductResponse;

public interface ProductService {
 
	ProductResponse createProduct(String email,
			CreateProductRequest request);
	
	ProductResponse updateProduct(Long productId,String email,
			UpdateProductRequest request);
	
	void deleteProduct(Long productId,String email);
	
    List<ProductResponse> getMyProducts(String email);

    Page<ProductResponse> getAllProducts(
            int page,
            int size,
            String sortBy);

    ProductDetailsResponse getProductById(Long productId);

    List<ProductResponse> searchProducts(String keyword);
	
}
