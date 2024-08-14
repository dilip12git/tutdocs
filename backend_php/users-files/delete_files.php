<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$postData = json_decode(file_get_contents("php://input"), true);
if (isset($postData['file_url'], $postData['fileKey'], $postData['fileThumnails_url'], $postData['userId'])) {
    $response = [];
    $fileUrl = $postData['file_url'];
    $fileKey = $postData['fileKey'];
    $fileThumnails_url = $postData['fileThumnails_url'];
    $userId = $postData['userId'];


    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $baseUrl = "http://localhost/tutdocs/users-files/";
    $deleteUrl = str_replace($baseUrl, '', $fileUrl);
    $thumnail_delete_url = str_replace($baseUrl, '', $fileThumnails_url);

    if (file_exists($deleteUrl)) {
        if (unlink($deleteUrl)) {
            if (file_exists($thumnail_delete_url)) {
                unlink($thumnail_delete_url);
            }
            $sql = "DELETE FROM files_table WHERE file_key = '$fileKey' AND user_id = '$userId'";
            if ($conn->query($sql) === TRUE) {

                $response['success'] = "success";
                echo json_encode($response);
                exit();
            } else {
                $response['error'] = "Error deleting file and data";
                echo json_encode($response);
                exit();
            }
        } else {
            // Handle error if deletion fails
            $response['error'] = "File not deleted from sever";
            echo json_encode($response);
            exit();
        }
    } else {
        $response['error'] = "File not found/" . $deleteUrl;
        echo json_encode($response);
        exit();
    }

    $conn->close();
} else {
    $response['error'] = "Data not recieved";
    echo json_encode($response);
    exit();
}
