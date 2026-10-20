package com.reownix.wishlist.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.reownix.wishlist.response.WishlistResponse;
import com.reownix.wishlist.service.WishlistService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlishController {

    private final WishlistService wishlistService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishlistResponse> addToWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        WishlistResponse response = wishlistService.addToWishlist(productId, userDetails.getUsername());
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        wishlistService.removeFromWishlist(productId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-wishlist")
    public ResponseEntity<List<WishlistResponse>> getMyWishlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        
        List<WishlistResponse> wishlist = wishlistService.getMyWishlist(userDetails.getUsername());
        return ResponseEntity.ok(wishlist);
    }
}
