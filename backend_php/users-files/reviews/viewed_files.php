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

    // Check if the combination of user_id and file_key already exists in recently_viewed_table
    $stmtCheckExistence = $conn->prepare("SELECT * FROM recently_viewed_table WHERE user_id = ? AND file_key = ?");
    $stmtCheckExistence->bind_param("ss", $userId, $fileKey);
    $stmtCheckExistence->execute();
    $resultExistence = $stmtCheckExistence->get_result();

    if ($resultExistence->num_rows > 0) {
        // The combination already exists, don't insert again
        echo json_encode(array(
            "success" => true,
            "message" => "Viewed file details already exist"
        ));
    } else {
        // Insert the viewed file details into the recently_viewed_table
        $stmtInsertView = $conn->prepare("INSERT INTO recently_viewed_table (user_id, file_key) VALUES (?, ?)");
        $stmtInsertView->bind_param("ss", $userId, $fileKey);

        if ($stmtInsertView->execute()) {
            echo json_encode(array(
                "success" => true,
                "message" => "Viewed file details stored successfully"
            ));
        } else {
            echo json_encode(array(
                "success" => false,
                "error" => "Error storing viewed file details: " . $stmtInsertView->error
            ));
        }

        $stmtInsertView->close();
    }

    $stmtCheckExistence->close();
    $conn->close();
} else {
    echo json_encode(array("error" => "Data not received by the server. Please try again!"));
}
?>
