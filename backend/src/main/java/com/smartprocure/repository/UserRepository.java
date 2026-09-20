package com.smartprocure.repository;

import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Boolean existsByEmail(String email);
    Boolean existsByEmailIgnoreCase(String email);
    List<User> findByDepartmentIdAndRole(Long departmentId, Role role);
    List<User> findByRole(Role role);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByResetPasswordToken(String resetPasswordToken);
}


