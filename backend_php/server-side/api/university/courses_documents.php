<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['course_name'])) {
    $courseName = $data['course_name'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Validate and sanitize input
    $courseName = $conn->real_escape_string($courseName);

    // Get file count
    $stmtCount = $conn->prepare("SELECT COUNT(*) as file_count FROM files_table WHERE course_name = ?");
    $stmtCount->bind_param("s", $courseName);

    if ($stmtCount->execute()) {
        $resultCount = $stmtCount->get_result();
        $rowCount = $resultCount->fetch_assoc();
        $fileCount = $rowCount['file_count'];
    } else {
        $fileCount = 0;
    }

    $stmtCount->close();

    // Get file details
    $stmtDetails = $conn->prepare("SELECT * FROM files_table WHERE course_name = ? ORDER BY upload_time DESC");
    $stmtDetails->bind_param("s", $courseName);

    if ($stmtDetails->execute()) {
        $resultDetails = $stmtDetails->get_result();
        $fileDetails = array();

        while ($rowDetails = $resultDetails->fetch_assoc()) {
            $fileDetails[] = $rowDetails;
        }
    } else {
        $fileDetails = array();
    }

    $stmtDetails->close();
    $conn->close();

    // Prepare response
    $response = array(
        "success" => true,
        "fileCount" => $fileCount,
        "fileDetails" => $fileDetails
    );

    echo json_encode($response);
} else {
    echo json_encode(array("error" => "No institute name received."));
}
?>
