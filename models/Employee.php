<?php
require_once __DIR__ . '/../config/database.php';

class Employee {
    private $conn;
    private $table_name = "employee_details";

    public $employee_id;
    public $name;
    public $email;
    public $department;
    public $date_joined;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                (name, email, department, date_joined, status)
                VALUES (:name, :email, :department, :date_joined, :status)";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->department = htmlspecialchars(strip_tags($this->department));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":department", $this->department);
        $stmt->bindParam(":date_joined", $this->date_joined);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function read($id = null) {
        $query = "SELECT * FROM " . $this->table_name;
        if($id) {
            $query .= " WHERE employee_id = :id";
        }

        $stmt = $this->conn->prepare($query);
        
        if($id) {
            $stmt->bindParam(":id", $id);
        }

        $stmt->execute();
        return $stmt;
    }
}
?>
