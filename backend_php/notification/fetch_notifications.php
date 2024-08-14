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
if (isset($postData['userId'])) {
    $userId = $postData['userId'];
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

    // Prepare and execute query to count notifications
    $countStmt = $conn->prepare("SELECT COUNT(*) AS total FROM notification_table WHERE user_id = ?");
    $countStmt->bind_param("s", $userId);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $countRow = $countResult->fetch_assoc();
    $totalCount = $countRow['total'];
    $countStmt->close();

    // Prepare and execute query to fetch notifications
    $stmt = $conn->prepare("SELECT * FROM notification_table WHERE user_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $notifications = [];
        while ($row = $result->fetch_assoc()) {
            $notifications[] = $row;
        }
        $response = [
            "success" => true,
            "totalNotifications" => $totalCount,
            "notifications" => $notifications
        ];
    } else {
        $response = ["error" => "No notifications found"];
    }

    $stmt->close();
    $conn->close();
} else {
    $response = ["error" => "Data not received"];
}

echo json_encode($response);
?>
