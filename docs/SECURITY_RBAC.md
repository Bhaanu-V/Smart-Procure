# Security Architecture & RBAC Guidelines

SmartProcure enforces enterprise defense-in-depth security principles across authentication, authorization, and data validation.

## 1. Authentication Layer
- **JSON Web Tokens (JWT)**: HMAC SHA-256 signature with 24-hour expiration tokens.
- **BCrypt Password Encoding**: Hash strength of 10 rounds with per-user salt generation.
- **Account Verification**: Tokenized email verification and password reset workflows.

---

## 2. Role-Based Access Control (RBAC) Matrix

| Feature / Resource | EMPLOYEE | MANAGER | PROCUREMENT_OFFICER | FINANCE_OFFICER | ADMIN |
|--------------------|:--------:|:-------:|:--------------------:|:---------------:|:-----:|
| Create Requisition |    ✓     |    ✓    |          ✓           |        ✓        |   ✓   |
| View Own Requests  |    ✓     |    ✓    |          ✓           |        ✓        |   ✓   |
| View Dept Requests |    -     |    ✓    |          ✓           |        ✓        |   ✓   |
| Approve Requests   |    -     |    ✓    |          ✓           |        -        |   ✓   |
| Financial Release  |    -     |    -    |          -           |        ✓        |   ✓   |
| Budget Allocation  |    -     |    -    |          -           |        ✓        |   ✓   |
| User Management    |    -     |    -    |          -           |        -        |   ✓   |
| System Command Ctr |    -     |    -    |          -           |        -        |   ✓   |

---

## 3. Data Protection & Input Sanitization
- **SQL Injection Prevention**: Parameterized queries via Spring Data JPA and Hibernate ORM.
- **Cross-Origin Resource Sharing (CORS)**: Strict origin whitelisting allowing authorized frontends.
- **Payload Validation**: Hibernate Validator / Jakarta EE Bean Validation on all incoming DTOs.
