// Temporary credentials store
const validCredentials = [
    {
        employeeId: "EMP001",
        password: "password123",
        name: "John Doe",
        role: "employee"
    },
    {
        employeeId: "EMP002",
        password: "password456",
        name: "Jane Smith",
        role: "employee"
    },
    {
        employeeId: "admin",
        password: "admin123",
        name: "Admin User",
        role: "admin"
    }
];

// Function to validate credentials
function validateCredentials(username, password) {
    const user = validCredentials.find(cred => 
        cred.employeeId === username && cred.password === password
    );
    return user || null;
}

// Function to store user session
function storeUserSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify({
        employeeId: user.employeeId,
        name: user.name,
        role: user.role
    }));
}

// Function to check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Function to get user role
function getUserRole() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    return user ? user.role : null;
}

// Function to logout user
function logoutUser() {
    sessionStorage.removeItem('currentUser');
    window.location.href = '../login/login.html';
}

// Function to redirect based on role
function redirectBasedOnRole() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
        if (user.role === 'admin') {
            window.location.href = '../dashboard/adminDashboard.html';
        } else {
            window.location.href = '../dashboard/employeeDashboard.html';
        }
    }
}
