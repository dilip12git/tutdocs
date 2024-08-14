<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost"; // Replace with your database server name or IP address
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$stmt = $conn->prepare("SELECT * FROM files_table ORDER BY upload_time DESC LIMIT 10");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Fetch all details of files
    $fileDetails = array();
    while ($row = $result->fetch_assoc()) {
        $fileDetails[] = $row;
    }

    // Construct response including file details
    $response = array(
        "success" => true,
        "fileDetails" => $fileDetails
    );
} else {
    $response = array("error" => "No files found in the database.");
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
