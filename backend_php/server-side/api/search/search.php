<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// // Read the POST data sent from Angular
// $postData = json_decode(file_get_contents("php://input"), true);

// // Check if loggedInUserId and userIdToFollow exist in the received data
// if (isset($postData['loggedInUserId'], $postData['userIdToFollow'])) {
//     $loggedInUserId = $postData['loggedInUserId'];
//     $userIdToFollow = $postData['userIdToFollow'];
//     $response = [];

    // Database credentials
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

 try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set PDO attributes (optional)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Handle connection errors
    echo "Connection failed: " . $e->getMessage();
    exit();
}

$searchQuery = $_GET['query'];

$query = "
    SELECT users.name AS user_name, users.study_at, users.user_id,users.profile_picture,
           files_table.file_name, files_table.file_title, files_table.file_description, files_table.institute_name, files_table.academic_year,files_table.course_code,files_table.course_name,
           user_institutions.institution_name, user_institutions.country
    FROM users
    LEFT JOIN files_table ON users.user_id = files_table.user_id
   LEFT JOIN user_institutions ON users.username = user_institutions.username
    WHERE users.name LIKE '%$searchQuery%'
    OR users.study_at LIKE '%$searchQuery%'
    OR users.profile_picture LIKE '%$searchQuery%'
    OR files_table.file_name LIKE '%$searchQuery%'
    OR files_table.file_title LIKE '%$searchQuery%'
    OR files_table.file_description LIKE '%$searchQuery%'
    OR files_table.institute_name LIKE '%$searchQuery%'
    OR files_table.academic_year LIKE '%$searchQuery%'
    OR files_table.course_name LIKE '%$searchQuery%'
    OR files_table.course_code LIKE '%$searchQuery%'
    OR user_institutions.institution_name LIKE '%$searchQuery%'
    OR user_institutions.country LIKE '%$searchQuery%'
    OR user_institutions.institution_type LIKE '%$searchQuery%'
    GROUP BY users.user_id
";

// Execute the query and fetch results
// $pdo is your PDO database connection
$stmt = $pdo->query($query);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
$response = array(
    "data" => $results // Place your query results under a "data" key in the response
);

// Return results as JSON with pretty print
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>