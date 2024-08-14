<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$request_body = file_get_contents('php://input');
$data = json_decode($request_body, true);

if (isset($data['userid'])) {
    $userId = $data['userid'];

    // Connect to your database
    $host = 'localhost';
    $username = 'root';
    $password = '';
    $dbname = 'u586818238_tutdocs_data';

    $conn = new mysqli($host, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch data from the files_table for the specified user_id
    $query = "SELECT course_code, course_name, COUNT(*) AS no_of_files
              FROM files_table
              WHERE user_id = ?
              GROUP BY course_code, course_name
              ORDER BY no_of_files DESC";

    $statement = $conn->prepare($query);
    $statement->bind_param('s', $userId);
    $statement->execute();
    $result = $statement->get_result();

    // Fetch data as an associative array
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }

    // Return the results as JSON
    echo json_encode($data);

    // Close connection
    $conn->close();
} else {
    echo json_encode(array("error" => "No userId received."));
}
?>
