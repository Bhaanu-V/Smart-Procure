package com.smartprocure.config;

import com.smartprocure.model.entity.Department;
import com.smartprocure.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DepartmentRepository departmentRepository;

    public DataInitializer(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
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
    }
}
