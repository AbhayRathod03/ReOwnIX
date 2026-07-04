package com.reownix.auth.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.reownix.auth.request.ChangePasswordRequest;
import com.reownix.auth.request.UpdateProfileRequest;
import com.reownix.auth.response.UserResponse;
import com.reownix.auth.service.UserService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public UserResponse getProfile(Authentication authentication) {

        return userService.getProfile(authentication.getName());
    }

    @PutMapping("/profile")
    public UserResponse updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        return userService.updateProfile(
                authentication.getName(),
                request);
    }

    @PutMapping("/change-password")
    public String changePassword(
            Authentication authentication,
            @RequestBody ChangePasswordRequest request) {

        return userService.changePassword(
                authentication.getName(),
                request);
    }
}
