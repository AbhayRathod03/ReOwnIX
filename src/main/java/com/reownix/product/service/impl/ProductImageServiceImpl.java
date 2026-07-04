package com.reownix.product.service.impl;


import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.dto.response.ProductImageResponse;
import com.reownix.product.entity.Product;
import com.reownix.product.entity.ProductImage;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.repository.ProductImageRepository;
import com.reownix.product.repository.ProductRepository;
import com.reownix.product.service.CloudinaryService;
import com.reownix.product.service.ProductImageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProductImageResponse uploadImage(
            Long productId,
            MultipartFile file,
            String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        if (!product.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException(
                    "You are not allowed to upload images");
        }

        String imageUrl;

        try {
            imageUrl = cloudinaryService.uploadFile(file);
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }

        ProductImage image = ProductImage.builder()
                .imageUrl(imageUrl)
                .product(product)
                .build();

        productImageRepository.save(image);

        return ProductImageResponse.builder()
                .id(image.getId())
                .imageUrl(image.getImageUrl())
                .build();
    }

    @Override
    public List<ProductImageResponse> getProductImages(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        return productImageRepository.findByProduct(product)
                .stream()
                .map(image ->
                        ProductImageResponse.builder()
                                .id(image.getId())
                                .imageUrl(image.getImageUrl())
                                .build())
                .toList();
    }

    @Override
    public void deleteImage(
            Long imageId,
            String email) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() ->
                        new RuntimeException("Image not found"));

        if (!image.getProduct().getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException(
                    "You are not allowed to delete this image");
        }

        cloudinaryService.deleteFile(image.getImageUrl());

        productImageRepository.delete(image);
    }

}