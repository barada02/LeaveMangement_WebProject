<?php
require_once __DIR__ . '/../config/database.php';

class LeaveBalance {
    private $conn;
    private $table_name = "leave_balance";

    public $balance_id;
    public $employee_id;
    public $sick_leave;
    public $casual_leave;
    public $earned_leave;
    public $festival_leave;
    public $total_leave;
    public $total_leave_left;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getBalance($employee_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                 WHERE employee_id = :employee_id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":employee_id", $employee_id);
        $stmt->execute();

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateBalance() {
        $query = "UPDATE " . $this->table_name . "
                SET sick_leave = :sick_leave,
                    casual_leave = :casual_leave,
                    earned_leave = :earned_leave,
                    festival_leave = :festival_leave,
                    total_leave = :total_leave,
                    total_leave_left = :total_leave_left
                WHERE employee_id = :employee_id";

        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":sick_leave", $this->sick_leave);
        $stmt->bindParam(":casual_leave", $this->casual_leave);
        $stmt->bindParam(":earned_leave", $this->earned_leave);
        $stmt->bindParam(":festival_leave", $this->festival_leave);
        $stmt->bindParam(":total_leave", $this->total_leave);
        $stmt->bindParam(":total_leave_left", $this->total_leave_left);
        $stmt->bindParam(":employee_id", $this->employee_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
