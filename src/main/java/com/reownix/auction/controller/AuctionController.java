package com.reownix.auction.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.reownix.product.dto.response.ApiResponse;
import com.reownix.auction.request.CreateAuctionRequest;
import com.reownix.auction.request.PlaceBidRequest;
import com.reownix.auction.request.UpdateAuctionRequest;
import com.reownix.auction.response.AuctionDetailsResponse;
import com.reownix.auction.response.AuctionResponse;
import com.reownix.auction.response.BidResponse;
import com.reownix.auction.service.AuctionService;
import com.reownix.auction.service.BidService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auctions")
@RequiredArgsConstructor
@Tag(name = "Auction APIs", description = "Auction Management APIs")
public class AuctionController {

    private final AuctionService auctionService;
    private final BidService bidService;

    @Operation(summary = "Create Auction")
    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<ApiResponse<AuctionResponse>> createAuction(
            Authentication authentication,
            @Valid @RequestBody CreateAuctionRequest request) {

        AuctionResponse response = auctionService.createAuction(
                authentication.getName(),
                request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AuctionResponse>builder()
                        .success(true)
                        .message("Auction Created Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Update Auction")
    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionResponse>> updateAuction(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody UpdateAuctionRequest request) {

        AuctionResponse response = auctionService.updateAuction(
                id,
                authentication.getName(),
                request);

        return ResponseEntity.ok(
                ApiResponse.<AuctionResponse>builder()
                        .success(true)
                        .message("Auction Updated Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Cancel Auction")
    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> cancelAuction(
            @PathVariable Long id,
            Authentication authentication) {

        auctionService.cancelAuction(
                id,
                authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Auction Cancelled Successfully")
                        .data(null)
                        .build());
    }

    @Operation(summary = "Get All Active Auctions")
    @GetMapping
    public ResponseEntity<ApiResponse<List<AuctionResponse>>> getAllAuctions() {

        List<AuctionResponse> response =
                auctionService.getAllActiveAuctions();

        return ResponseEntity.ok(
                ApiResponse.<List<AuctionResponse>>builder()
                        .success(true)
                        .message("Auctions Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Get Auction Details")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AuctionDetailsResponse>> getAuctionById(
            @PathVariable Long id) {

        AuctionDetailsResponse response =
                auctionService.getAuctionById(id);

        return ResponseEntity.ok(
                ApiResponse.<AuctionDetailsResponse>builder()
                        .success(true)
                        .message("Auction Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Place Bid")
    @PreAuthorize("hasRole('USER')")
    @PostMapping("/{id}/bids")
    public ResponseEntity<ApiResponse<BidResponse>> placeBid(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody PlaceBidRequest request) {

        BidResponse response =
                bidService.placeBid(
                        id,
                        authentication.getName(),
                        request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<BidResponse>builder()
                        .success(true)
                        .message("Bid Placed Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Get Auction Bid History")
    @GetMapping("/{id}/bids")
    public ResponseEntity<ApiResponse<List<BidResponse>>> getBidHistory(
            @PathVariable Long id) {

        List<BidResponse> response =
                bidService.getAuctionBids(id);

        return ResponseEntity.ok(
                ApiResponse.<List<BidResponse>>builder()
                        .success(true)
                        .message("Bid History Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @Operation(summary = "Get My Bids")
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my-bids")
    public ResponseEntity<ApiResponse<List<BidResponse>>> getMyBids(
            Authentication authentication) {

        List<BidResponse> response =
                bidService.getMyBids(authentication.getName());

        return ResponseEntity.ok(
                ApiResponse.<List<BidResponse>>builder()
                        .success(true)
                        .message("My Bids Retrieved Successfully")
                        .data(response)
                        .build());
    }
    
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<AuctionResponse>> getAuctionByProduct(
            @PathVariable Long productId) {

        AuctionResponse response = auctionService.getAuctionByProductId(productId);

        return ResponseEntity.ok(
                ApiResponse.<AuctionResponse>builder()
                        .message("Auction fetched successfully")
                        .data(response)
                        .build()
        );
      
    }
}
