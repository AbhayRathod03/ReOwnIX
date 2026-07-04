package com.reownix.product.service;


import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.reownix.product.dto.response.ProductImageResponse;

public interface ProductImageService {

    ProductImageResponse uploadImage(
            Long productId,
            MultipartFile file,
            String email);

    List<ProductImageResponse> getProductImages(
            Long productId);

    void deleteImage(
            Long imageId,
            String email);
}
