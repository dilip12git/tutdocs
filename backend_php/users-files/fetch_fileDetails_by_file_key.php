<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$postData = json_decode(file_get_contents("php://input"), true);
if (isset($postData['fileKey'], $postData['userId'])) {
    $response = [];
    $fileKey = $postData['fileKey'];
    $userId = $postData['userId'];

    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM files_table WHERE file_key = '$fileKey' AND user_id = '$userId'";
    $result = $conn->query($sql);

    if ($result !== false && $result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $response['success'] = "success";
        $response['data'] = $row; // Add the fetched data to the response
        echo json_encode($response);
    } else {
        $response['error'] = "No matching records";
        echo json_encode($response);
    }

    $conn->close();
} else {
    $response['error'] = "Data not received";
    echo json_encode($response);
}
?>
