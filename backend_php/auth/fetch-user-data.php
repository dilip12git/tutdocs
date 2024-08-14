<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if 'username' exists in the POST request body
$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['username'])) {
    $username = $data['username'];

    // Database credentials
    $servername = "localhost"; // Replace with your database server name or IP address
    $db_username = "root"; // Replace with your database username
    $db_password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $stmt = $conn->prepare("SELECT user_id, name, username, profile_picture, study_at, started_on,address,contact_no,branch,studying_year,user_type FROM users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $userData = $result->fetch_assoc();
        $response = array(
            "exists" => true,
            "userData" => $userData
        );
    } else {
        $response = array("exists" => false);
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
} else {
    echo json_encode(array("error" => "No username received."));
}
?>
