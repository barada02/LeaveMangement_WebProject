// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    const leaveForm = document.querySelector('.leave-form');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const notificationBell = document.querySelector('.notifications');

    // Initialize Dashboard
    initializeDashboard();

    // Dashboard Initialization
    function initializeDashboard() {
        setupSidebarNavigation();
        setupLeaveForm();
        setupNotifications();
        setupDateValidation();
    }

    // Sidebar Navigation
    function setupSidebarNavigation() {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.classList.contains('logout')) {
                    e.preventDefault();
                    // Remove active class from all links
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    // Add active class to clicked link
                    link.classList.add('active');
                }
            });
        });
    }

    // Leave Form Handling
    function setupLeaveForm() {
        if (leaveForm) {
            leaveForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(leaveForm);
                const leaveData = {
                    type: formData.get('leave-type'),
                    startDate: formData.get('start-date'),
                    endDate: formData.get('end-date'),
                    reason: formData.get('reason')
                };

                // Validate dates
                if (!validateDates(leaveData.startDate, leaveData.endDate)) {
                    showNotification('End date must be after start date', 'error');
                    return;
                }

                // Calculate duration
                const duration = calculateLeaveDuration(leaveData.startDate, leaveData.endDate);

                // TODO: Send data to backend
                console.log('Leave request submitted:', { ...leaveData, duration });

                // Show success message
                showNotification('Leave request submitted successfully!', 'success');

                // Update leave balance (mock)
                updateLeaveBalance(leaveData.type, duration);

                // Reset form
                leaveForm.reset();
            });
        }
    }

    // Date Validation
    function setupDateValidation() {
        const startDate = document.querySelector('input[name="start-date"]');
        const endDate = document.querySelector('input[name="end-date"]');

        if (startDate && endDate) {
            // Set minimum date as today
            const today = new Date().toISOString().split('T')[0];
            startDate.min = today;
            endDate.min = today;

            // Update end date minimum when start date changes
            startDate.addEventListener('change', () => {
                endDate.min = startDate.value;
                if (endDate.value && endDate.value < startDate.value) {
                    endDate.value = startDate.value;
                }
            });
        }
    }

    // Notifications
    function setupNotifications() {
        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                // Mock notifications
                const notifications = [
                    { message: 'Your leave request was approved', type: 'success' },
                    { message: 'New company policy update', type: 'info' },
                    { message: 'Reminder: Team meeting tomorrow', type: 'info' }
                ];

                // Show first notification
                if (notifications.length > 0) {
                    showNotification(notifications[0].message, notifications[0].type);
                }
            });
        }
    }

    // Utility Functions
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Date Validation
    function validateDates(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return start <= end;
    }

    // Calculate Leave Duration
    function calculateLeaveDuration(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1; // Including both start and end dates
    }

    // Update Leave Balance
    function updateLeaveBalance(type, duration) {
        // Mock function to update leave balance
        const balanceElement = document.querySelector('.card:first-child .card-info h3');
        if (balanceElement) {
            const currentBalance = parseInt(balanceElement.textContent);
            const newBalance = currentBalance - duration;
            balanceElement.textContent = newBalance;
        }
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }

        .notification.success {
            background-color: #00b894;
        }

        .notification.error {
            background-color: #e74c3c;
        }

        .notification.info {
            background-color: #1976d2;
        }

        .notification.fade-out {
            animation: slideOut 0.3s ease-out forwards;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
