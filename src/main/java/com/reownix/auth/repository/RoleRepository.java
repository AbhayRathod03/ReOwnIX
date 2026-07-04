package com.reownix.auth.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reownix.auth.entity.Role;
import com.reownix.auth.entity.User;
import com.reownix.auth.enums.RoleType;

public interface RoleRepository extends JpaRepository<Role, Long> {

	  Optional<Role> findByRoleName(RoleType roleName);

}
