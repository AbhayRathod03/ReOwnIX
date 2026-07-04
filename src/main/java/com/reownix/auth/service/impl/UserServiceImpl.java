package com.reownix.auth.service.impl;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.reownix.auth.entity.User;
import com.reownix.auth.exception.InvalidPasswordException;
import com.reownix.auth.exception.UserNotFoundException;
import com.reownix.auth.repository.UserRepository;
import com.reownix.auth.request.ChangePasswordRequest;
import com.reownix.auth.request.UpdateProfileRequest;
import com.reownix.auth.response.UserResponse;
import com.reownix.auth.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	
	private final UserRepository userRepository;
	private final ModelMapper modelMapper;//matches for dto
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public UserResponse getProfile(String email) {
		 User user = userRepository.findByEmail(email)
				 .orElseThrow(() -> new UserNotFoundException("User not found"));
		 
		 UserResponse response = modelMapper.map(user, UserResponse.class);//modifies user data for UserResponse template
		 
		 response.setRole(user.getRole().getRoleName().name());//model mapper cant handle complex types like enum so we are setting this manually
		 return response;
 	}

	@Override
	public UserResponse updateProfile(String email, UpdateProfileRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(()->new UserNotFoundException("User not found"));
		
		user.setFirstName(request.getFirstName());
		user.setLastName(request.getLastName());
		user.setPhone(request.getPhone());
		user.setAddress(request.getAddress());
		user.setProfileImage(request.getProfileImage());
		
		userRepository.save(user);
		
		UserResponse response = modelMapper.map(user, UserResponse.class);
		response.setRole(user.getRole().getRoleName().name());
		
		return response;
	}

	@Override
	public String changePassword(String email, ChangePasswordRequest request) {
		User user = userRepository.findByEmail(email)
				.orElseThrow(()->new UserNotFoundException("User not found"));
		
		if(!passwordEncoder.matches(
				request.getOldPassword(),
				user.getPassword())) {
			throw new InvalidPasswordException("Old password is incorrect");
		}
		
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		return "Password Changed Successfully";
	}

}
