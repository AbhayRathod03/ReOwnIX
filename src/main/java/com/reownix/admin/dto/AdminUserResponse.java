package com.reownix.admin.dto;

import java.time.LocalDateTime;

import com.reownix.auth.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String profileImage;
    private UserStatus status;
    private String roleName;
    private LocalDateTime createdAt;
    private Boolean enabled;
    private Boolean deleted;
}
