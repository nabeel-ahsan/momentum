# Momentum API Documentation

Welcome to the Momentum API documentation. This document outlines the API endpoints, authentication flows, request/response formats, and validation requirements for the Momentum application.

---

## 1. General Architecture & Standards

### Base URL
All API requests in local development should be sent to:
`http://localhost:3000`

For staging or production deployments, use the designated environment domain (e.g., `https://your-api-domain.com`).

### Authentication Flow
The Momentum API uses **JWT (JSON Web Token)** for authorization on protected routes.
1. **Signup/Login**: Obtain a JWT by calling `POST /api/v1/auth/signup` or `POST /api/v1/auth/login`.
2. **Bearer Token Authentication**: For all protected endpoints, attach the JWT in the `Authorization` header as a Bearer token:
   ```http
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Expiry**: JWTs expire in **7 days** from generation.

### Error Handling Format
All API error responses follow a consistent structured format:
```json
{
  "success": false,
  "message": "Error description message",
  "errors": {
    "field": "Specific validation or database error details"
  }
}
```
*Note: In development environments, error payloads may include an additional `stack` property containing the stack trace.*

---

## 2. Authentication Endpoints

### 2.1 User Signup (Registration)
Registers a new user account.

* **URL**: `/api/v1/auth/signup`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body Schema**:
  | Field | Type | Required | Validation Rules | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `name` | String | Yes | 3 to 100 characters | The full name of the user |
  | `email` | String | Yes | Valid email format, max 100 characters | Unique email address |
  | `password` | String | Yes | Min 6 characters, max 100 characters | The user's account password |

#### Request Body Example
```json
{
  "name": "Alex Developer",
  "email": "alex.dev@example.com",
  "password": "securepassword123"
}
```

#### Success Response
* **Status**: `201 Created`
* **Response Body Example**:
  ```json
  {
    "success": true,
    "message": "User created successfully"
  }
  ```

#### Error Responses
* **Status**: `400 Bad Request` (Validation Failed / Email Taken)
  ```json
  {
    "success": false,
    "message": "Email already exists.",
    "errors": {
      "email": "email is already taken."
    }
  }
  ```

---

### 2.2 User Login
Authenticates an existing user and returns a signed JWT.

* **URL**: `/api/v1/auth/login`
* **Method**: `POST`
* **Headers**: `Content-Type: application/json`
* **Request Body Schema**:
  | Field | Type | Required | Validation Rules | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `email` | String | Yes | Valid email format | User account email |
  | `password` | String | Yes | Min 6 characters | User account password |

#### Request Body Example
```json
{
  "email": "alex.dev@example.com",
  "password": "securepassword123"
}
```

#### Success Response
* **Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "success": true,
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6676cf47f3bca8817a0279d4",
      "name": "Alex Developer",
      "email": "alex.dev@example.com"
    }
  }
  ```

#### Error Responses
* **Status**: `401 Unauthorized` (Invalid Credentials)
  ```json
  {
    "success": false,
    "message": "Invalid Credentials!",
    "errors": {}
  }
  ```

---

## 3. Focus Session Endpoints

All endpoints in this section are protected and require the `Authorization` Bearer token.

### 3.1 Create Focus Session
Logs a new focused work session.

* **URL**: `/api/v1/sessions`
* **Method**: `POST`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **Request Body Schema**:
  | Field | Type | Required | Validation Rules | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `type` | String | Yes | Enum: `DSA`, `Development`, `Applications`, `Learning`, `Other` | The category of the session |
  | `status` | String | Yes | Enum: `Completed`, `In Progress` | Current completion status |
  | `title` | String | Yes | 3 to 100 characters | Descriptive name of the task |
  | `duration` | Number | Yes | Positive integer | Focused duration in **minutes** |
  | `notes` | String | No | Optional notes | Engineering detail notes |
  | `link` | String | No | Valid URL or empty string | Reference URL (e.g., LeetCode link) |

#### Request Body Example
```json
{
  "type": "Development",
  "status": "In Progress",
  "title": "Refactoring API routes to REST standards",
  "duration": 45,
  "notes": "Removing verbs from URIs and checking tests alignment",
  "link": "https://github.com/nabeel-ahsan/momentum"
}
```

#### Success Response
* **Status**: `201 Created`
* **Response Body Example**:
  ```json
  {
    "message": "Session Created Successfully!",
    "savedSession": {
      "_id": "6676cf74f3bca8817a0279d9",
      "type": "Development",
      "status": "In Progress",
      "title": "Refactoring API routes to REST standards",
      "duration": 45,
      "notes": "Removing verbs from URIs and checking tests alignment",
      "link": "https://github.com/nabeel-ahsan/momentum",
      "userId": "6676cf47f3bca8817a0279d4",
      "createdAt": "2026-06-22T17:45:00.000Z",
      "updatedAt": "2026-06-22T17:45:00.000Z",
      "__v": 0
    }
  }
  ```

#### Error Responses
* **Status**: `400 Bad Request` (Validation Failure)
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "duration": "Duration must be a positive number."
    }
  }
  ```
* **Status**: `401 Unauthorized` (Token Missing or Invalid)
  ```json
  {
    "success": false,
    "message": "Access denied. No token provided.",
    "errors": {}
  }
  ```

---

### 3.2 List Focus Sessions (Paginated & Filtered)
Retrieve a list of the user's logged focus sessions. Results are filtered by month (defaults to current month) and support pagination.

* **URL**: `/api/v1/sessions`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `month` | String | No | Current YYYY-MM | Format `YYYY-MM` to fetch sessions for that month |
  | `startDate` | String | No | None | Format `YYYY-MM-DD` (overrides `month` if provided) |
  | `endDate` | String | No | None | Format `YYYY-MM-DD` (overrides `month` if provided) |
  | `type` | String | No | None | Filter by category (e.g., `DSA`, `Development`) |
  | `page` | Number | No | `1` | Page index (minimum `1`) |
  | `limit` | Number | No | `20` | Items per page (maximum `20`) |

#### Success Response
* **Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "sessions": [
      {
        "_id": "6676cf74f3bca8817a0279d9",
        "type": "Development",
        "status": "In Progress",
        "title": "Refactoring API routes to REST standards",
        "duration": 45,
        "notes": "Removing verbs from URIs and checking tests alignment",
        "link": "https://github.com/nabeel-ahsan/momentum",
        "userId": "6676cf47f3bca8817a0279d4",
        "createdAt": "2026-06-22T17:45:00.000Z",
        "updatedAt": "2026-06-22T17:45:00.000Z",
        "__v": 0
      }
    ],
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "totalPosts": 1
  }
  ```

---

### 3.3 Update Focus Session
Updates the details of an existing focus session resource.

* **URL**: `/api/v1/sessions/:id`
* **Method**: `PUT`
* **Headers**:
  * `Authorization: Bearer <token>`
  * `Content-Type: application/json`
* **URL Parameters**:
  * `id` (String): The 24-character hexadecimal MongoDB ObjectId of the focus session.
* **Request Body Schema**: Same schema as **3.1 Create Focus Session**.

#### Request Body Example
```json
{
  "type": "Development",
  "status": "Completed",
  "title": "Refactoring API routes to REST standards - Finished",
  "duration": 50,
  "notes": "All routes changed, tests fixed and verified successfully",
  "link": "https://github.com/nabeel-ahsan/momentum"
}
```

#### Success Response
* **Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "_id": "6676cf74f3bca8817a0279d9",
    "type": "Development",
    "status": "Completed",
    "title": "Refactoring API routes to REST standards - Finished",
    "duration": 50,
    "notes": "All routes changed, tests fixed and verified successfully",
    "link": "https://github.com/nabeel-ahsan/momentum",
    "userId": "6676cf47f3bca8817a0279d4",
    "createdAt": "2026-06-22T17:45:00.000Z",
    "updatedAt": "2026-06-22T18:02:10.000Z",
    "__v": 0
  }
  ```

#### Error Responses
* **Status**: `400 Bad Request` (Invalid ID Format or Validation Failure)
  ```json
  {
    "success": false,
    "message": "Validation failed",
    "errors": {
      "title": "Title must be at least 3 characters long."
    }
  }
  ```
* **Status**: `404 Not Found` (Session belongs to another user, or does not exist)
  ```json
  {
    "success": false,
    "message": "Session not found",
    "errors": {}
  }
  ```

---

### 3.4 Delete Focus Session
Removes a logged focus session from the database.

* **URL**: `/api/v1/sessions/:id`
* **Method**: `DELETE`
* **Headers**: `Authorization: Bearer <token>`
* **URL Parameters**:
  * `id` (String): The 24-character hexadecimal MongoDB ObjectId of the session to delete.

#### Success Response
* **Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "message": "Session Deleted Successfully!"
  }
  ```

#### Error Responses
* **Status**: `404 Not Found` (Session belongs to another user, or does not exist)
  ```json
  {
    "success": false,
    "message": "Session not found",
    "errors": {}
  }
  ```

---

### 3.5 Get Session Statistics
Retrieves aggregates statistics of sessions categorized by type, counts, and total focused durations for a given month.

* **URL**: `/api/v1/sessions/stats`
* **Method**: `GET`
* **Headers**: `Authorization: Bearer <token>`
* **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `month` | String | No | Current YYYY-MM | Format `YYYY-MM` to fetch stats for that month |

#### Success Response
* **Status**: `200 OK`
* **Response Body Example**:
  ```json
  {
    "totalSessions": 15,
    "totalDuration": 675,
    "sessionsByType": {
      "DSA": 5,
      "Development": 8,
      "Learning": 2
    }
  }
  ```
