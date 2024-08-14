<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['user_id'])) {
    $userId = $data['user_id'];

    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Default sorting column and order
    $sortBy = isset($data['sortBy']) ? $data['sortBy'] : 'upload_time';
    $order = isset($data['order']) && strtoupper($data['order']) === 'DESC' ? 'DESC' : 'ASC';

    // Validate sorting column to prevent SQL injection
    $allowedSortColumns = ['upload_time', 'download_count', 'view_count'];
    $sortBy = in_array($sortBy, $allowedSortColumns) ? $sortBy : 'upload_time';

    $stmt = $conn->prepare("SELECT * FROM files_table WHERE user_id = ? ORDER BY $sortBy $order");
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $fileDetails = array();
        while ($row = $result->fetch_assoc()) {
            $fileDetails[] = $row;
        }
        $response = array(
            "success" => true,
            "fileDetails" => $fileDetails
        );
    } else {
        $response = array("error" => "No files Uploaded by the specified user.");
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
} else {
    echo json_encode(array("error" => "No userId received."));
}
?>
