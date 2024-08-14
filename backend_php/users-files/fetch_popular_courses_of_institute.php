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
    $query = "SELECT courses.course_code, courses.course_name, COUNT(files_table.course_name) AS no_of_files
              FROM courses
              LEFT JOIN files_table ON courses.course_name = files_table.course_name
              WHERE files_table.institute_name = :instituteName
              GROUP BY courses.course_code, courses.course_name
              ORDER BY no_of_files DESC";

    $statement = $db->prepare($query);
    $statement->bindParam(':instituteName', $instituteName, PDO::PARAM_STR);
    $statement->execute();

    // Return the results as JSON
    $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
} else {
    $response['error'] = "Data not received";
    echo json_encode($response);
    exit();
}
?>
