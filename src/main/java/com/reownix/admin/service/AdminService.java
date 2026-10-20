package com.reownix.admin.service;

import java.util.List;

import com.reownix.admin.response.DashboardResponse;
import com.reownix.auction.response.AuctionResponse;
import com.reownix.auth.response.UserResponse;
import com.reownix.product.dto.response.ProductResponse;

public interface AdminService {
	DashboardResponse getDashboard();
	
	List<UserResponse> getAllUsers();
	
	UserResponse getUserById(Long id);
	
	void disableUser(Long id);
	
	void enableUser(Long id );
	
	void deleteUser(Long id);
	
	List<ProductResponse> getAllProducts();

	void deleteProduct(Long productId);
	
	List<AuctionResponse> getAllAuctions();

	void deleteAuction(Long auctionId);
	
}
