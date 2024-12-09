<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $conn;
    private $table_name = "user_credentials";

    public $user_id;
    public $employee_id;
    public $username;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function login($username, $password) {
        $query = "SELECT uc.*, ed.name, ed.email, ed.department 
                 FROM " . $this->table_name . " uc
                 JOIN employee_details ed ON uc.employee_id = ed.employee_id
                 WHERE username = :username AND password = :password";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":password", $password);
        $stmt->execute();

        if($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            return $row;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (employee_id, username, password, role)
                VALUES (:employee_id, :username, :password, :role)";

        $stmt = $this->conn->prepare($query);

        // Hash password
        $password_hash = password_hash($this->password, PASSWORD_DEFAULT);

        // Bind values
        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":username", $this->username);
        $stmt->bindParam(":password", $password_hash);
        $stmt->bindParam(":role", $this->role);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
