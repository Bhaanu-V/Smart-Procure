package com.smartprocure.config;

import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.Role;
import com.smartprocure.repository.DepartmentRepository;
import com.smartprocure.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(DepartmentRepository departmentRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (departmentRepository.count() == 0) {
            List<Department> defaultDepartments = List.of(
                Department.builder().name("Engineering").code("ENG").budgetAllocated(new BigDecimal("500000.00")).build(),
                Department.builder().name("Finance & Accounting").code("FIN").budgetAllocated(new BigDecimal("250000.00")).build(),
                Department.builder().name("Operations & Logistics").code("OPS").budgetAllocated(new BigDecimal("300000.00")).build(),
                Department.builder().name("Human Resources").code("HR").budgetAllocated(new BigDecimal("150000.00")).build(),
                Department.builder().name("Sales & Marketing").code("MKT").budgetAllocated(new BigDecimal("200000.00")).build()
            );
            departmentRepository.saveAll(defaultDepartments);
        }

        Department eng = departmentRepository.findAll().stream().findFirst().orElse(null);

        if (!userRepository.existsByEmail("admin@smartprocure.com")) {
            userRepository.save(User.builder()
                .fullName("System Administrator")
                .email("admin@smartprocure.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .department(eng)
                .isEmailVerified(true)
                .build());
        }

        if (!userRepository.existsByEmail("manager@smartprocure.com")) {
            userRepository.save(User.builder()
                .fullName("Sarah Jenkins (Manager)")
                .email("manager@smartprocure.com")
                .passwordHash(passwordEncoder.encode("manager123"))
                .role(Role.MANAGER)
                .department(eng)
                .isEmailVerified(true)
                .build());
        }

        if (!userRepository.existsByEmail("employee@smartprocure.com")) {
            userRepository.save(User.builder()
                .fullName("Alex Chen (Employee)")
                .email("employee@smartprocure.com")
                .passwordHash(passwordEncoder.encode("employee123"))
                .role(Role.EMPLOYEE)
                .department(eng)
                .isEmailVerified(true)
                .build());
        }
    }
}
