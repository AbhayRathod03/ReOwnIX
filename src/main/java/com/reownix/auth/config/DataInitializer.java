package com.reownix.auth.config;

import org.springframework.boot.CommandLineRunner;

import org.springframework.stereotype.Component;

import com.reownix.auth.entity.Role;
import com.reownix.auth.enums.RoleType;
import com.reownix.auth.repository.RoleRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

	private final RoleRepository roleRepository;
	
	
	@Override
	public void run(String... args) throws Exception {
		if (roleRepository.count() == 0) {
            roleRepository.save(Role.builder()
                    .roleName(RoleType.ROLE_ADMIN)
                    .build());

            roleRepository.save(Role.builder()
                    .roleName(RoleType.ROLE_USER)
                    .build());
            
            System.out.println("Roles Created Successfully");
        }
		
	}
	
}
