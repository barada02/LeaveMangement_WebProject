# Leave Management System (LMS)

A web-based system for managing employee leave requests in a company. This project provides separate interfaces for employees to submit leave requests and administrators to manage them.

## Features

### Employee Features
- Submit leave requests
- View leave history
- Track leave status
- Manage profile

### Admin Features
- Dashboard with leave statistics
- Approve/reject leave requests
- View employee leave history
- Activity tracking
- Search functionality

## Technical Implementation

### Authentication System
The project currently uses browser's sessionStorage for authentication and session management. Here's how it works:

1. **Session Storage**
   - User credentials and role information are stored in the browser's sessionStorage
   - Sessions persist until:
     - User clicks logout
     - Browser tab is closed
     - Browser data is cleared
   - Data stored includes:
     - Employee ID
     - User Name
     - Role (admin/employee)

2. **Security Considerations**
   - sessionStorage is isolated to the browser tab
   - Data is automatically cleared when tab closes
   - Cannot be accessed by other websites or tabs
   - Suitable for development/testing
   - **Note**: For production, server-side session management should be implemented

3. **Role-Based Access**
   - System maintains two user roles:
     - Admin: Full access to admin dashboard
     - Employee: Access to employee dashboard only
   - Automatic redirection based on user role
   - Protected routes prevent unauthorized access

### Default Credentials
```
Admin User:
- Username: admin
- Password: admin123

Employee Users:
- Username: EMP001
- Password: password123
```

## Technology Stack
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome (for icons)

## Project Structure
```
LeaveMS/
├── src/
│   ├── login/           # Login system
│   ├── dashboard/       # Admin and Employee dashboards
│   └── homePage/        # Landing page
```

## Future Improvements
1. Server-side session management
2. Database integration
3. Enhanced security features
4. Real-time notifications
5. Advanced reporting features

## Development
This is a college project focused on front-end implementation. Currently runs client-side only with temporary data storage.
