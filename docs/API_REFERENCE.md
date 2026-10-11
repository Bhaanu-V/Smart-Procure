# SmartProcure RESTful API Reference

All requests must include the header `Authorization: Bearer <jwt_token>` except for public authentication endpoints.

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **Path**: `/api/auth/register`
- **Request Body**:
  ```json
  {
    "fullName": "Jane Doe",
    "email": "jane@smartprocure.com",
    "password": "SecurePassword123!",
    "role": "EMPLOYEE",
    "departmentId": 1
  }
  ```
- **Response**: `200 OK` with `AuthResponseDTO` (`token`, `user`)

### Login
- **Method**: `POST`
- **Path**: `/api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "jane@smartprocure.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` with `AuthResponseDTO`

---

## 2. Purchase Request Endpoints

### List Purchase Requests
- **Method**: `GET`
- **Path**: `/api/requests`
- **Query Params**: `status`, `page`, `size`
- **Response**: `200 OK` with Page of `PurchaseRequestResponseDTO`

### Create Purchase Request
- **Method**: `POST`
- **Path**: `/api/requests`
- **Request Body**:
  ```json
  {
    "title": "Ergonomic Chairs for Team",
    "description": "5x ergonomic mesh chairs for new workspace",
    "estimatedCost": 1250.00,
    "urgency": "MEDIUM",
    "category": "Office Equipment",
    "departmentId": 1
  }
  ```
- **Response**: `201 Created`

### Get Request by ID
- **Method**: `GET`
- **Path**: `/api/requests/{id}`
- **Response**: `200 OK`

---

## 3. Approvals & Decision Endpoints

### Record Approval Decision
- **Method**: `POST`
- **Path**: `/api/approvals/{id}/action`
- **Request Body**:
  ```json
  {
    "action": "APPROVE",
    "comments": "Approved within budget allocation."
  }
  ```
- **Response**: `200 OK`

---

## 4. Budget Governance Endpoints

### Preview Budget Impact
- **Method**: `GET`
- **Path**: `/api/budget/impact?departmentId={id}&cost={cost}`
- **Response**: `200 OK` with `BudgetImpactDTO`
