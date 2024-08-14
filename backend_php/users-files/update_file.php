<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$response = [];

$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['fileKey'],$postData['userId'])) {
    $userId = $postData['userId'];
    $fileKey = $postData['fileKey'];
    $courseCode = $postData['course_code'];
    $courseName = $postData['course_name'];
    $file_type = $postData['file_type'];
    $academicYear = $postData['academic_year'];
    $fileDescription = $postData['file_description'];
    $fileTitle = $postData['file_title'];


  
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $response['error'] = "Connection failed: " . $conn->connect_error;
        echo json_encode($response);
        exit();
    }

    // Update data in the database using prepared statements
    $sql = "UPDATE files_table SET 
            file_title = ?,
            course_code = ?,
            course_name = ?,
            file_type = ?,
            file_description = ?,
            academic_year = ?
            WHERE user_id = ? AND file_key = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssss", $fileTitle, $courseCode, $courseName, $file_type, $fileDescription, $academicYear, $userId, $fileKey);

    if ($stmt->execute()) {
        $response['success'] = "Record updated successfully";
        echo json_encode($response);
        exit();
    } else {
        $response['error'] = "Not updated";
        echo json_encode($response);
        exit();
    }

    // Close the database connection
    $stmt->close();
    $conn->close();
} else {
    $response['error'] = "Data not received";
    echo json_encode($response);
    exit();
}
?>
