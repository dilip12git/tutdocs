<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Database credentials
$servername = "localhost"; // Replace with your database server name or IP address
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the request body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

// Check if 'token' and 'new_password' exist in the request body
if (isset($data['token'], $data['new_password'])) {
    $resetToken = $data['token'];
    $newPassword = $data['new_password'];

    if (!empty($resetToken) && !empty($newPassword)) {
        // Validate the reset token and get the associated user
        $stmt = $conn->prepare("SELECT * FROM users WHERE reset_token = ? AND token_expiration > NOW()");
        $stmt->bind_param('s', $resetToken);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            // Update user's password and reset the token
            $updateStmt = $conn->prepare("UPDATE users SET password = ?, reset_token = NULL, token_expiration = NULL WHERE id = ?");
            $updateStmt->bind_param('si', $newPassword, $user['id']); // Assuming 'id' is the primary key column of your users table

            if ($updateStmt->execute()) {
                // Password updated successfully
                echo json_encode(["success" => true, "message" => "Password reset successful"]);
            } else {
                // Error in query execution
                echo json_encode(["success" => false, "message" => "Password reset failed: " . $updateStmt->error]);
            }
        } else {
            // Invalid or expired token
            echo json_encode(["success" => false, "message" => "Invalid or expired token. Please try again."]);
        }
    } else {
        // Token or new password not provided
        echo json_encode(["success" => false, "message" => "Token or new password not provided"]);
    }
} else {
    // 'token' and 'new_password' keys not found in the request body
    echo json_encode(["success" => false, "message" => "Token or new password not received"]);
}

exit();
?>
