package com.reownix.auth.service;


import com.reownix.auth.request.LoginRequest;
import com.reownix.auth.request.RegisterRequest;
import com.reownix.auth.response.LoginResponse;

public  interface AuthService {

	String register(RegisterRequest request);
	
    LoginResponse login(LoginRequest request);
}
