package com.smartprocure.service.impl;

import com.smartprocure.dto.DepartmentDTO;
import com.smartprocure.exception.ResourceNotFoundException;
import com.smartprocure.model.entity.Department;
import com.smartprocure.repository.DepartmentRepository;
import com.smartprocure.service.DepartmentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentServiceImpl(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @Override
    @Transactional
    public List<DepartmentDTO> getAllDepartments() {
        List<Department> list = departmentRepository.findAll();
        if (list.isEmpty()) {
            List<Department> defaultDepartments = List.of(
                Department.builder().name("Engineering").code("ENG").budgetAllocated(new BigDecimal("500000.00")).build(),
                Department.builder().name("Finance & Accounting").code("FIN").budgetAllocated(new BigDecimal("250000.00")).build(),
                Department.builder().name("Operations & Logistics").code("OPS").budgetAllocated(new BigDecimal("300000.00")).build(),
                Department.builder().name("Human Resources").code("HR").budgetAllocated(new BigDecimal("150000.00")).build(),
                Department.builder().name("Sales & Marketing").code("MKT").budgetAllocated(new BigDecimal("200000.00")).build()
            );
            list = departmentRepository.saveAll(defaultDepartments);
        }
        return list.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + id));
        return mapToDTO(dept);
    }

    private DepartmentDTO mapToDTO(Department dept) {
        return new DepartmentDTO(
                dept.getId(),
                dept.getName(),
                dept.getCode(),
                dept.getBudgetAllocated()
        );
    }
}
