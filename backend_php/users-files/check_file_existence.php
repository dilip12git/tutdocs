<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if userID and fileKeys exist in the received data
if (isset($postData['userId'], $postData['fileKeys'])) {
    $userId = $postData['userId'];
    $fileKey = $postData['fileKeys'];

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

    // Prepare SQL statement with a prepared statement to prevent SQL injection
    $stmt = $conn->prepare("SELECT * FROM files_table WHERE user_id = ? AND file_key = ?");
    $stmt->bind_param("ss", $userId, $fileKey);
    $stmt->execute();
    $result = $stmt->get_result();

    // Check if the userID exists
    if ($result->num_rows > 0) {
        echo json_encode(array("exists" => true, "message" => "File exist"));
    } else {
        echo json_encode(array("exists" => false, "message" => "File doesn't exist."));
    }

    $stmt->close();
    $conn->close();

} else {
    // Handle the case where userID or fileKey is not provided in the request
    echo json_encode(array("exists" => false, "message" => "Data not recieved to server, Try again !"));
}
?>
