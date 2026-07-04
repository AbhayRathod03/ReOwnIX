package com.reownix.product.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import com.reownix.product.dto.response.ApiResponse;
import com.reownix.product.dto.response.ProductImageResponse;
import com.reownix.product.service.ProductImageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductImageController {

    private final ProductImageService productImageService;

    @PostMapping("/products/{productId}/images")
    public ResponseEntity<ApiResponse<ProductImageResponse>> uploadImage(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {

        ProductImageResponse response =
                productImageService.uploadImage(
                        productId,
                        file,
                        authentication.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.<ProductImageResponse>builder()
                                .success(true)
                                .message("Image uploaded successfully")
                                .data(response)
                                .build()
                );
    }

    @GetMapping("/products/{productId}/images")
    public ResponseEntity<ApiResponse<List<ProductImageResponse>>> getProductImages(
            @PathVariable Long productId) {

        List<ProductImageResponse> response =
                productImageService.getProductImages(productId);

        return ResponseEntity.ok(
                ApiResponse.<List<ProductImageResponse>>builder()
                        .success(true)
                        .message("Images fetched successfully")
                        .data(response)
                        .build()
        );
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<ApiResponse<Object>> deleteImage(
            @PathVariable Long imageId,
            Authentication authentication) {

        productImageService.deleteImage(
                imageId,
                authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Image deleted successfully")
                        .data(null)
                        .build()
        );
    }

}
