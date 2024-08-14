<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if loggedInUserId and userIdToCheck exist in the received data
if (isset($postData['loggedInUserId'], $postData['userIdToCheck'])) {
    $loggedInUserId = $postData['loggedInUserId'];
    $userIdToCheck = $postData['userIdToCheck'];

    // Database credentials
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Check if the loggedInUserId is following the userIdToCheck
    $stmtFollows = $conn->prepare("SELECT * FROM user_relationships WHERE follow_by = ? AND user_id = ?");
    $stmtFollows->bind_param("ss", $loggedInUserId, $userIdToCheck);
    $stmtFollows->execute();
    $resultFollows = $stmtFollows->get_result();

    // Check if the loggedInUserId is followed by the userIdToCheck
    $stmtFollowedBy = $conn->prepare("SELECT * FROM user_relationships WHERE follow_by = ? AND user_id = ?");
    $stmtFollowedBy->bind_param("ss", $userIdToCheck, $loggedInUserId);
    $stmtFollowedBy->execute();
    $resultFollowedBy = $stmtFollowedBy->get_result();

    // Check if the relationship exists in both directions
    $isFollowing = $resultFollows->num_rows > 0;
    $isFollowedBy = $resultFollowedBy->num_rows > 0;

    echo json_encode(array(
        "isFollowing" => $isFollowing,
        "isFollowedBy" => $isFollowedBy,
        "message" => "Relationship status checked"
    ));

    $stmtFollows->close();
    $stmtFollowedBy->close();
    $conn->close();
} else {
    // Handle the case where loggedInUserId or userIdToCheck is not provided in the request
    echo json_encode(array("error" => "Data not received by the server. Please try again!"));
}
?>
