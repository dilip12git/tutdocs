<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if loggedInUserId and userIdToCheck exist in the received data
if (isset($postData['user_id'], $postData['course_name'])) {
    $userId = $postData['user_id'];
    $courseName = $postData['course_name'];

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

    // Check if the loggedInUserId is following the userIdToCheck
    $stmtCheck = $conn->prepare("SELECT * FROM follow_courses WHERE user_id = ? AND course_name = ?");
    $stmtCheck->bind_param("ss", $userId, $courseName);
    $stmtCheck->execute();
    $result = $stmtCheck->get_result();

  
        if ($result->num_rows > 0) {
        // Bookmark exists for the user and file
        echo json_encode(array('isFollowed' => true));
    } else {
        // Bookmark doesn't exist for the user and file
        echo json_encode(array('isFollowed' => false));
    } 
    

    $stmtCheck->close();
    $conn->close();
} else {
    // Handle the case where loggedInUserId or userIdToCheck is not provided in the request
    echo json_encode(array("error" => "Data not received by the server. Please try again!"));
}
?>
