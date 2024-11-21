// Check if user is logged in
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // If no user is logged in, redirect to login page
    if (!currentUser) {
        window.location.href = '../login/login.html';
        return;
    }

    // Update user name in the dashboard
    const userProfileName = document.querySelector('.user-profile span');
    if (userProfileName) {
        userProfileName.textContent = currentUser.name;
    }

    // Handle logout
    const logoutButton = document.querySelector('a.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = '../login/login.html';
        });
    }
});
