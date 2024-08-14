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
if (isset($postData['user_id'])) {
    $userId = $postData['user_id'];
    $name = $postData['name'];
    $profile = $postData['profile_picture'];
    $url = $postData['url'];
    $time = $postData['current_time'];
    $file_title=$postData['file_title'];

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
     
     $title='liked';
     $message='Share insightful content regularly to maintain engagement and interest';
     $status='not_viewed';
    // Prepare and bind the INSERT statement
    $stmt = $conn->prepare("INSERT INTO notification_table (user_id, name,title,message,url,file_title, profile_picture, status, time) VALUES (?,?,?,?, ?, ?, ?, ?,?)");
    $stmt->bind_param("sssssssss", $userId, $name,$title,$message,$url,$file_title, $profile,$status, $time);

    // Execute the statement
    if ($stmt->execute()) {
        $response = ["success" => "Data inserted successfully"];
    } else {
        $response = ["error" => "Failed to insert data"];
    }

    $stmt->close();
    $conn->close();
} else {
    $response = ["error" => "Data not received"];
}

echo json_encode($response);
?>
