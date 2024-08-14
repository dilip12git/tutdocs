<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['institute_name'])) {
    $institution = $data['institute_name'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Validate and sanitize input
    $institution = $conn->real_escape_string($institution);

    $stmt = $conn->prepare("SELECT * FROM files_table WHERE institute_name = ? ORDER BY upload_time DESC");
    $stmt->bind_param("s", $institution);
    
    if ($stmt->execute()) {
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $fileDetails = array();
            while ($row = $result->fetch_assoc()) {
                $fileDetails[] = $row;
            }
            $response = array(
                "success" => true,
                "recentFileDetails" => $fileDetails
            );
        } else {
            $response = array("error" => "No file details found for the given institution name.");
        }
    } else {
        $response = array("error" => "Error executing the database query.");
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
} else {
    echo json_encode(array("error" => "No institute name received."));
}
?>
