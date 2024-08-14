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

// Check if userId and id exist in the received data
if (isset($postData['userId']) && isset($postData['id'])) {
    $userId = $postData['userId'];
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

    // Prepare and execute query to delete notification
    $deleteStmt = $conn->prepare("DELETE FROM notification_table WHERE user_id = ? AND id = ?");
    $deleteStmt->bind_param("ss", $userId, $id);
    $deleteStmt->execute();
    $deleteStmt->close();

    $response = [
        "success" => true
    ];

    $conn->close();
} else {
    $response = ["error" => "Data not received"];
}

echo json_encode($response);
?>
