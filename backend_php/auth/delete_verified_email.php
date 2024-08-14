<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['username'])) {
    $email = $data['username'];

    require_once 'db_connect.php';

    // Delete data from email_verification table where username matches and verified_status is 'verified'
    $delete_sql = "DELETE FROM email_verification WHERE username = '$email' AND verified_status = 'verified'";
    
    if ($conn->query($delete_sql) === TRUE) {
        if ($conn->affected_rows > 0) {
            echo json_encode(array("message" => "success"));
        } else {
            echo json_encode(array("error" => "No matching records found for deletion"));
        }
    } else {
        echo json_encode(array("error" => "Error deleting data: " . $conn->error));
    }
    
    $conn->close();
} else {
    echo json_encode(array("error" => "Username not provided"));
    exit();
}
?>
