<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if loggedInUserId and userIdToUnfollow exist in the received data
if (isset($postData['user_id'], $postData['fileKey'])) {
    $userId = $postData['user_id'];
    $fileKey = $postData['fileKey'];
    
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

    // Prepare and execute SELECT statement to check if the relationship exists
    $checkQuery = "SELECT * FROM bookmarks WHERE user_id = ? AND file_key = ?";
    $stmtCheck = $conn->prepare($checkQuery);
    $stmtCheck->bind_param("ss", $userId, $fileKey);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        // If the relationship exists, prepare and execute DELETE statement
        $deleteQuery = "DELETE FROM bookmarks WHERE user_id = ? AND file_key = ?";
        $stmtDelete = $conn->prepare($deleteQuery);
        $stmtDelete->bind_param("ss", $userId, $fileKey);
        $stmtDelete->execute();

        if ($stmtDelete->affected_rows > 0) {
            // If deletion was successful, return a success message
            echo json_encode(['success' => 'Removed']);
        } else {
            // If deletion failed, return an error message
            echo json_encode(['error' => 'no file added']);
        }
        $stmtDelete->close();
    } else {
        // If the relationship doesn't exist, return a message indicating the user is not followed
        echo json_encode(['error' => 'this file not added']);
    }
    $stmtCheck->close();
    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request']);
}
?>