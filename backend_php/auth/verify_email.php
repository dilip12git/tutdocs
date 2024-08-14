<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if 'token' exists in the POST request body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['token'])) {
    $verification_token = $data['token'];

    require_once 'db_connect.php';

    // Find the token in the database
    $sql = "SELECT * FROM email_verification WHERE verification_token = '$verification_token'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // Token found: Email verified
        $row = $result->fetch_assoc();
        $verified_email = $row['username'];

        // Update the user's status to indicate the email has been verified
        $update_sql = "UPDATE email_verification SET verified_status = 'verified' WHERE username = '$verified_email'";
        if ($conn->query($update_sql) === TRUE) {
            // Fetch all data related to the verified user
            $user_data_sql = "SELECT * FROM email_verification WHERE username = '$verified_email'";
            $user_result = $conn->query($user_data_sql);
            $user_data = $user_result->fetch_assoc();

            echo json_encode(array("message" => "success", "user_data" => $user_data));
        } else {
            echo json_encode(array("error" => "Error updating user status"));
        }
    } else {
        // Token not found or expired
        echo json_encode(array("error" => "Invalid token"));
    }
    $conn->close();
} else {
    // Handle error: Token not provided
    echo json_encode(array("error" => "Token not provided"));
    exit();
}
?>
