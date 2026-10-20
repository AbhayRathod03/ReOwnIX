package com.reownix.admin.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.reownix.admin.response.DashboardResponse;
import com.reownix.admin.service.AdminService;
import com.reownix.auction.response.AuctionResponse;
import com.reownix.auth.response.UserResponse;
import com.reownix.product.dto.response.ApiResponse;
import com.reownix.product.dto.response.ProductResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {

        DashboardResponse response = adminService.getDashboard();

        return ResponseEntity.ok(
                ApiResponse.<DashboardResponse>builder()
                        .success(true)
                        .message("Dashboard Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> response = adminService.getAllUsers();

        return ResponseEntity.ok(
                ApiResponse.<List<UserResponse>>builder()
                        .success(true)
                        .message("Users Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id) {

        UserResponse response = adminService.getUserById(id);

        return ResponseEntity.ok(
                ApiResponse.<UserResponse>builder()
                        .success(true)
                        .message("User Retrieved Successfully")
                        .data(response)
                        .build());
    }

    @PutMapping("/users/{id}/disable")
    public ResponseEntity<ApiResponse<Object>> disableUser(
            @PathVariable Long id) {

        adminService.disableUser(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("User Disabled Successfully")
                        .data(null)
                        .build());
    }

    @PutMapping("/users/{id}/enable")
    public ResponseEntity<ApiResponse<Object>> enableUser(
            @PathVariable Long id) {

        adminService.enableUser(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("User Enabled Successfully")
                        .data(null)
                        .build());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteUser(
            @PathVariable Long id) {

        adminService.deleteUser(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("User Deleted Successfully")
                        .data(null)
                        .build());
    }
    
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {

        List<ProductResponse> response = adminService.getAllProducts();

        return ResponseEntity.ok(
                ApiResponse.<List<ProductResponse>>builder()
                        .success(true)
                        .message("Products Retrieved Successfully")
                        .data(response)
                        .build());
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteProduct(
            @PathVariable Long id) {

        adminService.deleteProduct(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Product Deleted Successfully")
                        .data(null)
                        .build());
    }
    
    @GetMapping("/auctions")
    public ResponseEntity<ApiResponse<List<AuctionResponse>>> getAllAuctions() {

        List<AuctionResponse> response =
                adminService.getAllAuctions();

        return ResponseEntity.ok(
                ApiResponse.<List<AuctionResponse>>builder()
                        .success(true)
                        .message("Auctions Retrieved Successfully")
                        .data(response)
                        .build());
    }
    
    @DeleteMapping("/auctions/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteAuction(
            @PathVariable Long id) {

        adminService.deleteAuction(id);

        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Auction Deleted Successfully")
                        .data(null)
                        .build());
    }
}
