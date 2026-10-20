package com.reownix.wishlist.service.impl;

import java.util.List;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.reownix.auth.entity.User;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.product.entity.Product;
import com.reownix.product.exception.ProductNotFoundException;
import com.reownix.product.repository.ProductRepository;
import com.reownix.wishlist.entity.Wishlist;
import com.reownix.wishlist.exception.WhishlistAlreadyExistsException;
import com.reownix.wishlist.repository.WishlistRepository;
import com.reownix.wishlist.response.WishlistResponse;
import com.reownix.wishlist.service.WishlistService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

	private final UserRepository userRepository;
	private final ProductRepository productRepository;
	private final WishlistRepository wishlistRepository; 
	
	
	@Override
	public WishlistResponse addToWishlist(Long productid, String email) {
	  User buyer = userRepository.findByEmail(email)
			  .orElseThrow(() -> new UsernameNotFoundException("User not found"));
	  
	  Product product = productRepository.findById(productid)
			  .orElseThrow(() -> new ProductNotFoundException("Product not found"));
	  
	  if(wishlistRepository.existsByBuyerAndProduct(buyer,product)) {
		  throw new WhishlistAlreadyExistsException("Product already exists in wishlist");
	  }
	  
	  Wishlist wishlist = Wishlist.builder()
			  .buyer(buyer)
			  .product(product)
			  .build();
	  
	  wishlistRepository.save(wishlist);
	  
      return WishlistResponse.builder()
              .wishlistId(wishlist.getId())
              .productId(product.getId())
              .title(product.getTitle())
              .price(product.getPrice())
              .brand(product.getBrand())
              .thumbnail(
                      product.getImages() != null &&
                      !product.getImages().isEmpty()
                              ? product.getImages().get(0).getImageUrl()
                              : null)
              .sellerName(
                      product.getOwner().getFirstName() + " "
                              + product.getOwner().getLastName())
              .build();
				
				
	}

	@Override
	public void removeFromWishlist(Long productid, String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        Product product = productRepository.findById(productid)
                .orElseThrow(() ->
                        new ProductNotFoundException("Product not found"));

        Wishlist wishlist = wishlistRepository
                .findByBuyerAndProduct(buyer, product)
                .orElseThrow(() ->
                        new RuntimeException("Wishlist item not found"));

        wishlistRepository.delete(wishlist);
		
	}

	@Override
	public List<WishlistResponse> getMyWishlist(String email) {
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

        return wishlistRepository.findByBuyer(buyer)
                .stream()
                .map(wishlist -> {

                    Product product = wishlist.getProduct();

                    return WishlistResponse.builder()
                            .wishlistId(wishlist.getId())
                            .productId(product.getId())
                            .title(product.getTitle())
                            .price(product.getPrice())
                            .brand(product.getBrand())
                            .thumbnail(
                                    product.getImages() != null &&
                                    !product.getImages().isEmpty()
                                            ? product.getImages().get(0).getImageUrl()
                                            : null)
                            .sellerName(
                                    product.getOwner().getFirstName() + " "
                                            + product.getOwner().getLastName())
                            .build();
                })
                .toList();
	}

	
}
