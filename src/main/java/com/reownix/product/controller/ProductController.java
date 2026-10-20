package com.reownix.product.controller;

import java.util.List;


import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.reownix.product.dto.response.ApiResponse;
import com.reownix.product.dto.response.ProductDetailsResponse;
import com.reownix.product.dto.request.CreateProductRequest;
import com.reownix.product.dto.request.UpdateProductRequest;
import com.reownix.product.dto.response.ProductResponse;
import com.reownix.product.repository.ProductRepository;
import com.reownix.product.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(

            Authentication authentication,

            @Valid @RequestBody CreateProductRequest request) {

        ProductResponse response = productService.createProduct(
                authentication.getName(),
                request);

        return ResponseEntity.ok(

                ApiResponse.<ProductResponse>builder()

                        .success(true)

                        .message("Product Created Successfully")

                        .data(response)

                        .build());

    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
    	@PathVariable Long id,
    	
    	Authentication authentication,
    	
    	@Valid @RequestBody UpdateProductRequest request){
    	ProductResponse response = productService.updateProduct(id, authentication.getName(), request);
    	
    	return ResponseEntity.ok(

                ApiResponse.<ProductResponse>builder()

                        .success(true)

                        .message("Product Updated Successfully")

                        .data(response)

                        .build());
    
}
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(

            @PathVariable Long id,

            Authentication authentication) {

        productService.deleteProduct(
                id,
                authentication.getName());

        return ResponseEntity.ok(

                ApiResponse.builder()

                        .success(true)

                        .message("Product Deleted Successfully")

                        .data(null)

                        .build());

    }
    @GetMapping("/my-products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getMyProducts(

            Authentication authentication) {

        List<ProductResponse> response =
                productService.getMyProducts(
                        authentication.getName());

        return ResponseEntity.ok(

                ApiResponse.<List<ProductResponse>>builder()

                        .success(true)

                        .message("Products Retrieved Successfully")

                        .data(response)

                        .build());

    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getAllProducts(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt,desc")
            String sortBy,
            
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) com.reownix.product.enums.ProductCondition condition,
            @RequestParam(required = false) com.reownix.product.enums.ListingType listingType,
            @RequestParam(required = false) java.math.BigDecimal minPrice,
            @RequestParam(required = false) java.math.BigDecimal maxPrice,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Boolean myProducts) {

        String ownerEmail = null;
        if (Boolean.TRUE.equals(myProducts)) {
            org.springframework.security.core.Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
                ownerEmail = authentication.getName();
            }
        }

        Page<ProductResponse> response =
                productService.getAllProducts(
                        page,
                        size,
                        sortBy,
                        categoryId,
                        brand,
                        condition,
                        listingType,
                        minPrice,
                        maxPrice,
                        keyword,
                        ownerEmail);

        return ResponseEntity.ok(

                ApiResponse.<Page<ProductResponse>>builder()

                        .success(true)

                        .message("Products Retrieved Successfully")

                        .data(response)

                        .build());

    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(

            @RequestParam String keyword) {

        List<ProductResponse> response =
                productService.searchProducts(keyword);

        return ResponseEntity.ok(

                ApiResponse.<List<ProductResponse>>builder()

                        .success(true)

                        .message("Products Found")

                        .data(response)

                        .build());

    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductDetailsResponse>> getProductById(
            @PathVariable Long id) {

        ProductDetailsResponse response =
                productService.getProductById(id);

        return ResponseEntity.ok(

                ApiResponse.<ProductDetailsResponse>builder()
                        .success(true)
                        .message("Product Retrieved Successfully")
                        .data(response)
                        .build());
    }
    
}
    
    
    
    
  