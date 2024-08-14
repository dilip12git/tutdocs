<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('max_execution_time', 300);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

if (isset($_POST['userId']) && isset($_POST['fileKey'])) {
    $userId = $_POST['userId'];
    $fileKey = $_POST['fileKey'];
    $fileExtension = $_POST['file_extension'];
    $fileName = $_POST['file_name'];

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
$targetFile = $targetDir . basename($fileName);
    $convertedDir = $targetDir . 'files_thumbnails/';
    if (!file_exists($convertedDir) && !is_dir($convertedDir)) {
        mkdir($convertedDir, 0755, true);
    }

    if ($fileExtension == "pdf") {
        $convertedFileUrl = 'http://localhost/tutdocs/assets/icon/pdf_img.png';
                    // $outputImageFile = $convertedDir . pathinfo($fileName, PATHINFO_FILENAME) . '.png';

                    // $imagick = new Imagick();

                    // try {
                    //     $imagick->setResolution(300, 300);
                    //     $imagick->readImage($targetFile . '[0]'); // Read only the first page of the PDF

                    //     // Adjust the settings to improve image rendering
                    //     $imagick->setImageBackgroundColor('white'); // Set background color
                    //     $imagick->setImageAlphaChannel(Imagick::ALPHACHANNEL_REMOVE); // Remove alpha channel

                    //     $imagick->setImageFormat('png');
                    //     $imagick->writeImage($outputImageFile);
                    //     $imagick->clear();
                    //     $imagick->destroy();
                    // } catch (ImagickException $e) {
                    //     $response['error'] = "Error processing PDF: " . $e->getMessage();
                    //     echo json_encode($response);
                    //     exit();
                    // }

                    // if (file_exists($outputImageFile) && filesize($outputImageFile) > 0) {
                    //     $convertedFileUrl = 'http://localhost/tutdocs/users-files/' . $convertedDir . basename($outputImageFile);

                    //     // Move the converted image file to a different location or folder
                    //     $movedConvertedFile = rename($outputImageFile, $convertedDir . basename($outputImageFile));
                    //     if (!$movedConvertedFile) {
                    //         $response['error'] = "Error moving the converted image file.";
                    //         echo json_encode($response);
                    //         exit();
                    //     }
                        
                        
                        
                    //       } else {

                    //     $response['error'] = "Error converting PDF to image or Converted image file not found.";
                    //     echo json_encode($response);
                    // }
                    
                 } else if ($fileExtension == "docx") {
        $convertedFileUrl = 'http://localhost/tutdocs/assets/icon/doc_img.png';
    }

    $thumbnailUrl = $convertedFileUrl;

    $stmt = $conn->prepare("UPDATE files_table SET thumnail_url = ? WHERE user_id = ? AND file_key = ?");
    $stmt->bind_param("sss", $thumbnailUrl, $userId, $fileKey);

    if ($stmt->execute()) {
        $response['success'] = "Thumbnail Generated.";
        echo json_encode($response);
    } else {
        $response['error'] = "Error Thumbnail Generate " . $stmt->error;
        echo json_encode($response);
    }

    // Close the database connection after processing all files
    $conn->close();
} else {
    $response['error'] = "File not received";
    echo json_encode($response);
    exit();
}
?>