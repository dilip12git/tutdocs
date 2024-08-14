<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['fileKey'])) {
    // $userId = $data['userId'];
    $fileKey = $data['fileKey'];
    
    $response=[];

    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $response['error'] = "Connection failed: " . $conn->connect_error;
    } else {
        $sql = "UPDATE files_table SET download_count = download_count + 1 WHERE file_key = '$fileKey'";
        $result = $conn->query($sql);

        if ($result === TRUE) {
            $response['success'] = "Download count updated successfully".$fileKey;
        } else {
            $response['error'] = "Error updating view count: " . $conn->error;
            $response['sql'] = $sql; // Include the SQL query in the response
        }
    }

    echo json_encode($response);

} else {
    $response['error'] = "fileKey not received!";
    echo json_encode($response);
    exit();
}
?>
