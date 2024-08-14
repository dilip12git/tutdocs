<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('max_execution_time', 300);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if userId exists in the received data
// Check if userId exists in the received data
if (isset($postData['id'])) {
    $id = $postData['id'];
    $response = [];
    
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

    // Prepare and execute select query to check if notification with the given ID exists
    $stmt = $conn->prepare("SELECT * FROM notification_table WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if any rows were returned
    if ($result->num_rows > 0) {
        // If notification exists, update its status
        $updateStmt = $conn->prepare("UPDATE notification_table SET status='viewed' WHERE id = ?");
        $updateStmt->bind_param("i", $id);
        $updateStmt->execute();

        // Check if the update was successful
        if ($conn->affected_rows > 0) {
            $response = [
                "success" => true,
                "message" => "Notification status updated successfully"
            ];
        } else {
            $response = ["error" => "Failed to update notification status"];
        }
        $updateStmt->close();
    } else {
        $response = ["error" => "No notification found with the provided ID"];
    }

    $stmt->close();
    $conn->close();
} else {
    $response = ["error" => "Data not received"];
}

echo json_encode($response);

?>
