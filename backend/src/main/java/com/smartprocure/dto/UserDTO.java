package com.smartprocure.dto;

import com.smartprocure.model.enums.Role;

public class UserDTO {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private Long departmentId;
    private String departmentName;

    public UserDTO() {}

    public UserDTO(Long id, String fullName, String email, Role role, Long departmentId, String departmentName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
}
