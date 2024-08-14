<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['userId'])) {
    $userId = $postData['userId'];
    
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

 
    // Query to fetch follower details
 $followerDetailsQuery = "SELECT u.name, u.user_id, u.profile_picture, u.study_at 
                         FROM users u 
                         INNER JOIN user_relationships r ON u.user_id = r.follow_by 
                         WHERE r.user_id = '$userId'
                         ORDER BY u.id DESC";

    $followerDetailsResult = $conn->query($followerDetailsQuery);
    $followerDetails = ($followerDetailsResult) ? $followerDetailsResult->fetch_all(MYSQLI_ASSOC) : [];

    // Query to fetch following details
    $followingDetailsQuery = "SELECT u.name, u.user_id, u.profile_picture, u.study_at FROM users u INNER JOIN user_relationships r ON u.user_id = r.user_id WHERE r.follow_by = '$userId'";
    $followingDetailsResult = $conn->query($followingDetailsQuery);
    $followingDetails = ($followingDetailsResult) ? $followingDetailsResult->fetch_all(MYSQLI_ASSOC) : [];

    // Query for follower count
    $followerQuery = "SELECT COUNT(*) AS follower_count FROM user_relationships WHERE user_id = '$userId'";
    $followerResult = $conn->query($followerQuery);
    $followerCount = ($followerResult) ? $followerResult->fetch_assoc()['follower_count'] : 0;

    // Query for following count
    $followingQuery = "SELECT COUNT(*) AS following_count FROM user_relationships WHERE follow_by = '$userId'";
    $followingResult = $conn->query($followingQuery);
    $followingCount = ($followingResult) ? $followingResult->fetch_assoc()['following_count'] : 0;

    echo json_encode(array(
        "follower_count" => $followerCount,
        "follower_details" => $followerDetails,
        "following_count" => $followingCount,
        "following_details" => $followingDetails
    ));

    $conn->close();
} else {
    echo json_encode(array("error" => "Invalid request"));
}
?>