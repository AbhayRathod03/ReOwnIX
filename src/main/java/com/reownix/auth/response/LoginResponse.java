package com.reownix.auth.response;



import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;

}