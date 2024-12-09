<?php
require_once __DIR__ . '/../config/database.php';

class Leave {
    private $conn;
    private $table_name = "leave_log";

    public $leave_log_id;
    public $employee_id;
    public $leave_type;
    public $start_date;
    public $end_date;
    public $reason;
    public $status;
    public $manager_id;
    public $note;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function applyLeave() {
        $query = "INSERT INTO " . $this->table_name . "
                (employee_id, leave_type, start_date, end_date, reason, status)
                VALUES (:employee_id, :leave_type, :start_date, :end_date, :reason, 'pending')";

        $stmt = $this->conn->prepare($query);

        // Sanitize inputs
        $this->reason = htmlspecialchars(strip_tags($this->reason));

        // Bind values
        $stmt->bindParam(":employee_id", $this->employee_id);
        $stmt->bindParam(":leave_type", $this->leave_type);
        $stmt->bindParam(":start_date", $this->start_date);
        $stmt->bindParam(":end_date", $this->end_date);
        $stmt->bindParam(":reason", $this->reason);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function getLeaveHistory($employee_id) {
        $query = "SELECT * FROM " . $this->table_name . "
                 WHERE employee_id = :employee_id
                 ORDER BY date_applied DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":employee_id", $employee_id);
        $stmt->execute();

        return $stmt;
    }

    public function updateLeaveStatus() {
        $query = "UPDATE " . $this->table_name . "
                SET status = :status,
                    manager_id = :manager_id,
                    note = :note
                WHERE leave_log_id = :leave_log_id";

        $stmt = $this->conn->prepare($query);

        // Bind values
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":manager_id", $this->manager_id);
        $stmt->bindParam(":note", $this->note);
        $stmt->bindParam(":leave_log_id", $this->leave_log_id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>
