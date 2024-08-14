<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db_connect.php';

// Define the current date and time
$current_date = date('Y-m-d H:i:s');

// Delete expired records from the email_verification table
$delete_query = "DELETE FROM email_verification WHERE token_expiration < '$current_date'";
if ($conn->query($delete_query) === TRUE) {
    echo json_encode(array("message" => "Expired records deleted successfully."));
} else {
    echo json_encode(array("error" => "Error deleting expired records: " . $conn->error));
}

// Close the database connection
$conn->close();
?>
