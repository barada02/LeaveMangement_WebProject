<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Base URL configuration
define('BASE_URL', '/LeaveMS/LeaveMangement_WebProject');

// Error reporting during development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Time zone setting
date_default_timezone_set('Asia/Kolkata');

// Session timeout in seconds (30 minutes)
define('SESSION_TIMEOUT', 1800);

// Define user roles
define('ROLE_ADMIN', 'admin');
define('ROLE_MANAGER', 'manager');
define('ROLE_EMPLOYEE', 'employee');

// Define leave types
define('LEAVE_TYPES', [
    'sick' => 'Sick Leave',
    'casual' => 'Casual Leave',
    'earned' => 'Earned Leave',
    'festival' => 'Festival Leave'
]);
?>
