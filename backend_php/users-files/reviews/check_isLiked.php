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
    
    // Database credentials
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if the user has liked the file
    $stmtLiked = $conn->prepare("SELECT * FROM likes_table WHERE file_key = ? AND user_id = ?");
    $stmtLiked->bind_param("ss", $fileKey, $userId); // Corrected parameter order
    $stmtLiked->execute();
    $resultLikes = $stmtLiked->get_result();

    // Check if the relationship exists
    $isLiked = $resultLikes->num_rows > 0;

    echo json_encode(array(
        "isLiked" => $isLiked,
        "message" => "Likes status checked"
    ));

    $stmtLiked->close();
    $conn->close();
} else {
    // Handle the case where userId or fileKey is not provided in the request
    echo json_encode(array("error" => "Data not received by the server. Please try again!"));
}
?>
