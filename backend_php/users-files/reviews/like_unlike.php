<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['userId']) && isset($data['fileKey'])) {
    $userId = $data['userId'];
    $fileKey = $data['fileKey'];
    
    // $response=[];

    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $response['error'] = "Connection failed: " . $conn->connect_error;
    }
    // Check if the user has already liked the file
    $checkQuery = "SELECT COUNT(*) as count FROM likes_table WHERE file_key = '$fileKey' AND user_id = '$userId'";
    $result = $conn->query($checkQuery);
    $row = $result->fetch_assoc();
    $likeCount = $row['count'];

    if ($likeCount == 0) {
        // User hasn't liked the file, so add a like
        $insertQuery = "INSERT INTO likes_table (file_key, user_id) VALUES ('$fileKey', '$userId')";
        $conn->query($insertQuery);
        $response['message'] = "Liked";
    } else {
        // User has liked the file, so remove the like (unlike)
        $deleteQuery = "DELETE FROM likes_table WHERE file_key = '$fileKey' AND user_id = '$userId'";
        $conn->query($deleteQuery);
        $response['message'] = "Unliked";
    }

    // Update like_count in files_table
    $updateLikeCountQuery = "UPDATE files_table SET like_count = (SELECT COUNT(*) FROM likes_table WHERE file_key = '$fileKey') WHERE file_key = '$fileKey'";
    $conn->query($updateLikeCountQuery);

    $conn->close();
} else {
    $response['error'] = "Not recieved";
}


echo json_encode($response);


?>
