package com.reownix.product.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reownix.auction.repository.AuctionRepository;
import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.dto.request.CreateProductRequest;
import com.reownix.product.dto.request.UpdateProductRequest;
import com.reownix.product.dto.response.OwnerDTO;
import com.reownix.product.dto.response.ProductDetailsResponse;
import com.reownix.product.dto.response.ProductResponse;
import com.reownix.product.entity.Category;
import com.reownix.product.entity.Product;
import com.reownix.product.enums.ProductStatus;
import com.reownix.product.exception.CategoryNotFoundException;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.exception.UnauthorizedException;
import com.reownix.product.repository.CategoryRepository;
import com.reownix.product.repository.ProductRepository;
import com.reownix.product.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final UserRepository userRepository;
    private final AuctionRepository auctionRepository;
	// --- 3 & 4. Centralized Helper Mapping Methods ---

	private ProductResponse mapToProductResponse(Product product) {

	    OwnerDTO owner = null;

	    if (product.getOwner() != null) {
	        owner = OwnerDTO.builder()
	                .id(product.getOwner().getId())
	                .firstName(product.getOwner().getFirstName())
	                .lastName(product.getOwner().getLastName())
	                .email(product.getOwner().getEmail())
	                .profileImage(product.getOwner().getProfileImage())
	                .build();
	    }

	    return ProductResponse.builder()
	            .id(product.getId())
	            .title(product.getTitle())
	            .price(product.getPrice())
	            .brand(product.getBrand())
	            .condition(product.getCondition())
	            .listingType(product.getListingType())
	            .category(product.getCategory() != null
	                    ? product.getCategory().getName()
	                    : null)
	            .owner(owner)
	            .thumbnail(
	                    product.getImages() != null &&
	                    !product.getImages().isEmpty()
	                            ? product.getImages().get(0).getImageUrl()
	                            : null
	            )
	            .build();
	}

	private ProductDetailsResponse mapToProductDetailsResponse(Product product) {

	    OwnerDTO owner = OwnerDTO.builder()
	            .id(product.getOwner().getId())
	            .firstName(product.getOwner().getFirstName())
	            .lastName(product.getOwner().getLastName())
	            .email(product.getOwner().getEmail())
	            .phone(product.getOwner().getPhone())
	            .address(product.getOwner().getAddress())
	            .profileImage(product.getOwner().getProfileImage())

	            // Temporary values
	            .rating(4.8)
	            .reviewsCount(0L)
	            .listingCount(
	                    (long) productRepository
	                            .findByOwner(product.getOwner())
	                            .size()
	            )
	            .memberSince(product.getOwner().getCreatedAt())
	            .verified(true)

	            .build();

	    return ProductDetailsResponse.builder()
	            .id(product.getId())
	            .title(product.getTitle())
	            .description(product.getDescription())
	            .price(product.getPrice())
	            .quantity(product.getQuantity())
	            .brand(product.getBrand())
	            .condition(product.getCondition())
	            .status(product.getStatus())
	            .listingType(product.getListingType())
	            .category(product.getCategory().getName())
	            .owner(owner)
	            .images(
	                    product.getImages()
	                            .stream()
	                            .map(image -> image.getImageUrl())
	                            .toList()
	            )

	            .createdAt(product.getCreatedAt())
	            .updatedAt(product.getUpdatedAt())

	            // Temporary values
	            .views(0L)
	            .wishlistCount(0L)
	            .offerCount(0L)

	            .build();
	}

	// --- Core Business Logic Methods ---

	@Override
	public ProductResponse createProduct(String email, CreateProductRequest request) {
		User owner = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("user not found"));

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new CategoryNotFoundException("category not found"));

		Product product = Product.builder()
				.title(request.getTitle())
				.description(request.getDescription())
				.price(request.getPrice())
				.quantity(request.getQuantity())
				.brand(request.getBrand())
				.condition(request.getCondition())
				.listingType(request.getListingType())
				.status(ProductStatus.AVAILABLE)
				.owner(owner)
				.category(category)
				.build();

		productRepository.save(product);

		return mapToProductResponse(product);
	}

	@Override
	public ProductResponse updateProduct(Long productId, String email, UpdateProductRequest request) {
		User owner = userRepository.findByEmail(email)
				.orElseThrow(() -> new UserNotFoundException("User not found"));

		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ProductNotFoundException("Product not found"));

		if (!product.getOwner().getId().equals(owner.getId())) {
			 throw new UnauthorizedException("You are not allowed to update this product");
		}

		Category category = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new CategoryNotFoundException("Category not found"));

		product.setTitle(request.getTitle());
		product.setDescription(request.getDescription());
		product.setPrice(request.getPrice());
		product.setQuantity(request.getQuantity());
		product.setBrand(request.getBrand());
		product.setCondition(request.getCondition());
		product.setListingType(request.getListingType());
		product.setCategory(category);

		productRepository.save(product);

		return mapToProductResponse(product);
	}

	@Override
	public void deleteProduct(Long productId, String email) {

	    User owner = userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    Product product = productRepository.findById(productId)
	            .orElseThrow(() -> new ProductNotFoundException("Product not found"));

	    if (!product.getOwner().getId().equals(owner.getId())) {
	        throw new UnauthorizedException("You are not allowed to delete this product");
	    }

	    // Delete auction (JPA will automatically delete bids and auction events)
	    auctionRepository.findByProduct(product)
	            .ifPresent(auctionRepository::delete);

	    // Delete other dependent records
	    productRepository.deleteOffersByProductId(productId);
	    productRepository.deleteConversationsByProductId(productId);
	    productRepository.deleteReviewsByProductId(productId);
	    productRepository.deleteWishlistsByProductId(productId);

	    // Finally delete product
	    productRepository.delete(product);
	}

	@Override
	public List<ProductResponse> getMyProducts(String email) {
	    User owner = userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    return productRepository.findByOwner(owner)
	            .stream()
	            .map(this::mapToProductResponse)
	            .toList();
	}

	@Override
	public ProductDetailsResponse getProductById(Long productId) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ProductNotFoundException("Product not found with id: " + productId));
		
		return mapToProductDetailsResponse(product);
	}

	@Override
	public List<ProductResponse> searchProducts(String keyword) {
	    return productRepository
	            .findByTitleContainingIgnoreCaseAndStatus(keyword, ProductStatus.AVAILABLE)
	            .stream()
	            .map(this::mapToProductResponse)
	            .toList();
	}

	@Override
	public Page<ProductResponse> getAllProducts(
	        int page, 
	        int size, 
	        String sortBy,
	        Long categoryId,
	        String brand,
	        com.reownix.product.enums.ProductCondition condition,
	        com.reownix.product.enums.ListingType listingType,
	        java.math.BigDecimal minPrice,
	        java.math.BigDecimal maxPrice,
	        String keyword,
	        String ownerEmail) {
	        
	    Sort sort;
	    if ("price_desc".equals(sortBy) || "price,desc".equals(sortBy)) {
	        sort = Sort.by("price").descending();
	    } else if ("price_asc".equals(sortBy) || "price,asc".equals(sortBy)) {
	        sort = Sort.by("price").ascending();
	    } else if ("createdAt".equals(sortBy) || "createdAt,desc".equals(sortBy) || "newest".equals(sortBy)) {
	        sort = Sort.by("createdAt").descending();
	    } else if ("createdAt,asc".equals(sortBy) || "oldest".equals(sortBy)) {
	        sort = Sort.by("createdAt").ascending();
	    } else if ("title,asc".equals(sortBy) || "name,asc".equals(sortBy)) {
	        sort = Sort.by("title").ascending();
	    } else if ("title,desc".equals(sortBy) || "name,desc".equals(sortBy)) {
	        sort = Sort.by("title").descending();
	    } else {
	        // default
	        sort = Sort.by("createdAt").descending();
	    }

	    Pageable pageable = PageRequest.of(page, size, sort);

	    org.springframework.data.jpa.domain.Specification<Product> spec = 
	        com.reownix.product.specification.ProductSpecification.filterProducts(
	            categoryId, brand, condition, listingType, minPrice, maxPrice, keyword, ownerEmail
	        );

	    Page<Product> products = productRepository.findAll(spec, pageable);

	    return products.map(this::mapToProductResponse);
	}
}