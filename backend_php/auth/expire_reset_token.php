<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db_connect.php';

// Define the current date and time
$current_date = date('Y-m-d H:i:s');

// Update the reset_token and token_expiration columns for expired records
$update_query = "UPDATE users SET reset_token = NULL, token_expiration = NULL WHERE token_expiration < '$current_date'";
if ($conn->query($update_query) === TRUE) {
    echo json_encode(array("message" => "Reset token and expiration data updated successfully."));
} else {
    echo json_encode(array("error" => "Error updating reset token and expiration data: " . $conn->error));
}

// Close the database connection
$conn->close();
?>
