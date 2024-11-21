# Leave Management System - Backend Documentation

## Backend Setup and API Documentation

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally
- Git (optional)

### Installation Steps

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create or modify `.env` file in the root directory with:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leave_management
JWT_SECRET=your_jwt_secret_key_here
```

3. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### 1. Login
- **URL:** `POST /api/auth/login`
- **Body:**
```json
{
    "employeeId": "EMP001",
    "password": "password123"
}
```
- **Response:**
```json
{
    "token": "jwt_token_here",
    "user": {
        "id": "user_id",
        "employeeId": "EMP001",
        "name": "John Doe",
        "role": "employee",
        "department": "IT",
        "leaveBalance": {
            "casual": 12,
            "sick": 12,
            "annual": 24
        }
    }
}
```

#### 2. Register (Admin only)
- **URL:** `POST /api/auth/register`
- **Body:**
```json
{
    "employeeId": "EMP001",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "employee",
    "department": "IT"
}
```
- **Response:**
```json
{
    "message": "User created successfully"
}
```

### Leave Management Routes (`/api/leaves`)

#### 1. Submit Leave Request
- **URL:** `POST /api/leaves`
- **Auth:** Required
- **Body:**
```json
{
    "leaveType": "casual",
    "startDate": "2023-09-01",
    "endDate": "2023-09-02",
    "reason": "Personal work"
}
```
- **Response:**
```json
{
    "message": "Leave request submitted successfully"
}
```

#### 2. Get My Leave Requests
- **URL:** `GET /api/leaves/my-leaves`
- **Auth:** Required
- **Response:**
```json
[
    {
        "id": "leave_id",
        "leaveType": "casual",
        "startDate": "2023-09-01",
        "endDate": "2023-09-02",
        "reason": "Personal work",
        "status": "pending",
        "createdAt": "2023-08-30T10:00:00.000Z"
    }
]
```

#### 3. Get All Leave Requests (Admin only)
- **URL:** `GET /api/leaves/all`
- **Auth:** Required (Admin)
- **Response:**
```json
[
    {
        "id": "leave_id",
        "user": {
            "name": "John Doe",
            "employeeId": "EMP001",
            "department": "IT"
        },
        "leaveType": "casual",
        "startDate": "2023-09-01",
        "endDate": "2023-09-02",
        "reason": "Personal work",
        "status": "pending",
        "createdAt": "2023-08-30T10:00:00.000Z"
    }
]
```

#### 4. Update Leave Status (Admin only)
- **URL:** `PATCH /api/leaves/:id/status`
- **Auth:** Required (Admin)
- **Body:**
```json
{
    "status": "approved",
    "comments": "Approved as requested"
}
```
- **Response:**
```json
{
    "message": "Leave request updated successfully"
}
```

## Database Schema

### User Model
```javascript
{
    employeeId: String (required, unique),
    name: String (required),
    email: String (required, unique),
    password: String (required, hashed),
    role: String (enum: ['admin', 'employee']),
    department: String (required),
    leaveBalance: {
        casual: Number (default: 12),
        sick: Number (default: 12),
        annual: Number (default: 24)
    }
}
```

### Leave Model
```javascript
{
    user: ObjectId (ref: 'User'),
    leaveType: String (enum: ['casual', 'sick', 'annual']),
    startDate: Date (required),
    endDate: Date (required),
    reason: String (required),
    status: String (enum: ['pending', 'approved', 'rejected']),
    approvedBy: ObjectId (ref: 'User'),
    approvalDate: Date,
    comments: String
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. To access protected routes:
1. Login to get the JWT token
2. Include the token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

Each error response includes a message explaining the error:
```json
{
    "message": "Error description here"
}
```
