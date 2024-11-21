document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const rememberMe = document.getElementById('remember');
    
    // Password visibility toggle
    function togglePasswordVisibility() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            togglePassword.classList.remove('fa-eye-slash');
            togglePassword.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            togglePassword.classList.remove('fa-eye');
            togglePassword.classList.add('fa-eye-slash');
        }
    }

    // Add click event for password toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', togglePasswordVisibility);
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Use auth.js to validate credentials
            const user = validateCredentials(username, password);
            
            if (user) {
                // Store user session using auth.js
                storeUserSession(user);
                
                // Save remember me preference if checked
                if (rememberMe && rememberMe.checked) {
                    localStorage.setItem('rememberedUser', username);
                } else {
                    localStorage.removeItem('rememberedUser');
                }
                
                // Redirect based on role
                redirectBasedOnRole();
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }

    // Check for remembered user
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        const usernameInput = document.getElementById('username');
        if (usernameInput) {
            usernameInput.value = rememberedUser;
            if (rememberMe) {
                rememberMe.checked = true;
            }
        }
    }
});

// Form validation
function validateForm(username, password) {
    let isValid = true;
    const errorMessages = [];

    // Employee ID validation
    if (!validateEmployeeId(username)) {
        errorMessages.push('Please enter a valid Employee ID');
        isValid = false;
    }

    // Password validation
    if (password.length < 8) {
        errorMessages.push('Password must be at least 8 characters long');
        isValid = false;
    }

    // Display error messages if any
    if (!isValid) {
        showError(errorMessages.join('\n'));
    }

    return isValid;
}

// Employee ID validation
function validateEmployeeId(employeeId) {
    // Modify this regex pattern according to your company's employee ID format
    const employeeIdPattern = /^[A-Z0-9]{6,}$/i;
    return employeeIdPattern.test(employeeId);
}

// Show error message
function showError(message) {
    // Remove existing error messages
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and show new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(errorDiv, form.firstChild);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Simulate login process
function simulateLogin(username, password) {
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.textContent;
    
    // Show loading state
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';

    // Simulate API call
    setTimeout(() => {
        // Reset button state
        loginBtn.disabled = false;
        loginBtn.textContent = originalText;

        // Show success message
        showSuccess('Login successful! Redirecting to dashboard...');
        
        // Redirect after success (replace with actual redirect)
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);
    }, 2000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('loginForm');
    form.insertBefore(successDiv, form.firstChild);
}

// Add input validation on blur
document.getElementById('username').addEventListener('blur', function() {
    validateEmployeeId(this.value);
});

// Redirect based on role
function redirectBasedOnRole() {
    // TO DO: implement role-based redirection logic here
    // For now, just redirect to a default dashboard
    window.location.href = '../dashboard/employeeDashboard.html';
}
