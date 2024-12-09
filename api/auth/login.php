<?php
require_once '../../config/config.php';
require_once '../../config/database.php';
require_once '../../models/User.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

$database = new Database();
$db = $database->getConnection();
$user = new User($db);

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

$result = $user->login($data->username, $data->password);

if ($result) {
    // Check if session is not already started
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_id'] = $result['user_id'];
    $_SESSION['employee_id'] = $result['employee_id'];
    $_SESSION['username'] = $result['username'];
    $_SESSION['role'] = $result['role'];
    $_SESSION['name'] = $result['name'];
    $_SESSION['email'] = $result['email'];
    
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'name' => $result['name'],
            'role' => $result['role'],
            'email' => $result['email']
        ]
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>
