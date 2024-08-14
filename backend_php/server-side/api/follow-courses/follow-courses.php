<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if loggedInUserId and userIdToFollow exist in the received data
if (isset($postData['user_id'], $postData['course_name'],$postData['course_name'])) {
    $userId = $postData['user_id'];
    $courseName = $postData['course_name'];
    $courseCode=$postData['course_code'];
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

            // Insert into user_relationships table
            $stmt = $conn->prepare("INSERT INTO follow_courses (user_id, course_name,course_code) VALUES (?, ?,?)");
            $stmt->bind_param("sss", $userId, $courseName,$courseCode);

          if ($stmt->execute()) {
    $response['success'] = "success";
    echo json_encode($response);
} else {
    $response['error'] = "Error: " . $conn->error; // Include the MySQL error message
    echo json_encode($response);
}


    $conn->close();
} else {
    echo json_encode(['error' => 'Data not recieved']);
}
?>