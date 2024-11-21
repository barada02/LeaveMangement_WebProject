// Temporary credentials store
const validCredentials = [
    {
        employeeId: "EMP001",
        password: "password123",
        name: "John Doe"
    },
    {
        employeeId: "EMP002",
        password: "password456",
        name: "Jane Smith"
    },
    {
        employeeId: "admin",
        password: "admin123",
        name: "Admin User"
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
        name: user.name
    }));
}

// Function to check if user is logged in
function isLoggedIn() {
    return sessionStorage.getItem('currentUser') !== null;
}

// Function to logout user
function logoutUser() {
    sessionStorage.removeItem('currentUser');
}
