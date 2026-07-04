package com.reownix.auth.service;

import com.reownix.auth.request.ChangePasswordRequest;
import com.reownix.auth.request.UpdateProfileRequest;
import com.reownix.auth.response.UserResponse;

public interface UserService {
	UserResponse getProfile(String email);
	
	UserResponse updateProfile(String email,UpdateProfileRequest request);
	
	String changePassword(String email,ChangePasswordRequest request);
}
