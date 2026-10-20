package com.reownix.offer.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.reownix.offer.enums.OfferStatus;
import com.reownix.offer.request.MakeOfferRequest;
import com.reownix.offer.response.OfferResponse;
import com.reownix.offer.service.OfferService;
import com.reownix.product.dto.response.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
@Tag(name = "Offer APIs", description = "Marketplace Make Offer APIs")
public class OfferController {

    private final OfferService offerService;

    @Operation(summary = "Make an Offer on a Product")
    @PostMapping
    public ResponseEntity<ApiResponse<OfferResponse>> makeOffer(
            Authentication authentication,
            @Valid @RequestBody MakeOfferRequest request) {

        OfferResponse response = offerService.makeOffer(authentication.getName(), request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<OfferResponse>builder()
                        .success(true)
                        .message("Offer placed successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Get Offers for a Product (Seller Only)")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<OfferResponse>>> getProductOffers(
            @PathVariable Long productId,
            Authentication authentication) {
        try {
            List<OfferResponse> response = offerService.getProductOffers(productId, authentication.getName());
            return ResponseEntity.ok(
                    ApiResponse.<List<OfferResponse>>builder()
                            .success(true)
                            .message("Product offers retrieved successfully")
                            .data(response)
                            .build());
        } catch (Exception e) {
            try {
                java.io.PrintWriter pw = new java.io.PrintWriter(new java.io.FileWriter("C:\\Users\\abhay\\error_log.txt", true));
                e.printStackTrace(pw);
                pw.close();
            } catch (Exception ex) {}
            throw e;
        }
    }

    @Operation(summary = "Get My Offers (Buyer)")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    @GetMapping("/my-offers")
    public ResponseEntity<ApiResponse<List<OfferResponse>>> getMyOffers(
            Authentication authentication) {

        List<OfferResponse> response = offerService.getMyOffers(authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<List<OfferResponse>>builder()
                        .success(true)
                        .message("My offers retrieved successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Update Offer Status (Seller Only)")
    @PutMapping("/{offerId}/status")
    public ResponseEntity<ApiResponse<OfferResponse>> updateOfferStatus(
            @PathVariable Long offerId,
            @RequestParam OfferStatus status,
            Authentication authentication) {

        OfferResponse response = offerService.updateOfferStatus(offerId, status, authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<OfferResponse>builder()
                        .success(true)
                        .message("Offer status updated successfully")
                        .data(response)
                        .build());
    }
}
