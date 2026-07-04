package com.reownix.auth.service.impl;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.reownix.auth.entity.Role;
import com.reownix.auth.entity.User;
import com.reownix.auth.enums.RoleType;
import com.reownix.auth.enums.UserStatus;
import com.reownix.auth.exception.EmailAlreadyExistsException;
import com.reownix.auth.exception.RoleNotFoundException;
import com.reownix.auth.repository.RoleRepository;
import com.reownix.auth.repository.UserRepository;
import com.reownix.auth.request.LoginRequest;
import com.reownix.auth.request.RegisterRequest;
import com.reownix.auth.response.LoginResponse;
import com.reownix.auth.security.JwtService;
import com.reownix.auth.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService{
	
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
	
	
	
	
	@Override
	public String register(RegisterRequest request) {
		if(userRepository.existsByEmail(request.getEmail())) {
			throw new EmailAlreadyExistsException ("email already exists");
		}
		
		Role role = roleRepository.findByRoleName(RoleType.ROLE_USER)
				.orElseThrow(() -> new RoleNotFoundException("Role Not found"));
				
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .status(UserStatus.ACTIVE)
                .role(role)
                .build();

        userRepository.save(user);
        return "User Registerd Sucessfully";
	
	}

	@Override
	public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole().getRoleName().name())
                .build();
    }
}