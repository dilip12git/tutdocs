<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['fileKeys'])) {
    $fileKey = $data['fileKeys'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch file details by fileKey
    $stmt1 = $conn->prepare("SELECT * FROM files_table WHERE file_key = ?");
    $stmt1->bind_param("s", $fileKey);
    $stmt1->execute();
    $result1 = $stmt1->get_result();

    $fileDataUser = array();
    $courseName = null;
    $userId=null;

    if ($result1->num_rows > 0) {
        while ($row = $result1->fetch_assoc()) {
            $fileDataUser[] = $row;
            // Assuming 'course_name' is a field in your database
            $courseName = $row['course_name'];
            $userId = $row['user_id'];
        }
    }

    $stmt1->close();

    // Fetch additional files by course_name
    $fileDataCourse = array();
    if (!is_null($courseName)) {
        $stmt2 = $conn->prepare("SELECT * FROM files_table WHERE course_name = ?");
        $stmt2->bind_param("s", $courseName);
        $stmt2->execute();
        $result2 = $stmt2->get_result();

        if ($result2->num_rows > 0) {
            while ($row = $result2->fetch_assoc()) {
                $fileDataCourse[] = $row;
            }
        }

        $stmt2->close();
    }
    
    if(!is_null($userId)){
          $stmt3 = $conn->prepare("SELECT COUNT(*) as fileCount FROM files_table WHERE user_id = ?");
        $stmt3->bind_param("s", $userId);
        $stmt3->execute();
        $result3 = $stmt3->get_result();

        $fileCount = 0;

        if ($result3->num_rows > 0) {
            $row3 = $result3->fetch_assoc();
            $fileCount = $row3['fileCount'];
        }

        $stmt3->close();
    }
    

    $response = array(
        "success" => true,
        "fileData" => $fileDataUser,
        "relatedFiles" => $fileDataCourse,
        "file_count" =>$fileCount
        
    );

    $conn->close();

    echo json_encode($response);
} else {
    echo json_encode(array("error" => "Incomplete data received."));
}
?>
