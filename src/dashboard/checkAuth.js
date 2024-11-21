// Function to check if user is authenticated and has correct role
function checkAuth(requiredRole) {
    if (!isLoggedIn()) {
        window.location.href = '../login/login.html';
        return;
    }

    const userRole = getUserRole();
    if (userRole !== requiredRole) {
        if (userRole === 'admin') {
            window.location.href = './adminDashboard.html';
        } else {
            window.location.href = './employeeDashboard.html';
        }
    }
}

// Function to initialize user info in dashboard
function initializeDashboard() {
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    if (user) {
        // Update user name in header
        const userNameElement = document.querySelector('.admin-profile span, .user-profile span');
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }
    }
}

// Add logout functionality
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logoutUser();
        });
    }

    initializeDashboard();
});
