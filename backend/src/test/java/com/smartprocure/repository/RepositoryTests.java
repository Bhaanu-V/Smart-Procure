package com.smartprocure.repository;

import com.smartprocure.model.entity.Department;
import com.smartprocure.model.entity.User;
import com.smartprocure.model.enums.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class RepositoryTests {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testSaveAndFindDepartment() {
        Department dept = Department.builder()
                .name("Information Technology")
                .code("IT")
                .budgetAllocated(new BigDecimal("100000.00"))
                .build();

        Department saved = departmentRepository.save(dept);
        assertThat(saved.getId()).isNotNull();

        Optional<Department> found = departmentRepository.findByCode("IT");
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Information Technology");
    }

    @Test
    public void testSaveAndFindUser() {
        Department dept = departmentRepository.save(Department.builder()
                .name("Research")
                .code("RES")
                .build());

        User user = User.builder()
                .fullName("John Doe")
                .email("john.doe@smartprocure.com")
                .passwordHash("hashedpassword123")
                .role(Role.EMPLOYEE)
                .department(dept)
                .build();

        User savedUser = userRepository.save(user);
        assertThat(savedUser.getId()).isNotNull();

        Optional<User> found = userRepository.findByEmail("john.doe@smartprocure.com");
        assertThat(found).isPresent();
        assertThat(found.get().getRole()).isEqualTo(Role.EMPLOYEE);
    }
}
