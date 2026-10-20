package com.reownix.wishlist.service;

import java.util.List;

import com.reownix.wishlist.response.WishlistResponse;

public interface WishlistService {
 
	 WishlistResponse addToWishlist(Long productid,String email);
	 
	 void removeFromWishlist(Long productid,String email);
	 
	 List<WishlistResponse> getMyWishlist(String email);
}
