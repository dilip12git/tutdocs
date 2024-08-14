<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('max_execution_time', 300);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if (isset($_FILES['files']) && isset($_POST['userId']) && isset($_POST['fileKey'])) {
    $userId = $_POST['userId'];
    $fileKey = $_POST['fileKey'];
    $uploadBy = $_POST['upload_by'];
    $courseCode = $_POST['courseCode'];
    $courseName = $_POST['courseName'];
    $file_type = $_POST['fileType'];
    $academicYear = $_POST['academic_year'];
    $fileDescription = $_POST['fileDescription'];
    $instituteName = $_POST['institute_name'];
    $fileSize = $_POST['file_size'];
    $fileTitle = $_POST['file_title'];

    $targetDir = "uploads/{$userId}-upload-documents/";
    $extension='';
    if (!file_exists($targetDir) && !is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $response = [];
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

    foreach ($_FILES['files']['tmp_name'] as $key => $tmp_name) {
        if ($_FILES['files']['error'][$key] !== UPLOAD_ERR_OK) {
            $response['error'] = "File upload error: " . $_FILES['files']['error'][$key];
            echo json_encode($response);
            exit();
        }

        $fileName = $_FILES['files']['name'][$key];
        $fileName = str_replace(' ', '_', $fileName);
        $fileTmp = $_FILES['files']['tmp_name'][$key];
        $fileType = $_FILES['files']['type'][$key];

        $checkQuery = "SELECT * FROM files_table WHERE user_id = ? AND file_key = ?";
        $stmtCheck = $conn->prepare($checkQuery);
        $stmtCheck->bind_param("ss", $userId, $fileKey);
        $stmtCheck->execute();
        $resultCheck = $stmtCheck->get_result();

        if ($resultCheck->num_rows > 0) {
            $response['error'] = "You have already uploaded this file. Please try again or rename the file";
            echo json_encode($response);
            exit();
        } else {
            $targetFile = $targetDir . basename($fileName);
            if (move_uploaded_file($fileTmp, $targetFile)) {
                $fileUrl = 'http://localhost/tutdocs/users-files/' . $targetFile;
                chmod($targetFile, 0644);

                $currentDate = date("d M Y");
                if ($fileType == "application/pdf") {
                    $extension="pdf";
                    $thumnailUrl='http://localhost/tutdocs/assets/icon/pdf.png';
                } else if ($fileType == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                    $extension="docx";
                    $thumnailUrl='http://localhost/tutdocs/assets/icon/doc_img.png';
                }

                $fileExtension=$extension;
                $thumnail=$thumnailUrl;
                $stmt = $conn->prepare("INSERT INTO files_table (user_id, upload_by, file_key, file_name, file_title, file_type, file_size, file_url, extension,thumnail_url, course_name, course_code, file_description, academic_year, institute_name, upload_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)");
                $stmt->bind_param("ssssssssssssssss", $userId, $uploadBy, $fileKey, $fileName, $fileTitle, $file_type, $fileSize, $fileUrl, $fileExtension ,$thumnail, $courseName, $courseCode, $fileDescription, $academicYear, $instituteName, $currentDate);

                if ($stmt->execute()) {
                    // Fetch the details of the uploaded file
                    $uploadedFileDetails = [
                        'userId' => $userId,
                        'uploadBy' => $uploadBy,
                        'fileKey' => $fileKey,
                        'fileName' => $fileName,
                        'fileTitle' => $fileTitle,
                        'fileType' => $file_type,
                        'fileSize' => $fileSize,
                        'fileUrl' => $fileUrl,
                        'extension' => $fileExtension,
                        'courseName' => $courseName,
                        'courseCode' => $courseCode,
                        'fileDescription' => $fileDescription,
                        'academicYear' => $academicYear,
                        'instituteName' => $instituteName,
                        'uploadDate' => $currentDate
                    ];
                    $response['success'] = "File uploaded successfully.";
                    $response['data'] = $uploadedFileDetails;

                    echo json_encode($response);
                } else {
                    $response['error'] = "Error inserting file details: " . $stmt->error;
                    echo json_encode($response);
                }
                $stmt->close(); // Close the prepared statement after execution
            } else {
                $response['error'] = "Error uploading $fileName. Please try again.";
                echo json_encode($response);
                exit();
            }
        }
    }

    $conn->close();
} else {
    $response['error'] = "File not received";
    echo json_encode($response);
    exit();
}
?>
