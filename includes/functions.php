<?php
function validateSession() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    if (!isset($_SESSION['user_id'])) {
        header("Location: " . BASE_URL . "/login.php");
        exit();
    }
}

function isAdmin() {
    return isset($_SESSION['role']) && $_SESSION['role'] === ROLE_ADMIN;
}

function isManager() {
    return isset($_SESSION['role']) && $_SESSION['role'] === ROLE_MANAGER;
}

function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

function calculateLeaveDuration($start_date, $end_date) {
    $start = new DateTime($start_date);
    $end = new DateTime($end_date);
    $interval = $start->diff($end);
    return $interval->days + 1;
}

function formatDate($date) {
    return date('Y-m-d', strtotime($date));
}

function getLeaveStatusClass($status) {
    switch($status) {
        case 'approved':
            return 'text-success';
        case 'rejected':
            return 'text-danger';
        default:
            return 'text-warning';
    }
}
?>
