package com.reownix.auth.request;


import lombok.Data;

@Data
public class UpdateProfileRequest {

    private String firstName;

    private String lastName;

    private String phone;

    private String address;

    private String profileImage;

}
