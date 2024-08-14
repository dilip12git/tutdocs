<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['institute_name'])) {
    $dsn = "mysql:host=localhost;dbname=u586818238_tutdocs_data";
    $username = "root";
    $password = "";

    try {
        $db = new PDO($dsn, $username, $password);
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }

    // Get the institute_name from the incoming POST data
    $instituteName = $postData['institute_name'];

    // Fetch data from the database
    $query = "SELECT
                COUNT(files_table.file_key) AS total_files,
                SUM(files_table.view_count) AS total_view_count,
                SUM(files_table.download_count) AS total_download_count,
                SUM(files_table.like_count) AS total_like_count
              FROM files_table
              WHERE files_table.institute_name = :instituteName";

    $statement = $db->prepare($query);
    $statement->bindParam(':instituteName', $instituteName, PDO::PARAM_STR);
    $statement->execute();

    // Return the results as JSON
    $result = $statement->fetch(PDO::FETCH_ASSOC);
    echo json_encode($result);
} else {
    $response['error'] = "Data not received";
    echo json_encode($response);
    exit();
}
?>
