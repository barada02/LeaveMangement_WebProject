<?php
require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../models/Leave.php';
require_once '../../models/LeaveBalance.php';
require_once '../../includes/functions.php';

header('Content-Type: application/json');
validateSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$leave = new Leave($db);
$leaveBalance = new LeaveBalance($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->leave_type) || !isset($data->start_date) || !isset($data->end_date)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Set leave properties
$leave->employee_id = $_SESSION['employee_id'];
$leave->leave_type = $data->leave_type;
$leave->start_date = formatDate($data->start_date);
$leave->end_date = formatDate($data->end_date);
$leave->reason = isset($data->reason) ? $data->reason : '';

// Check leave balance
$balance = $leaveBalance->getBalance($_SESSION['employee_id']);
$duration = calculateLeaveDuration($data->start_date, $data->end_date);

if ($balance[$data->leave_type . '_leave'] < $duration) {
    http_response_code(400);
    echo json_encode(['error' => 'Insufficient leave balance']);
    exit();
}

if ($leave->applyLeave()) {
    echo json_encode([
        'success' => true,
        'message' => 'Leave application submitted successfully'
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit leave application']);
}
?>
